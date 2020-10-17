import React from 'react';
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
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { setExpenses } from '../../hooks/expensesHooks';
import useStyles from '../../styles/pages/newStyles'

import { expenses } from '../../helpers/seed';

export default function Expense(props) {
    const { router } = props;
    const classes = useStyles(props);
    const [
            type, supplier, reference, date, price, vat, total, comments,
            handleChange
        ] = setExpenses();

    const handleSubmit = async () => {
        await axios.post('/api/new/expense')
        router.push('/')
    }

    /** Render */
    return (
        <Container maxWidth='md'>
            <Typography className={classes.title} variant="h3">
                הוצאה חדשה
                <Divider className={classes.dividerRoot}/>
            </Typography>
            <form className={classes.form} noValidate autoComplete="off">
                <Grid container spacing={3}>
                    <Grid item md={3}>
                        <FormControl classes={{ root: classes.root }}>
                            <InputLabel id="expense-type">סוג הוצאה</InputLabel>
                            <Select
                                labelId="expense-type"
                                value={type}
                                onChange={(evt) => handleChange(evt, "type")}
                            >
                                { expenses["type"].map((t, i) => 
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
                                onChange={(evt) => handleChange(evt, "supplier")}
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
                                onChange={(evt) => handleChange(evt, "reference")}
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
                                    onChange={(evt) => handleChange(evt, "date")}
                                    maxDate={new Date()}
                                    format="dd/MM/yyyy"
                                />
                            </MuiPickersUtilsProvider>
                        </FormControl>
                    </Grid>
                    <Grid item md={4}>
                        <FormControl classes={{ root: classes.root }}>
                            <TextField
                                label={`סה"כ לפני מע"מ`}
                                value={price}
                                onChange={(evt) => handleChange(evt, "price")}
                                InputProps={{
                                    endAdornment: <InputAdornment>₪</InputAdornment>,
                                  }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item md={4}>
                        <FormControl classes={{ root: classes.root }}>
                            <TextField
                                label={`מע"מ`}
                                value={vat}
                                onChange={(evt) => handleChange(evt, "vat")}
                                InputProps={{
                                    endAdornment: <InputAdornment>₪</InputAdornment>,
                                  }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item container md={4} alignItems='center'>
                        <Typography className={classes.sum} variant="h5">
                            {`סה"כ: ` + total}
                        </Typography>
                    </Grid>
                    <Grid item md={12}>
                        <FormControl classes={{ root: classes.root }}>
                            <TextField
                                multiline
                                label="הערות"
                                value={comments}
                                onChange={(evt) => handleChange(evt, "comments")}
                            />
                        </FormControl>
                    </Grid>
                </Grid>

                <div className={classes.buttonContainer}>
                    <Button onClick={handleSubmit} variant="contained" color="primary">סיום</Button>
                </div>
            </form>
        </Container>
    )
}
