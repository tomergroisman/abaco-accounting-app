import React from 'react';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Typography from '@material-ui/core/Typography'
import Buttons from './Buttons';
import { useStyles } from '../../styles/components/WelcomeWizardStyles';

export default function Step1(props) {
    const { name, handleChange,
        nextStep } = props;
    const classes = useStyles();

    // Render
    return (
        <div>
            <Typography className={classes.subTitle} variant="h5">
                כדי שנדע מי אתם ונוכל לסיים ליצור את חשבנונכם, אנחנו צריכים לדעת עוד כמה פרטים קטנים
            </Typography>
            <ValidatorForm onSubmit={nextStep}>
                <TextValidator
                    classes={{ root: classes.fieldRoot }}
                    className={classes.businessName}
                    label="שם העסק"
                    value={name}
                    name="name"
                    onChange={(evt) => handleChange(evt.target.value, "name")}
                    validators={['required']}
                    errorMessages={["שדה חובה"]}
                />
                <Buttons {...props}/>
            </ValidatorForm>
        </div>
    )
}
