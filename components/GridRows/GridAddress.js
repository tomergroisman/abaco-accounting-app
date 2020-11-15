import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import DoneIcon from '@material-ui/icons/Done';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { useStyles } from '../../styles/components/GridFormStyles';


export default function GridAddress(props) {
    const { inEdit, name, value, handleChange, edits, valid } = props;
    const [address, setAddress] = useState(null);
    const [city, setCity] = useState(null);
    const [country, setCountry] = useState(null);
    const classes = useStyles();

    /**
     * Resets address, city and country states to value
     */
    const reset = () => {
        setAddress(value ? value.replace(/(^.*),.*,.*$/, "$1") : "")
        setCity(value ? value.replace(/^.*,(.*),.*/, "$1") : "")
        setCountry(value ? value.replace(/^.*,.*,(.*$)/, "$1") : "")
    }

    /**
     * Removes all the commas of a string
     * 
     * @param {String} str - String to remove the commas from
     */
    const removeCommas = (str) => {
        return str.replace(/,/g, "")
    } 

    /**
     * Handle sbumit function
     */
    const handleSubmit = () => {
        const addressParts = [removeCommas(address), removeCommas(city), removeCommas(country)].map((part, i) => {
            if (part.length)
                return `${part},`;
            return null
        })
        if (addressParts.indexOf(null) == -1)
            handleChange(addressParts.join(" ").slice(0, -1), name)
        else
            handleChange("", name)
        edits.end()
    }

    useEffect(() => {
        reset()
    }, [value])

    return (
        <Grid item xs={10} className={classes.hoverRow}>
            { inEdit ?
            <div className={classes.editMode}>
                <ValidatorForm onSubmit={handleSubmit} instantValidate={false}>
                    <TextValidator
                        label="רחוב, מספר בית"
                        onKeyPress={(evt) => evt.key == "Enter" && handleSubmit}
                        classes={{ root: classes.fieldRoot }}
                        className={classes.addressFieldAddress}
                        value={address}
                        onChange={(evt) => setAddress(evt.target.value)}
                        validators={valid &&  valid.validators}
                        errorMessages={valid &&  valid.errorMessages}
                    />
                    <TextValidator
                        label="עיר"
                        onKeyPress={(evt) => evt.key == "Enter" && handleSubmit}
                        classes={{ root: classes.fieldRoot }}
                        className={classes.addressFieldCity}
                        value={city}
                        onChange={(evt) => setCity(evt.target.value)}
                        validators={valid &&  valid.validators}
                        errorMessages={valid &&  valid.errorMessages}
                    />
                    <TextValidator
                        label="מדינה"
                        onKeyPress={(evt) => evt.key == "Enter" && handleSubmit}
                        classes={{ root: classes.fieldRoot }}
                        className={classes.addressFieldCountry}
                        value={country}
                        onChange={(evt) => setCountry(evt.target.value)}
                        validators={valid &&  valid.validators}
                        errorMessages={valid &&  valid.errorMessages}
                    />
                    <button className="icon" type="submit"><DoneIcon className={classes.saveIconLabel}/></button>
                </ValidatorForm>
            </div> :
            <div className={classes.container}>
                <Typography className={classes.detailText} variant="body1" gutterBottom>
                    {value}
                </Typography>
                { value ?
                    <EditIcon className={classes.editIcon} onClick={() => edits.start()} /> :
                    <AddIcon onClick={() => edits.start()} /> }
            </div> }
        </Grid>
    )
}