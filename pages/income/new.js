import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import Collapse from '@material-ui/core/Collapse';
import DateFnsUtils from '@date-io/date-fns';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import auth0 from '../../lib/auth0'
import Receipt from '../../components/Receipt/Receipt';
import { setIncome } from '../../hooks/incomeHooks';
import { newIncomeFetcher } from '../../helpers/fetchers';
import { formaDateToSubmit, getUser, downloadPdf } from '../../helpers/functions';
import useStyles from '../../styles/pages/newStyles';
import PageTitle from '../../components/PageTitle';


const start = 401;

/**
 * Round a number up to 2 numbers after the dot
 * 
 * @param {Number} num 
 */
function roundFloat(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}

export default function Income(props) {
    const { popup, user } = props;
    const [entry, setEntry] = popup;
    const classes = useStyles(props);
    const [
            apis, date, customer, items, subtotal, vat, total, category, paymentMethod, reference, comments,
            handleChange, receipt, valid
        ] = setIncome(popup, JSON.parse(props.fetched));
    const { lastIndex, customerList, methodList, categoryList } = apis;
    const [receiptWidth, setReceiptWidth] = useState(0);
    const [pdfDialog, setPdfDialog] = useState(false);
    const router = useRouter();
    const firstUpdate = useRef(true);
    const invoiceNumber = lastIndex + start;

    /**
     * Handle submit function
     */
    const handleSubmit = async () => {
        if (valid.validator.isValid) {
            const data = {
                customer,
                date: formaDateToSubmit(date),
                sumBeforeVat: roundFloat(subtotal),
                vat,
                vatAmount: roundFloat((vat / 100) * subtotal),
                total: roundFloat(total),
                category,
                paymentMethod,
                reference,
                comments,
                items,
                invoiceNumber
            };
            console.log(data)
            const res = await axios.post(`/api/income`, { data });
            await axios.post(`/api/to_pdf?_id=${res.data}`);
            setPdfDialog(true);
        }
    }

    /**
     * Fetch the relevand data from the server (client size fetch)
     */
    const fetchData = async () => {
        const res = await axios.all([
            axios.get(`/api/income?n=true`),
            axios.get(`/api/customer`),
            axios.get(`/api/paymentMethod`),
            axios.get(`/api/category?type=income`),
        ])
        apis.setters.lastIndex(res[0].data);
        apis.setters.customerList(res[1].data.customers.map(customer => customer.name));
        apis.setters.methodList(res[2].data.methods.map(method => method.name));
        apis.setters.categoryList(res[3].data.categories.map(category => category.name));
    }

    /**
     * Send the invoice PDF to the customer's mail
     */
    const sendToEmail = () => {

    }

    /**
     * Download PDF invoice and return to homepage
     */
    const downloadInvoice = async () => {
        downloadPdf(invoiceNumber);
        router.push("/");
    }

    // Validation rules
    useEffect(() => {
        ValidatorForm.addValidationRule('descExists', (value) => {
            if (items.find(item => item.desc == value && !item.edit))
                return false;
            return true;
        });
    }, [items]);

    /**
     * Re-fetch after a new entry was added to the database
     */
    useEffect(() => {
        if (!entry && !firstUpdate.current) {
            fetchData();
        }
        firstUpdate.current = false;
    }, [entry]);
    
    /** ComponentDidMount */
    useEffect(() => {
        setReceiptWidth(document.getElementsByClassName("MuiContainer-root")[0].offsetWidth);
    }, []);
    
    /** Render */
    return (
        <Container maxWidth='md'>
            <Dialog open={pdfDialog}>
                <DialogTitle id="simple-dialog-title">
                    איך תרצה להמשיך?
                </DialogTitle>
                <DialogActions>
                    <Button onClick={downloadInvoice} color="primary">
                        להוריד חשבונית
                    </Button>
                    <Button onClick={() => {}} color="primary">
                         לשלוח ללקוח במייל
                    </Button>
                    <Button onClick={() => router.push("/")} color="secondary" autoFocus>
                        להמשיך לדף הבית
                    </Button>
                </DialogActions>
            </Dialog>
            <PageTitle dividerColor="income">הפקת חשבונית</PageTitle>
            <div>
                <Collapse timeout={0} in={valid.validator.itemsError}>
                    <Alert severity="error">עליך להוסיף פריט אחד לפחות</Alert>
                </Collapse>
                <Collapse timeout={0} in={valid.validator.inEditError}>
                    <Alert severity="error">סיים לערוך את הפריט</Alert>
                </Collapse>
                <Typography variant="h4">
                    חשבונית מספר {invoiceNumber}
                </Typography>
                <ValidatorForm className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                    <Grid item md={3}>
                        <Autocomplete
                                id="autocomplete-income-customer"
                                value={customer}
                                onChange={(evt, newCustomer) => handleChange(newCustomer, "customer")}
                                onInputChange={() => valid.clear("customer")}
                                options={[{adder: true, value: "הוסף לקוח חדש"}, ...customerList]}
                                getOptionLabel={option => option.adder ? option.value : option}
                                classes={{ option: classes.list }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        classes={{ root: classes.root }}
                                        label="לקוח"
                                        error={valid.validator.customer.error}
                                        helperText={valid.validator.customer.error && valid.validator.customer.helperText}
                                    />)}
                                noOptionsText="לא נמצאו תוצאות"
                            />
                        </Grid>
                        <Grid item md={6}></Grid>
                        <Grid item md={3}>
                            <FormControl classes={{ root: classes.root }}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        label="תאריך"
                                        value={date}
                                        onChange={(evt) => handleChange(evt.toLocaleDateString(), "date")}
                                        maxDate={new Date()}
                                        format="dd/MM/yyyy"
                                        invalidDateMessage="תאריך לא חוקי"
                                        autoOk
                                        variant="inline"
                                    />
                                </MuiPickersUtilsProvider>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Receipt
                        items={items}
                        subtotal={subtotal}
                        vat={vat}
                        total={total}
                        method={{ paymentMethod: paymentMethod, methodList: methodList }}
                        handleChange={handleChange}
                        receiptFunctions={receipt}
                        receiptErrors={{
                            itemsError: valid.validator.itemsError,
                            inEditError: valid.validator.inEditError
                        }}
                        valid={valid}
                        colWidth={receiptWidth / 12}
                    />
                    <Grid container spacing={3}>
                        <Grid item md={4}>
                            <Autocomplete
                                id="autocomplete-category"
                                value={category}
                                onChange={(evt, newCategory) => handleChange(newCategory, "category")}
                                onInputChange={() => valid.clear("category")}
                                options={[{adder: true, value: "הוסף קטגוריה חדשה"}, ...categoryList]}
                                getOptionLabel={option => option.adder ? option.value : option}
                                classes={{ option: classes.list }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        classes={{ root: classes.root }}
                                        label="קטגוריה"
                                        error={valid.validator.category.error}
                                        helperText={valid.validator.category.error && valid.validator.category.helperText}
                                    />)}
                                noOptionsText="לא נמצאו תוצאות"
                            />
                        </Grid>
                        <Grid item md={8}>
                            <TextValidator
                                classes={{ root: classes.root }}
                                fullWidth
                                label="אסמכתא"
                                value={reference}
                                onChange={(evt) => handleChange(evt.target.value, "reference")}
                            />
                        </Grid>
                    </Grid>
                    <TextValidator
                        classes={{ root: classes.root }}
                        fullWidth
                        label="הערות"
                        value={comments}
                        onChange={(evt) => handleChange(evt.target.value, "comments")}
                    />
                    <div className={classes.buttonContainer}>
                        <Button type="submit" onClick={valid.validate} variant="contained" color="primary">סיום</Button>
                    </div>
                </ValidatorForm>
            </div>
        </Container>
    )
}

export async function getServerSideProps(ctx) {
    const session = await auth0.getSession(ctx.req);
    const fetched = JSON.stringify(await newIncomeFetcher(session));
    return {
        props: {
            fetched,
            user: getUser(session)
         }
    }
  }