import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router'
import axios from 'axios'
import Grid from '@material-ui/core/Grid'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import { setSupplier } from '../../hooks/entryHooks';
import { enbleInstantValidate } from '../../helpers/functions';
import useStyles from '../../styles/components/EntryFormsStyles'

export default function SupplierForm(props) {
    const { close, initialItem } = props;
    const [
        name, companyId, address, email, phone, comments,
        handleChange
    ] = setSupplier(initialItem);
    const [supplierList, setSupplierList] = useState(null);
    const ref = useRef(null);
    const router = useRouter();
    const classes = useStyles();

    /**
     * Handle submit function
     */
    const handleSubmit = async () => {
        const data = {
            name,
            companyId,
            address,
            email,
            phone,
            comments
        };
        if (initialItem)
            await axios.put(`/api/supplier?_id=${initialItem._id}`, {data: data});
        else
            await axios.post(`/api/supplier`, {data: data});
        close();
        router.push(router.pathname);
    }
    
    /**
     * Fetch the relevand data frm the server
     */
    const fetchData = async () => {
        const { data } = await axios.get(`/api/supplier?cols=name&lowerCase=true`);
        let supplierNames = data.suppliers.map(supplier => supplier.name)
        if (initialItem){
            const idx = supplierNames.indexOf(initialItem.name.toLowerCase());
            supplierNames.splice(idx, 1);
        }
        setSupplierList(supplierNames);
    }
    
    /** ComponentDidMount */
    useEffect(() => {
        fetchData();
    }, []);
    /** Validation rules */
    useEffect(() => {
        ValidatorForm.addValidationRule('isExists', (value) => {
            if (!value) return true;
            if (supplierList.indexOf(value.toLowerCase()) != -1) return false;
            return true;
        })
    }, [supplierList]);

    return (
        <ValidatorForm ref={ref} instantValidate={false} onSubmit={handleSubmit}>
            <DialogContent classes={{ root: classes.contentRoot }}>
                <Grid container spacing={3}>
                    <Grid item md={4}>
                        <TextValidator
                            fullWidth
                            label="שם הספק"
                            name="name"
                            value={name}
                            onChange={evt => handleChange(evt.target.value, "name")}
                            validators={['isExists', 'required']}
                            errorMessages={['ספק קיים', 'אנא ציין שם ספק']}
                        />
                    </Grid>
                    <Grid item md={4}>
                        <TextValidator
                            fullWidth
                            label="מזהה חברה"
                            helperText="ח.פ / מספר עוסק / מספר חברה "
                            name="companyNum"
                            value={companyId}
                            onChange={evt => handleChange(evt.target.value, "companyId")}
                        />
                    </Grid>
                    <Grid item md={2}></Grid>
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