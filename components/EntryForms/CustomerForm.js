import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router'
import axios from 'axios'
import Grid from '@material-ui/core/Grid'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import { useUser } from '../../lib/user';
import { setCustomer } from '../../hooks/entryHooks';
import { enbleInstantValidate } from '../../helpers/functions';
import useStyles from '../../styles/components/EntryFormsStyles'

export default function CustomerForm(props) {
    const { close } = props;
    const [
        name, address, email, phone, comments,
        handleChange
    ] = setCustomer();
    const [customerList, setCustomerList] = useState(null);
    const { user } = useUser();
    const classes = useStyles();
    const ref = useRef(null);
    const router = useRouter();

    /**
     * Handle submit function
     */
    const handleSubmit = async () => {
        const data = {
            name,
            address,
            email,
            phone,
            comments
        };
        await axios.post(`/api/customer?user=${user.name}`, {data: data});
        close();
        router.push(router.pathname);
    }
    
    /**
     * Fetch the relevand data frm the server
     */
    const fetchData = async () => {
        const { data } = await axios.get(`/api/customer?user=${user.name}&cols=name&lowerCase=true`);
        setCustomerList(data.customers.map(customer => customer.name));
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
    }, [customerList]);

    return (
        <ValidatorForm ref={ref} instantValidate={false} onSubmit={handleSubmit}>
            <DialogContent classes={{ root: classes.contentRoot }}>
                <Grid container spacing={3}>
                    <Grid item md={4}>
                        <TextValidator
                            fullWidth
                            label="שם הלקוח"
                            name="name"
                            value={name}
                            onChange={evt => handleChange(evt.target.value, "name")}
                            validators={['isExists', 'required']}
                            errorMessages={['ספק קיים', 'אנא ציין שם ספק']}
                        />
                    </Grid>
                    <Grid item md={8}></Grid>
                    <Grid item md={4}>
                        <TextValidator
                            fullWidth
                            label="כתובת"
                            name="address"
                            value={address}
                            onChange={evt => handleChange(evt.target.value, "address")}
                        />
                    </Grid>
                    <Grid item md={4}>
                        <TextValidator
                            fullWidth
                            label="טלפון"
                            name="phone"
                            value={phone}
                            onChange={evt => handleChange(evt.target.value, "phone")}
                            validators={['matchRegexp:^[0-9]+$']}
                            errorMessages={['מספר טלפון לא חוקי']}
                        />
                    </Grid>
                    <Grid item md={4}>
                        <TextValidator
                            fullWidth
                            label="מייל"
                            name="email"
                            value={email}
                            onChange={evt => handleChange(evt.target.value, "email")}
                            validators={['isEmail']}
                            errorMessages={['מייל לא חוקי']}
                        />
                    </Grid>
                    <Grid item md={12}>
                        <TextValidator
                            fullWidth
                            label="הערות"
                            name="comments"
                            value={comments}
                            onChange={evt => handleChange(evt.target.value, "comments")}
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