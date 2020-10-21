import React from 'react';
import Grid from '@material-ui/core/Grid'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';

export default function SupplierForm() {
    const handleSubmit = () => {
        return
    }

    return (
        <ValidatorForm onSubmit={handleSubmit}>
            <DialogContent>
                <Grid container>
                    <Grid item>
                        <TextValidator
                            label="שם הספק"
                            name="name"
                            value=""
                            validators={['required']}
                            errorMessages={['אנא ציין שם ספק']}
                        />
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
                <Button onClick={() => handleClose()} color="secondary">
                    ביטול
                </Button>
                <Button type="submit" color="primary">
                    סיום
                </Button>
            </DialogActions>
        </ValidatorForm>
    )
}
