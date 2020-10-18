import React, { useEffect } from 'react';
import axios from 'axios';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Receipt from '../../components/Receipt/Receipt';
import { setIncome } from '../../hooks/incomeHooks';
import useStyles from '../../styles/pages/newStyles';

import { expenses } from '../../helpers/seed';

export default function Income(props) {
    const { router } = props;
    const classes = useStyles(props);
    const [
            date, customer, items, subtotal, vat, total,
            handleChange, addItem, deleteItem
        ] = setIncome();

    const handleSubmit = async () => {
        const data = {
            date: date,
            customer: customer,
            items: items,
            subtotal: subtotal,
            vat: vat,
            total: total
        }
        console.log("submitted")
        // await axios.post('/api/income', {data: data});
        // router.push('/');
    }

    useEffect(() => {
        ValidatorForm.addValidationRule('descExists', (value) => {
            if (items.find(item => item.desc == value))
                return false;
            return true;
        });
    });

    /** Render */
    return (
        <Container maxWidth='md'>
            <Typography className={classes.title} variant="h3">
                הפקת חשבונית
                <Divider className={classes.dividerRoot}/>
            </Typography>
            <ValidatorForm className={classes.form} onSubmit={handleSubmit}>
                <Grid container spacing={3}>
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
                    <Grid item md={3}>
                        <FormControl classes={{ root: classes.root }}>
                            <InputLabel id="income-customer">לקוח</InputLabel>
                            <Select
                                labelId="income-customer"
                                value={customer}
                                onChange={(evt) => handleChange(evt.target.value, "customer")}
                            >
                                { expenses["supplier"].map((s, i) => 
                                    <MenuItem key={i} value={i}>{s}</MenuItem>
                                ) }
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={4}>
                        פרטי לקוח
                    </Grid>
                    <Grid item md={2}>
                        <FormControl classes={{ root: classes.root }}>
                            <TextValidator
                                fullWidth
                                className={classes.numberField}
                                label={`מע"מ`}
                                value={vat}
                                onChange={(evt) => handleChange(evt.target.value, "vat")}
                                InputProps={{
                                    endAdornment: <InputAdornment>%</InputAdornment>,
                                    }}
                                validators={['matchRegexp:^[0-9]*\.*[0-9]*$']}
                                errorMessages={['אנא הכנס מספר']}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Receipt
                    items={items}
                    subtotal={subtotal}
                    vat={vat}
                    total={total}
                    addItem={addItem}
                    deleteItem={deleteItem}
                />

                <div className={classes.buttonContainer}>
                    <Button onClick={handleSubmit} variant="contained" color="primary">סיום</Button>
                </div>
            </ValidatorForm>
        </Container>
    )
}
