import React, { useEffect, useState, useRef, useContext } from 'react';
import { useRouter } from 'next/router'
import axios from 'axios'
import Grid from '@material-ui/core/Grid'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import { setPaymentMethod } from '../../hooks/entryHooks';
import { enbleInstantValidate } from '../../helpers/functions';
import { UserContext } from '../../helpers/context'
import useStyles from '../../styles/components/EntryFormsStyles'

export default function PaymentMethodForm(props) {
    const { close } = props;
    const [
        name,
        handleChange
    ] = setPaymentMethod();
    const classes = useStyles();
    const ref = useRef(null);
    const user = useContext(UserContext);
    const router = useRouter();
    const [paymentMethodList, setPaymentMethodList] = useState(null);

    /**
     * Handle submit function
     */
    const handleSubmit = async () => {
        const data = {
            name,
        };
        await axios.post(`/api/paymentMethod?user=${user}`, {data: data});
        close();
        router.push({
            pathname: router.pathname,
            query: {user: user}
        }, router.pathname);
    }
    
    useEffect(() => {
        // Data fetch
        async function fetchData() {
            const { data } = await axios.get(`/api/paymentMethod?user=${user}&cols=name`);
            setPaymentMethodList(data.methods.map(method => method.name));
        }
        fetchData();
    }, []);
    useEffect(() => {
        // Validation rule
        ValidatorForm.addValidationRule('isExists', (value) => {
            if (paymentMethodList.indexOf(value) != -1) return false;
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