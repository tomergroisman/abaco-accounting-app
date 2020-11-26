import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router'
import axios from 'axios'
import Grid from '@material-ui/core/Grid'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import { setCustomer } from '../../hooks/entryHooks';
import { enbleInstantValidate, phoneDisassemble, addressDisassemble } from '../../helpers/functions';
import AddressField, { addressValidationRules } from '../TextFields/AddressField'
import PhoneField, { phoneValidationRules } from '../TextFields/PhoneField'
import useStyles from '../../styles/components/EntryFormsStyles'

export default function CustomerForm(props) {
    const { close, initialItem } = props;
    const [
        name, address, email, phone, comments,
        handleChange
    ] = setCustomer(initialItem);
    const [customerList, setCustomerList] = useState([]);
    const form = useRef(null);
    const [initPhone, afterPhone] = [useRef(null), useRef(null)];
    const router = useRouter();
    const classes = useStyles();

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
        if (initialItem)
            await axios.put(`/api/customer?_id=${initialItem._id}`, {data: data});
        else
            await axios.post(`/api/customer`, {data: data});
        close();
        router.push(router.pathname);
    }
    
    /**
     * Fetch the relevand data frm the server
     */
    const fetchData = async () => {
        const { data } = await axios.get(`/api/customer?cols=name&lowerCase=true`);
        let customerNames = data.customers.map(customer => customer.name)
        if (initialItem){
            const idx = customerNames.indexOf(initialItem.name.toLowerCase());
            customerNames.splice(idx, 1);
        }
        setCustomerList(customerNames);
    }

    /** ComponentDidMount */
    useEffect(() => {
        fetchData();
    }, []);
    /** Validation rules */
    useEffect(() => {
        ValidatorForm.addValidationRule('isExists', (value) => {
            if (!value) return true;
            if (customerList.indexOf(value.toLowerCase()) != -1) return false;
            return true;
        });
        phoneValidationRules(phone);
        addressValidationRules(address);
    }, [customerList, phone, address]);

    return (
        <ValidatorForm ref={form} instantValidate={false} onSubmit={handleSubmit}>
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
                            errorMessages={['לקוח קיים', 'אנא ציין שם לקוח']}
                        />
                    </Grid>
                    <Grid item md={8}></Grid>
                    <Grid item md={10}>
                        <AddressField
                            value={addressDisassemble(address)}
                            handleChange={handleChange}
                            nextInput={initPhone}
                        />
                    </Grid>
                    <Grid item md={5}>
                        <PhoneField
                            value={phoneDisassemble(phone)}
                            handleChange={handleChange}
                            initPhoneRef={initPhone}
                            nextInput={afterPhone}
                        />
                    </Grid>
                    <Grid item md={1}></Grid>
                    <Grid item md={4}>
                        <TextValidator
                            inputRef={afterPhone}
                            fullWidth
                            label="מייל"
                            name="email"
                            value={email}
                            onChange={evt => handleChange(evt.target.value, "email")}
                            validators={['isEmail']}
                            errorMessages={['מייל לא חוקי']}
                        />
                    </Grid>
                    <Grid item md={10}>
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
                <Button type="submit" onClick={() => enbleInstantValidate(form.current)}color="primary">
                    סיום
                </Button>
            </DialogActions>
        </ValidatorForm>
    )
}