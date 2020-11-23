import React, { useState, useRef } from 'react';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useStyles } from '../../styles/components/GridFormStyles';
import { focusInputOnTab } from '../../helpers/functions'

/**
 * Phone field validation rules
 * 
 * @param {String} phone - The full phone string (including "-" symbol)
 */
export function phoneValidationRules(phone) {
    ValidatorForm.addValidationRule('missPhoneInit', () => !(phone[0] == '-'));
    ValidatorForm.addValidationRule('missPhoneMain', () => !(phone[phone.length - 1] == '-'));
}

export default function AddressField(props) {
    const { handleChange, nextInput, initPhoneRef } = props;
    const [init, setInit] = useState("");
    const [phone, setPhone] = useState("");
    const input = useRef(null);
    const classes = useStyles();

    /**
     * Set phone number for submission
     */
    const handlePhone = () => {
        if (!init && !phone)
            handleChange("", "phone");
        else
            handleChange(`${init}-${phone}`, "phone")
    }
    
    return (
        <Grid container alignItems="center" spacing={3}>
            <Grid item xs={8}>
                <TextValidator
                    fullWidth
                    inputRef={input}
                    onBlur={handlePhone}
                    onKeyDown={(evt) => focusInputOnTab(evt, nextInput)}
                    className={classes.numberField}
                    label="מספר"
                    name="number"
                    value={phone}
                    onChange={(evt) => setPhone(evt.target.value)}
                    validators={['matchRegexp:^[0-9]*$', 'missPhoneMain']}
                    errorMessages={['מספר לא חוקי', 'לא הוזן מספר']}
                />
            </Grid>
            <Typography variant="h6">-</Typography>
            <Grid item xs={3}>
                <TextValidator
                    fullWidth
                    inputRef={initPhoneRef}
                    onBlur={handlePhone}
                    onKeyDown={(evt) => focusInputOnTab(evt, input)}
                    className={classes.numberField}
                    label="קידומת"
                    name="init"
                    value={init}
                    onChange={(evt) => setInit(evt.target.value)}
                    validators={['matchRegexp:^[0-9]*$', 'missPhoneInit']}
                    errorMessages={['קידומת לא חוקית', 'לא הוזנה קידומת']}
                />
            </Grid>
        </Grid>
    )
}
