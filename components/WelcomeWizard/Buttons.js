import React from 'react';
import Button from '@material-ui/core/Button'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { useStyles } from '../../styles/components/WelcomeWizardStyles'

export default function Buttons(props) {
    const { currentStep, totalSteps, nextStep, previousStep, handleSubmit } = props;
    const classes = useStyles();


    return (
        <div className={classes.buttonsContainer}>
            { currentStep > 1 &&
                <Button variant="contained" color="primary" onClick={previousStep}><ArrowForwardIosIcon/></Button> }       
            <Button
                type="submit"
                variant="contained"
                color="primary"
            >
                { currentStep == totalSteps ? "סיום" : <ArrowBackIosIcon /> }
            </Button>
        </div>
    )
}
