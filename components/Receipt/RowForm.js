import React, { useState, useRef } from 'react';
import InputAdornment from '@material-ui/core/InputAdornment';
import { TextValidator} from 'react-material-ui-form-validator';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { setReceiptItems } from '../../hooks/receiptItemHooks';
import ItemButtons from './ItemButtons'
import { ccyFormat, numberWithCommas } from '../../helpers/functions';
import useStyles from '../../styles/components/ReceiptStyles';

export default function RowForm(props) {
    const { addItem, index } = props;
    const [error, setError] = useState({ active: false, message: 'אנא הזן פירוט' });
    const classes = useStyles();
    const [
            desc, price, qty, sum,
            handleChange, validation, clear
        ] = setReceiptItems();
    const refs = [useRef(null), useRef(null), useRef(null)];

    const handleSubmit = async () => {
        const item = {
            desc: desc,
            price: Number(price),
            qty: Number(qty),
            sum: sum
        };
        if (validation(refs)) {
            addItem(item)
            setError({ ...error, active: false });
            clear();
        } else {
            setError({ ...error, active: true });
        }
    }

    /** Render */
    return (
        <TableRow>
            <TableCell>{index}</TableCell>
            <TableCell>
                <TextValidator
                    ref={refs[0]}
                    fullWidth
                    label="פירוט"
                    value={desc}
                    onChange={(evt) => handleChange(evt.target.value, "desc")}
                    error={error.active && !desc.length}
                    helperText={error.active && !desc.length ? error.message : ""}
                    validators={['descExists']}
                    errorMessages={['פריט כבר קיים']}
                />
            </TableCell>
            <TableCell>
                <TextValidator
                    ref={refs[1]}
                    className={classes.numberField}
                    label="מחיר ליחידה"
                    value={price}
                    onChange={(evt) => handleChange(evt.target.value, "price")}
                    InputProps={{
                        endAdornment: <InputAdornment>₪</InputAdornment>,
                        }}
                    validators={['matchRegexp:^[0-9]+[\.]?[0-9]*$|^-[0-9]+[\.]?[0-9]*$']}
                    errorMessages={['ערך לא חוקי']}
                    onFocus={ () => { if (price == 0) handleChange("", "price") } }
                    onBlur={ () => { if (!price) handleChange("0", "price") } }
                />
            </TableCell>
            <TableCell>
                <TextValidator
                    ref={refs[2]}
                    className={classes.numberField}
                    label="כמות"
                    value={qty}
                    onChange={(evt) => handleChange(evt.target.value, "qty")}
                    validators={['matchRegexp:^[0-9]+[\.]?[0-9]*$|^-[0-9]+[\.]?[0-9]*$', 'minNumber:1']}
                    errorMessages={[
                        'ערך לא חוקי',
                        'ערך לא חוקי'
                        ]}
                    onBlur={ () => { if (!qty) handleChange("1", "qty") } }
                />
            </TableCell>
            <TableCell className={classes.sum} align="right">
                {numberWithCommas(ccyFormat(sum))}
            </TableCell>
            <TableCell><ItemButtons handleClick={handleSubmit} edit /></TableCell>
        </TableRow>
    )
}
