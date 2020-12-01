import React from 'react';
import FormLabel from '@material-ui/core/FormLabel';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { useStyles } from '../../styles/components/FilterBarStyles'

export default function MultipleSelect(props) {
    const { options, title, placeholder, isEmpty,
        handleChange } = props;
    const classes = useStyles();

    // Render
    return (
        <div>
            <FormLabel component="legend">{title}</FormLabel>
            <Autocomplete
                className={classes.inputRoot}
                multiple
                options={options}
                getOptionLabel={option => option.name}
                filterSelectedOptions
                noOptionsText="לא נמצא תוצאות"
                onChange={(evt, values) => handleChange(values.map(value => value.name))}
                getOptionSelected={(option, value) => option.name == value.name}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        placeholder={isEmpty ? placeholder : ""}
                    />
                )}
            />
        </div>
    )
}