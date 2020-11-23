import React, { useState, useRef } from 'react';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia';
import Buttons from './Buttons';
import { useStyles } from '../../styles/components/WelcomeWizardStyles';
import { removeCommas } from '../GridRows/GridAddress';

const fields = ["address", "phone", "email", "logo"]

export default function Step2(props) {
    const { email, logo, handleChange,
        handleSubmit, handleSkip } = props;
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [init, setInit] = useState("");
    const [phone, setPhone] = useState("");
    const input = useRef(null)
    const classes = useStyles();

    /**
     * Set full adress for submission
     */
    const handleAddress = () => {
        const addressParts = [removeCommas(address), removeCommas(city), removeCommas(country)].map(part => {
            if (part.length)
                return `${part},`;
            return null
        })
        if (addressParts.indexOf(null) == -1)
            handleChange(addressParts.join(" ").slice(0, -1), "address")
        else
            handleChange("", "address")
    }
    
    /**
     * Set phone number for submission
     */
    const handlePhone = () => {
        handleChange(`${init}-${phone}`, "phone")
    }

    /**
     * Submit the form
     */
    const submit = () => {
        handleAddress();
        handlePhone();
        handleSubmit();
    }

    // Render
    return (
        <div>
            <Typography variant="h5" className={classes.subTitle}>
                את הפרטים הבאים תוכלו להשלים גם בשלב מאוחר יותר, הם יהפכו את חווית השימוש לנוחה יותר עבורכם
            </Typography>
            <ValidatorForm onSubmit={submit} instantValidate={false}>
                <Grid container alignItems="center" spacing={3}>
                    <Grid item xs={2}>
                        <Typography variant="h5">כתובת:</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <TextValidator
                            fullWidth
                            label="רחוב, מספר בית"
                            name="address-address"
                            value={address}
                            onChange={(evt) => setAddress(evt.target.value)}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextValidator
                            fullWidth
                            label="עיר"
                            name="address-city"
                            value={city}
                            onChange={(evt) => setCity(evt.target.value)}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextValidator
                            fullWidth
                            label="מדינה"
                            name="address-country"
                            value={country}
                            onChange={(evt) => setCountry(evt.target.value)}
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <Typography variant="h5">טלפון:</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <TextValidator
                            fullWidth
                            className={classes.numberField}
                            label="מספר"
                            name="number"
                            value={phone}
                            onChange={(evt) => setPhone(evt.target.value)}
                            validators={['matchRegexp:^[0-9]*$']}
                            errorMessages={['מספר לא חוקי']}
                        />
                    </Grid>
                    <Typography variant="h6">-</Typography>
                    <Grid item xs={1}>
                        <TextValidator
                            fullWidth
                            className={classes.numberField}
                            label="קידומת"
                            name="init"
                            value={init}
                            onChange={(evt) => setInit(evt.target.value)}
                            validators={['matchRegexp:^[0-9]*$']}
                            errorMessages={['קידומת לא חוקית']}
                        />
                    </Grid>
                    <Grid item xs={6}></Grid>

                    <Grid item xs={2}>
                        <Typography variant="h5">אימייל:</Typography>
                    </Grid>
                    <Grid item xs={5}>
                        <TextValidator
                            fullWidth
                            className={classes.emailField}
                            name="email"
                            value={email}
                            onChange={(evt) => handleChange(evt.target.value, "email")}
                            validators={['isEmail']}
                            errorMessages={['כתובת לא חוקית']}
                        />
                    </Grid>
                    <Grid item xs={5}></Grid>

                    <Grid item xs={2}>
                        <Typography variant="h5">לוגו:</Typography>
                    </Grid>
                    <Grid item xs={10}>
                        <div className={classes.logoContainer}>
                            { logo &&
                                <Card className={classes.cardContainer}>
                                    <CardMedia
                                        className={classes.logo}
                                        component="img"
                                        image={URL.createObjectURL(logo)}
                                    /> 
                                </Card> }
                            <div className={classes.container}>
                                {!logo ? 
                                    <Button variant="outlined"  color="primary" onClick={() => input.current.click()}>בחר תמונה</Button> :
                                    <div className={classes.twoButtons}>
                                        <Button variant="outlined"  color="primary" onClick={() => input.current.click()}>שנה תמונה</Button> 
                                        <Button variant="outlined"  color="secondary" onClick={() => handleChange("", "logo")}>מחק תמונה</Button> 
                                </div> }
                                <input ref={input} type="file" className={classes.fileInput} onChange={(evt) => handleChange(evt.target.files[0], "logo")} />
                            </div>
                        </div>
                    </Grid>
                </Grid>


                <div className={classes.skipButton}>
                    <Button color="primary" onClick={() => handleSkip(fields)}>השלם אחר כך</Button>
                </div>
                <Buttons {...props} />
            </ValidatorForm>
        </div>
    )
}
