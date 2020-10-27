import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useTheme } from '@material-ui/core/styles';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import Collapse from '@material-ui/core/Collapse';
import DateFnsUtils from '@date-io/date-fns';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import BounceLoader from "react-spinners/BounceLoader";
import Receipt from '../../components/Receipt/Receipt';
import { setIncome } from '../../hooks/incomeHooks';
import { formaDateToSubmit } from '../../helpers/functions';
import { useUser } from '../../lib/user';
import useLoadingStyles from '../../styles/components/LoadingStyles';
import useStyles from '../../styles/pages/newStyles';


const start = 401;

export default function Income(props) {
    const { popup } = props;
    const classes = useStyles(props);
    const loadingClasses = useLoadingStyles();
    const [
            apis, date, customer, items, subtotal, vat, total, category, paymentMethod, reference, comments,
            handleChange, receipt, valid
        ] = setIncome(popup);
    const { lastIndex, customerList, methodList, categoryList } = apis;
    const [receiptWidth, setReceiptWidth] = useState(0);
    const [loadingScreen, setLoadingScreen] = useState(true);
    const { user, loading } = useUser();
    const router = useRouter();
    const theme = useTheme();

    /**
     * Handle submit function
     */
    const handleSubmit = async () => {
        if (valid.validator.isValid) {
            const data = {
                customer: customer,
                date: formaDateToSubmit(date),
                vat: vat,
                total: total,
                category: category,
                paymentMethod: paymentMethod,
                reference: reference,
                comments: comments,
                items: items
            }
            await axios.post(`/api/income?user=${user.name}`, {data: data});
            router.push('/');
        }
    }

    /**
     * Fetch the relevand data frm the server
     */
    const fetchData = async () => {
        const res = await axios.all([
            axios.get(`/api/income?user=${user.name}&n=true`),
            axios.get(`/api/customer?user=${user.name}&cols=name`),
            axios.get(`/api/paymentMethod?user=${user.name}`),
            axios.get(`/api/category?user=${user.name}&type='income'`),
        ])
        apis.setters.lastIndex(res[0].data);
        apis.setters.customerList(res[1].data.customers.map(customer => customer.name));
        apis.setters.methodList(res[2].data.methods.map(method => method.name));
        apis.setters.categoryList(res[3].data.categories.map(category => category.name));
        setLoadingScreen(false)
    }

    useEffect(() => {
        ValidatorForm.addValidationRule('descExists', (value) => {
            if (items.find(item => item.desc == value && !item.edit))
                return false;
            return true;
        });
    }, [items]);

    /** ComponentDidMount */
    useEffect(() => {
        if (!loading && user) fetchData();
    }, [loading]);
    
    /** ComponentDidMount */
    useEffect(() => {
        if (!loadingScreen)
            setReceiptWidth(document.getElementsByClassName("MuiContainer-root")[0].offsetWidth);
    }, [loadingScreen]);
    
    /** Render */
    if (loadingScreen)
    return (
        <div className={loadingClasses.container}>
            <BounceLoader color={theme.palette.primary.main} size={150}/>
        </div>
    )
    return (
        <Container maxWidth='md'>
            <Typography className={classes.title} variant="h3">
                הפקת חשבונית
                <Divider className={classes.dividerRoot}/>
            </Typography>
            <Collapse timeout={0} in={valid.validator.itemsError}>
                <Alert severity="error">עליך להוסיף פריט אחד לפחות</Alert>
            </Collapse>
            <Collapse timeout={0} in={valid.validator.inEditError}>
                <Alert severity="error">סיים לערוך את הפריט</Alert>
            </Collapse>
            <Typography variant="h4">
                חשבונית מספר {lastIndex + start}
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
                                    clearable
                                    label="תאריך"
                                    value={date}
                                    onChange={(evt) => handleChange(evt.toLocaleDateString(), "date")}
                                    maxDate={new Date()}
                                    format="dd/MM/yyyy"
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
        </Container>
    )
}