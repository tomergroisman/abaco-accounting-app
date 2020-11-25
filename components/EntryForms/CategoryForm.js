import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import axios from 'axios'
import Grid from '@material-ui/core/Grid'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { setCategory } from '../../hooks/entryHooks';
import useStyles from '../../styles/components/EntryFormsStyles'

export default function CategoryForm(props) {
    const { close, initialItem } = props;
    const [
        type, name,
        handleChange, valid
    ] = setCategory(initialItem);
    const [categoryList, setCategoryList] = useState([]);
    const router = useRouter();
    const classes = useStyles();

    /**
     * Handle submit function
     */
    const handleSubmit = async () => {
        if (!valid.validator.error) {
            const data = {
                type,
                name
            };
        if (initialItem)
            await axios.put(`/api/category?_id=${initialItem._id}`, {data: data});
        else
            await axios.post(`/api/category`, {data: data});
        close();
        router.push(router.pathname);
        }
    }

    /**
     * Fetch the relevand data frm the server
     */
    const fetchData = async () => {
        const { data } = await axios.get(`/api/category?type=${type}&lowerCase=true`);
        let categoryNames = data.categories.map(category => category.name);
        if (initialItem) {
            const idx = categoryNames.indexOf(initialItem.name.toLowerCase());
            categoryNames.splice(idx, 1);
        }
        setCategoryList(categoryNames);
    }

    /** ComponentDidMount */
    useEffect(() => {
        if (type) fetchData();
    }, [type]);
    /** Validation rules */
    useEffect(() => {
        ValidatorForm.addValidationRule('isExists', (value) => {
            if (!value) return true;
            if (categoryList.indexOf(value.toLowerCase()) != -1) return false;
            return true;
        })
    }, [categoryList]);

    return (
        <ValidatorForm onSubmit={handleSubmit}>
            <DialogContent classes={{ root: classes.contentRoot }}>
                <Grid container spacing={3}>
                    <Grid item md={4}>
                        <FormControl error={valid.validator.error}>
                            <FormLabel>סוג הוצאה</FormLabel>
                            <RadioGroup color="primary" name="type" value={type} onChange={(evt) => handleChange(evt.target.value, "type")}>
                                <FormControlLabel value="income" control={<Radio color="primary" size="small" />} label="הכנסה" />
                                <FormControlLabel value="expense" control={<Radio color="primary" size="small" />} label="הוצאה" />
                            </RadioGroup>
                            <FormHelperText>{valid.validator.error && valid.validator.helperText}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item md={4}>
                        <TextValidator
                            fullWidth
                            label="שם הקטגוריה"
                            name="name"
                            value={name}
                            onChange={evt => handleChange(evt.target.value, "name")}
                            validators={['isExists', 'required']}
                            errorMessages={['קטגוריה קיימת', 'אנא ציין קטגוריה']}
                        />
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
                <Button onClick={close} color="secondary">
                    ביטול
                </Button>
                <Button type="submit" onClick={valid.validate}color="primary">
                    סיום
                </Button>
            </DialogActions>
        </ValidatorForm>
    )
}
