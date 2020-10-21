import React, { useContext } from 'react';
import axios from 'axios';
import { v1 as uuid} from 'uuid';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { setExpenses } from '../../hooks/expensesHooks';
import { numberWithCommas, formaDateToSubmit } from '../../helpers/functions';
import { UserContext } from '../../helpers/context';
import useStyles from '../../styles/pages/newStyles';

import { expenses } from '../../helpers/seed';

export default function Expense(props) {
    const { router } = props;
    const classes = useStyles(props);
    const [
            category, supplier, reference, date, price, vat, total, comments,
            handleChange
        ] = setExpenses();
    const user = useContext(UserContext);

    const handleSubmit = async () => {
        const data = {
            _id: uuid(),
            category: expenses.expense_type[category],
            supplier: expenses.supplier[supplier],
            reference: reference,
            date: formaDateToSubmit(date),
            price: Number(price),
            vat: Number(vat),
            total: total,
            comments: comments,
        }
        await axios.post(`/api/expense?user=${user}`, {data: data});
        router.push({
            pathname: '/',
            query: {user: user}
        });
    }

    /** Render */
    return (
        <Container maxWidth='md'>
            <Typography className={classes.title} style={{ marginBottom: 0 }} variant="h3">
                הוצאה חדשה
                <Divider className={classes.dividerRoot}/>
            </Typography>
            <ValidatorForm className={classes.form} onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item md={3}>
                        <FormControl classes={{ root: classes.root }}>
                            <InputLabel id="expense-type">קטגוריה</InputLabel>
                            <Select
                                labelId="expense-type"
                                value={category}
                                onChange={(evt) => handleChange(evt.target.value, "category")}
                            >
                                { expenses["expense_type"].map((t, i) => 
                                    <MenuItem key={i} value={i}>{t}</MenuItem>
                                ) }
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={3}>
                        <FormControl classes={{ root: classes.root }}>
                            <InputLabel id="expense-supplier">ספק</InputLabel>
                            <Select
                                labelId="expense-supplier"
                                value={supplier}
                                onChange={(evt) => handleChange(evt.target.value, "supplier")}
                            >
                                { expenses["supplier"].map((s, i) => 
                                    <MenuItem key={i} value={i}>{s}</MenuItem>
                                ) }
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={4}>
                        <FormControl classes={{ root: classes.root }}>
                            <TextField
                                label="אסמכתא"
                                value={reference}
                                onChange={(evt) => handleChange(evt.target.value, "reference")}
                            />
                        </FormControl>
                    </Grid>
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
                    <Grid item md={3}>
                        <FormControl classes={{ root: classes.root }}>
                            <TextValidator
                                fullWidth
                                className={classes.numberField}
                                label={`סה"כ לפני מע"מ`}
                                value={numberWithCommas(price)}
                                onChange={(evt) => handleChange(evt.target.value.replaceAll(",", ""), "price")}
                                InputProps={{
                                    endAdornment: <InputAdornment>₪</InputAdornment>,
                                  }}
                                validators={['matchRegexp:^-?[0-9]*\.*[0-9]*$']}
                                errorMessages={['אנא הכנס מספר']}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item md={3}>
                        <FormControl classes={{ root: classes.root }}>
                            <TextValidator
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
                        </FormControl>
                    </Grid>
                    <Grid item container md={6} alignItems='center'>
                        <Typography className={classes.sum} variant="h5">
                            {`סה"כ: ` + numberWithCommas(total)}
                        </Typography>
                    </Grid>
                    <Grid item md={12}>
                        <FormControl classes={{ root: classes.root }}>
                            <TextField
                                multiline
                                label="הערות"
                                value={comments}
                                onChange={(evt) => handleChange(evt.target.value, "comments")}
                            />
                        </FormControl>
                    </Grid>
                </Grid>

                <div className={classes.buttonContainer}>
                    <Button type="submit" variant="contained" color="primary">סיום</Button>
                </div>
            </ValidatorForm>
        </Container>
    )
}
