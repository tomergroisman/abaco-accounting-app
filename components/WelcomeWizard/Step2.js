import React, { useEffect, useRef } from 'react';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia';
import Buttons from './Buttons';
import AddressField, { addressValidationRules } from '../TextFields/AddressField'
import PhoneField, { phoneValidationRules } from '../TextFields/PhoneField'
import { useStyles } from '../../styles/components/WelcomeWizardStyles';
import { removeCommas } from '../../helpers/functions';

const fields = ["address", "phone", "email", "logo"]

export default function Step2(props) {
    const { fullAddress, fullPhone, email, logo,
        handleChange, handleSubmit, handleSkip } = props;
    const fileInput = useRef(null);
    const [initPhone, afterPhone] = [useRef(null), useRef(null)];
    const classes = useStyles();

    /** Validation rules */
    useEffect(() => {
        phoneValidationRules(fullPhone);
        addressValidationRules(fullAddress);
    }, [fullPhone, fullAddress]);

    // Render
    return (
        <div>
            <Typography variant="h5" className={classes.subTitle}>
                את הפרטים הבאים תוכלו להשלים גם בשלב מאוחר יותר, הם יהפכו את חווית השימוש לנוחה יותר עבורכם
            </Typography>
            <ValidatorForm onSubmit={handleSubmit} instantValidate={false}>
                <Grid container alignItems="center" spacing={3}>
                <Grid item xs={2}>
                        <Typography variant="h5">כתובת:</Typography>
                    </Grid>
                    <Grid item xs={9}>
                        <AddressField
                            handleChange={handleChange}
                            nextInput={initPhone}
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <Typography variant="h5">טלפון:</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <PhoneField
                            handleChange={handleChange}
                            initPhoneRef={initPhone}
                            nextInput={afterPhone}
                        />
                    </Grid>
                    <Grid item xs={6}></Grid>

                    <Grid item xs={2}>
                        <Typography variant="h5">אימייל:</Typography>
                    </Grid>
                    <Grid item xs={5}>
                        <TextValidator
                            inputRef={afterPhone}
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
                                    <Button variant="outlined"  color="primary" onClick={() => fileInput.current.click()}>בחר תמונה</Button> :
                                    <div className={classes.twoButtons}>
                                        <Button variant="outlined"  color="primary" onClick={() => fileInput.current.click()}>שנה תמונה</Button> 
                                        <Button variant="outlined"  color="secondary" onClick={() => handleChange("", "logo")}>מחק תמונה</Button> 
                                </div> }
                                <input ref={fileInput} type="file" className={classes.fileInput} onChange={(evt) => handleChange(evt.target.files[0], "logo")} />
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
