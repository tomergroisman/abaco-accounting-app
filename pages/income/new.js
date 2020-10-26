import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'
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
import Receipt from '../../components/Receipt/Receipt';
import { setIncome } from '../../hooks/incomeHooks';
import { formaDateToSubmit } from '../../helpers/functions'
import { UserContext } from '../../helpers/context';
import useStyles from '../../styles/pages/newStyles';

const start = 401;

export default function Income(props) {
    const { popup, lastIndex, customerList, methodList, categoryList } = props;
    const classes = useStyles(props);
    const [
            date, customer, items, subtotal, vat, total, category, paymentMethod, reference, comments,
            handleChange, receipt, valid
        ] = setIncome(popup);
    const user = useContext(UserContext);
    const router = useRouter();
    const [receiptWidth, setReceiptWidth] = useState(0)

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
            await axios.post(`/api/income?user=${user}`, {data: data});
            router.push({
                pathname: '/',
                query: {user: user}
            }, '/');
        }
    }

    useEffect(() => {
        setReceiptWidth(document.getElementsByClassName("MuiContainer-root")[0].offsetWidth);
    }, [])
    useEffect(() => {
        ValidatorForm.addValidationRule('descExists', (value) => {
            if (items.find(item => item.desc == value && !item.edit))
                return false;
            return true;
        });
    }, [items]);

    /** Render */
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

Income.getInitialProps = async (ctx) => {
    const { user } = ctx.query;
    const res = await axios.all([
        axios.get(`/api/income?user=${user}&n=true`),
        axios.get(`/api/customer?user=${user}&cols=name`),
        axios.get(`/api/paymentMethod?user=${user}`),
        axios.get(`/api/category?user=${user}&type='income'`),
    ])
    const lastIndex = res[0].data;
    const customerList = res[1].data.customers.map(customer => customer.name);
    const methodList = res[2].data.methods.map(method => method.name);
    const categoryList = res[3].data.categories.map(category => category.name);
    return {
        lastIndex: lastIndex,
        customerList: customerList,
        methodList: methodList,
        categoryList: categoryList,
    };

}