import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import DoneIcon from '@material-ui/icons/Done';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { useStyles } from '../../styles/components/GridFormStyles'

export default function GridText(props) {
    const { inEdit, name, value, handleChange, edits, valid } = props;
    const [editedValue, setEditedValue] = useState(value ? value : "");
    const classes = useStyles();

    /**
     * Handle submit function
     */
    const handleSubmit = () => {
        handleChange (editedValue, name);
        edits.end();
    }

    return (
        <Grid item xs={10} className={classes.hoverRow}>
            { inEdit ?
            <div className={classes.editMode}>
                <ValidatorForm onSubmit={handleSubmit} instantValidate={false}>
                    <TextValidator
                        onKeyPress={(evt) => evt.key == "Enter" && handleSubmit}
                        classes={{ root: classes.fieldRoot }}
                        className={classes.textField}
                        value={editedValue}
                        onChange={(evt) => setEditedValue(evt.target.value)}
                        validators={valid &&  valid.validators}
                        errorMessages={valid &&  valid.errorMessages}
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