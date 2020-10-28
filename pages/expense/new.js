import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { setExpenses } from '../../hooks/expensesHooks';
import { numberWithCommas, formaDateToSubmit } from '../../helpers/functions';
import { useUser } from '../../lib/user';
import useStyles from '../../styles/pages/newStyles';
import Loader from '../../components/Loader';
import PageTitle from '../../components/PageTitle';

export default function Expense(props) {
    const { popup } = props;
    const classes = useStyles(props);
    const [
            apis, category, supplier, reference, date, price, vat, total, comments,
            handleChange, valid
        ] = setExpenses(popup);
    const { categoryList, suppliersList } = apis;
    const [loadingScreen, setLoadingScreen] = useState(true);
    const { user, loading } = useUser();
    const router = useRouter();

    /**
     * Handle submit function
     */
    const handleSubmit = async () => {
        if (valid.validator.isValid) {
            const data = {
                category: category,
                supplier: supplier,
                reference: reference,
                date: formaDateToSubmit(date),
                price: Number(price),
                vat: Number(vat),
                total: total,
                comments: comments,
            }
            await axios.post(`/api/expense?user=${user.name}`, {data: data});
            router.push('/');
        }
    }

    /**
     * Fetch the relevand data frm the server
     */
    const fetchData = async () => {
        const res = await axios.all([
            axios.get(`/api/supplier?user=${user.name}&cols=name`),
            axios.get(`/api/category?user=${user.name}&type='expense'`),
        ]);
        apis.setters.suppliersList(res[0].data.suppliers.map(supplier => supplier.name));
        apis.setters.categoryList(res[1].data.categories.map(category => category.name));
        setLoadingScreen(false)
    }

    /** ComponentDidMount */
    useEffect(() => {
        if (!loading && user) fetchData();
    }, [loading])

    /** Render */
    return (
        <Container maxWidth='md'>
            <PageTitle dividerColor="expense">הוצאה חדשה</PageTitle>
            { loadingScreen ? <Loader /> : 
            <ValidatorForm className={classes.form} onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item md={3}>
                        <Autocomplete
                            id="autocomplete-expense-supplier"
                            value={supplier}
                            onChange={(evt, newSupplier) => handleChange(newSupplier, "supplier")}
                            onInputChange={() => valid.clear("supplier")}
                            options={[{adder: true, value: "הוסף ספק חדש"}, ...suppliersList]}
                            getOptionLabel={option => option.adder ? option.value : option}
                            classes={{ option: classes.list }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    classes={{ root: classes.root }}
                                    label="ספק"
                                    error={valid.validator.supplier.error}
                                    helperText={valid.validator.supplier.error && valid.validator.supplier.helperText}
                                />)}
                            noOptionsText="לא נמצאו תוצאות"
                        />
                    </Grid>
                    <Grid item md={3}>
                        <Autocomplete
                            id="autocomplete-expense-category"
                            value={category}
                            onChange={(evt, newSupplier) => handleChange(newSupplier, "category")}
                            onInputChange={() => valid.clear("category")}
                            options={[{adder: true, value: "הוסף קטגוריה חדש"}, ...categoryList]}
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
                    <Grid item md={4}></Grid>
                    <Grid item md={2}>
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
                    <Grid item md={2}>
                            <TextValidator
                                fullWidth
                                classes={{ root: classes.root }}
                                className={classes.numberField}
                                label={`סה"כ לפני מע"מ`}
                                value={numberWithCommas(price)}
                                onChange={(evt) => handleChange(evt.target.value.replaceAll(",", ""), "price")}
                                InputProps={{
                                    endAdornment: <InputAdornment>₪</InputAdornment>,
                                  }}
                                validators={['matchRegexp:^-?[0-9]*\.*[0-9]*$', 'required']}
                                errorMessages={['אנא הכנס מספר', 'אנא הכנס מספר']}
                            />
                    </Grid>
                    <Grid item md={2}>
                        <TextValidator
                            classes={{ root: classes.root }}
                            fullWidth
                            className={classes.numberField}
                            label={`מע"מ`}
                            value={numberWithCommas(vat)}
                            onChange={(evt) => handleChange(evt.target.value.replaceAll(",", ""), "vat")}
                            InputProps={{
                                endAdornment: <InputAdornment>₪</InputAdornment>,
                                }}
                            validators={['matchRegexp:^-?[0-9]*\.*[0-9]*$', 'minNumber:0']}
                            errorMessages={[
                                'אנא הכנס מספר',
                                'ערך לא חוקי'
                                ]}
                        />
                    </Grid>
                    <Grid item container md={2} alignItems='center'>
                        <TextField
                            disabled
                            label={`סה"כ`}
                            value={numberWithCommas(total)}
                            InputProps={{
                                endAdornment: <InputAdornment>₪</InputAdornment>,
                                }}
                        />
                    </Grid>
                    <Grid item md={1}></Grid>
                    <Grid item md={5}>
                        <TextField
                            classes={{ root: classes.root }}
                            label="אסמכתא"
                            value={reference}
                            onChange={(evt) => handleChange(evt.target.value, "reference")}
                        />
                    </Grid>
                    <Grid item md={12}>
                        <TextField
                            classes={{ root: classes.root }}
                            multiline
                            label="הערות"
                            value={comments}
                            onChange={(evt) => handleChange(evt.target.value, "comments")}
                        />
                    </Grid>
                </Grid>

                <div className={classes.buttonContainer}>
                    <Button type="submit" onClick={valid.validate} variant="contained" color="primary">סיום</Button>
                </div>
            </ValidatorForm>}
        </Container>
    )
}