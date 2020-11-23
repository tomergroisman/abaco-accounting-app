import React, { useState, useRef } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import DoneIcon from '@material-ui/icons/Done';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { useStyles } from '../../styles/components/GridFormStyles'

export default function GridPhone(props) {
    const { inEdit, name, value, handleChange, edits, valid } = props;
    const [init, setInit] = useState(value ? value.replace(/-.*$/, "") : "");
    const [main, setMain] = useState(value ? value.replace(/^.*-/, "") : "");
    const mainNumberRef = useRef(null)
    const classes = useStyles();

    /**
     * Handle submit function
     */
    const handleSubmit = () => {
        if (init && main)
            handleChange(`${init}-${main}`, name);
        else
            handleChange("", name);
        edits.end()
    }

    /**
     * Handle key press event
     * Done editing on enter, custom tab functionality
     * 
     * @param {Object} evt - Event object
     * @param {Boolean} isInit - True if the field is the initial number, flase otherwise
     */
    const handleKeyPress = (evt, isInit) => {
        switch (evt.key) {
            case "Enter": {
                handleSubmit();
                break;
            }
            case "Tab": {
                if (isInit) {
                    evt.preventDefault();
                    mainNumberRef.current.select();
                }
                break;
            }
        }
    }

    return (
        <Grid item xs={10} className={classes.hoverRow}>
            { inEdit ?
            <div className={classes.editMode}>
                <ValidatorForm onSubmit={handleSubmit} instantValidate={false}>
                    <TextValidator
                        inputRef={mainNumberRef}
                        onKeyDown={handleKeyPress}
                        classes={{ root: classes.fieldRoot }}
                        className={`${classes.phoneField} ${classes.numericalField}`}
                        value={main}
                        onChange={(evt) => setMain(evt.target.value)}
                        validators={valid &&  valid.validators}
                        errorMessages={valid &&  valid.errorMessages}
                    />
                    <Typography className={classes.phoneSeperator} display="inline" variant="h6">-</Typography>
                    <TextValidator
                        onKeyDown={(evt) => handleKeyPress(evt, true)}
                        classes={{ root: classes.fieldRoot }}
                        className={`${classes.initialPhone} ${classes.numericalField}`}
                        value={init}
                        onChange={(evt) => setInit(evt.target.value)}
                        validators={['matchRegexp:^[0-9]*$']}
                        errorMessages={['קידומת לא חוקית']}
                    />
                    <button className="icon" type="submit"><DoneIcon className={classes.saveIcon}/></button>
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