import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { useStyles } from '../../styles/components/FilterBarStyles'

export default function TypeRadio(props) {
    const { value, handleChange } = props;
    const classes = useStyles();

    // Render
    return (
        <FormControl component="fieldset">
            <FormLabel component="legend">הוצאה/הכנסה</FormLabel>
            <RadioGroup name="type" value={value} onChange={handleChange} className={classes.inputRoot}>
                <div>
                    <FormControlLabel value={"expense"} control={ <Radio color="primary" /> } label="הוצאה" />
                    <FormControlLabel value={"income"} control={ <Radio color="primary" /> } label="הכנסה" />
                </div>
                <FormControlLabel value={"all"} control={ <Radio color="primary" /> } label="הכל" />
            </RadioGroup>
        </FormControl>
    )
}
