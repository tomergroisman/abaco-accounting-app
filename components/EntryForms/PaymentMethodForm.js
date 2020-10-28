import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router'
import axios from 'axios'
import Grid from '@material-ui/core/Grid'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import { useUser } from '../../lib/user';
import { setPaymentMethod } from '../../hooks/entryHooks';
import { enbleInstantValidate } from '../../helpers/functions';
import useStyles from '../../styles/components/EntryFormsStyles'

export default function PaymentMethodForm(props) {
    const { close } = props;
    const [
        name,
        handleChange
    ] = setPaymentMethod();
    const [paymentMethodList, setPaymentMethodList] = useState(null);
    const { user } = useUser();
    const ref = useRef(null);
    const router = useRouter();
    const classes = useStyles();

    /**
     * Handle submit function
     */
    const handleSubmit = async () => {
        const data = {
            name,
        };
        await axios.post(`/api/paymentMethod?user=${user.name}`, {data: data});
        close();
        router.push(router.pathname);
    }

    /**
     * Fetch the relevand data frm the server
     */
    const fetchData = async () => {
        const { data } = await axios.get(`/api/paymentMethod?user=${user.name}&cols=name&lowerCase=true`);
        setPaymentMethodList(data.methods.map(method => method.name));
    }

    /** ComponentDidMount */
    useEffect(() => {
        fetchData();
    }, []);
    useEffect(() => {
        // Validation rule
        ValidatorForm.addValidationRule('isExists', (value) => {
            if (!value) return true;
            if (supplierList.indexOf(value.toLowerCase()) != -1) return false;
            return true;
        })
    }, [paymentMethodList]);

    return (
        <ValidatorForm ref={ref} instantValidate={false} onSubmit={handleSubmit}>
            <DialogContent classes={{ root: classes.contentRoot }}>
                <Grid container spacing={3}>
                    <Grid item md={5}>
                        <TextValidator
                            fullWidth
                            label="שיטת תשלום"
                            name="name"
                            value={name}
                            onChange={evt => handleChange(evt.target.value, "name")}
                            validators={['isExists', 'required']}
                            errorMessages={['ספק קיים', 'אנא ציין שם ספק']}
                        />
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
                <Button onClick={close} color="secondary">
                    ביטול
                </Button>
                <Button type="submit" onClick={() => enbleInstantValidate(ref.current)}color="primary">
                    סיום
                </Button>
            </DialogActions>
        </ValidatorForm>
    )
}