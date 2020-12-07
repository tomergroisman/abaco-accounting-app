import React, { useState } from 'react';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Grid from '@material-ui/core/Grid';
import { removeCommas, focusInputOnTab } from '../../helpers/functions';

/**
 * Phone field validation rules
 * 
 * @param {String} phone - The full phone string (including "-" symbol)
 */
export function addressValidationRules(address) {
    const splitAddress = address.split(", ");
    ValidatorForm.addValidationRule('missAddress', () => !address.length || splitAddress[0]);
    ValidatorForm.addValidationRule('missCity', () => !address.length || splitAddress[1]);
    ValidatorForm.addValidationRule('missCountry', () => !address.length || splitAddress[2]);
}

export default function AddressField(props) {
    const { handleChange, nextInput, value } = props;
    const [address, setAddress] = useState(value?.address || "");
    const [city, setCity] = useState(value?.city || "");
    const [country, setCountry] = useState(value?.country || "");

    /**
     * Set full adress for submission
     */
    const handleAddress = () => {
        const addressParts = [removeCommas(address), removeCommas(city), removeCommas(country)].map(part => part.length ? part : null);
        if (addressParts.filter(part => part).length)
            handleChange(addressParts.join(", "), "address");
        else
            handleChange("", "address");
    }
    
    return (
        <Grid container alignItems="center" spacing={3}>
            <Grid item sm={5} xs={7}>
                <TextValidator
                    fullWidth
                    label="רחוב ומספר בית"
                    name="address-address"
                    value={address}
                    onChange={(evt) => setAddress(evt.target.value)}
                    onBlur={handleAddress}
                    validators={['missAddress']}
                    errorMessages={['לא הוזן רחוב ומספר בית']}
                />
            </Grid>
            <Grid item sm={4} xs={5}>
                <TextValidator
                    fullWidth
                    label="עיר"
                    name="address-city"
                    value={city}
                    onChange={(evt) => setCity(evt.target.value)}
                    onBlur={handleAddress}
                    validators={['missCity']}
                    errorMessages={['לא הוזנה עיר']}
                />
            </Grid>
            <Grid item sm={3} xs={5}>
                <TextValidator
                    fullWidth
                    label="מדינה"
                    name="address-country"
                    value={country}
                    onChange={(evt) => setCountry(evt.target.value)}
                    onBlur={handleAddress}
                    onKeyDown={(evt) => focusInputOnTab(evt, nextInput)}
                    validators={['missCountry']}
                    errorMessages={['לא הוזנה מדינה']}
                />
            </Grid>
        </Grid>
    )
}
