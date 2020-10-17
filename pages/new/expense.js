import React from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import { setExpenses } from '../../hooks/expensesHooks'
import { getTodayDate } from '../../helpers/functions'

import { expenses } from '../../helpers/seed';

const useStyles = makeStyles(theme => ({
    root: {
        margin: theme.spacing(1),
        minWidth: '120px',
    },
}));

export default function Expense(props) {
    const { router } = props;
    const classes = useStyles();
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
        <form noValidate autoComplete="off">
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
            <FormControl classes={{ root: classes.root }}>
                <TextField
                    label="אסמכתא"
                    value={reference}
                    onChange={(evt) => handleChange(evt, "reference")}
                />
            </FormControl>
            <FormControl classes={{ root: classes.root }}>
            <TextField
                label="תאריך"
                type="date"
                defaultValue={getTodayDate()}
                onChange={(evt) => handleChange(evt, "date")}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            </FormControl>
            <FormControl classes={{ root: classes.root }}>
                <TextField
                    label={`סה"כ לפני מע"מ`}
                    value={price}
                    onChange={(evt) => handleChange(evt, "price")}
                />
            </FormControl>
            <FormControl classes={{ root: classes.root }}>
                <TextField
                    label={`מע"מ`}
                    value={vat}
                    onChange={(evt) => handleChange(evt, "vat")}
                />
            </FormControl>
            <Chip label={
                `סה"כ: ` + total
                } />
            <FormControl classes={{ root: classes.root }}>
                <TextField
                    multiline
                    label="הערות"
                    value={comments}
                    onChange={(evt) => handleChange(evt, "comments")}
                />
            </FormControl>

            <Button onClick={handleSubmit} variant="contained">סיום</Button>
        </form>
    )
}
