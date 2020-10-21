import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { v4 as uuid} from 'uuid'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';
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
import { formaDateToSubmit } from '../../helpers/functions'
import { UserContext } from '../../helpers/context';
import useStyles from '../../styles/pages/newStyles';

import { incomes } from '../../helpers/seed';

const start = 401;

export default function Income(props) {
    const { router, lastIndex } = props;
    const classes = useStyles(props);
    const [
            date, customer, items, subtotal, vat, total, comments,
            handleChange, addItem, deleteItem
        ] = setIncome();
    const [alert, setAlert] = useState(false);
    const firstUpdate = useRef(false);
    const user = useContext(UserContext);

    const handleSubmit = async () => {
        if (items.length) {
            const data = {
                _id: uuid(),
                customer: incomes.customer[customer],
                date: formaDateToSubmit(date),
                total: total,
                comments: comments,
                user: user
            }
            await axios.post(`/api/income?user=${user}`, {data: data});
            router.push({ pathname: '/', query: {user: user} });
        } else setAlert(true)
    }

    useEffect(() => {
        ValidatorForm.addValidationRule('descExists', (value) => {
            if (items.find(item => item.desc == value))
                return false;
            return true;
        });
    });
    useEffect(() => {
        if (firstUpdate.current) setAlert(Boolean(!items.length));
        firstUpdate.current = true
    }, [items]);

    /** Render */
    return (
        <Container maxWidth='md'>
            <Typography className={classes.title} variant="h3">
                הפקת חשבונית
                <Divider className={classes.dividerRoot}/>
            </Typography>
            <Collapse timeout={0} in={alert}>
                <Alert severity="error">עליך להוסיף פריט אחד לפחות</Alert>
            </Collapse>
            <Typography variant="h4">
                חשבונית מספר {lastIndex + start}
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
                                { incomes["customer"].map((s, i) => 
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

                <FormControl classes={{ root: classes.root }}>
                    <TextValidator
                        fullWidth
                        label="הערות"
                        value={comments}
                        onChange={(evt) => handleChange(evt.target.value, "comments")}
                    />
                </FormControl>
                <div className={classes.buttonContainer}>
                    <Button onClick={handleSubmit} variant="contained" color="primary">סיום</Button>
                </div>
            </ValidatorForm>
        </Container>
    )
}

Income.getInitialProps = async () => {
    const { data } = await axios.get('/api/income?n=true');
    return { lastIndex: data };
}