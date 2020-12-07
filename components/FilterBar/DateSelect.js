import React from 'react';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import FormLabel from '@material-ui/core/FormLabel';
import { toLocaleDateString } from '../../helpers/functions';
import { useStyles } from '../../styles/components/FilterBarStyles'

export default function DateSelect(props) {
    const { dates, title,
        handleChangeStart, handleChangeEnd } = props;
    const classes = useStyles();

    // Render
    return (
        <div>
            <FormLabel component="legend">{title}</FormLabel>
            <div className={classes.datePickerContainer}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        fullWidth
                        clearable
                        clearLabel="נקה"
                        cancelLabel=""
                        okLabel=""
                        autoOk
                        className={dates.start && classes.inputRoot}
                        label={!dates.start && "תאריך התחלה"}
                        value={dates.start}
                        onChange={(value) => handleChangeStart(value ? value.toLocaleDateString() : null)}
                        maxDate={new Date()}
                        maxDateMessage="טווח תאריכים לא חוקי"
                        format="dd/MM/yyyy"
                        invalidDateMessage="תאריך לא חוקי"
                    />
                </MuiPickersUtilsProvider>
            </div>
            <div className={classes.datePickerContainer}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        fullWidth
                        clearable
                        clearLabel="נקה"
                        cancelLabel=""
                        okLabel=""
                        autoOk
                        className={dates.end && classes.inputRoot}
                        label={!dates.end && "תאריך סיום"}
                        value={dates.end}
                        onChange={(value) => handleChangeEnd(value ? value.toLocaleDateString() : null)}
                        minDate={dates.start}
                        minDateMessage="טווח תאריכים לא חוקי"
                        format="dd/MM/yyyy"
                        invalidDateMessage="תאריך לא חוקי"
                    />
                </MuiPickersUtilsProvider>
            </div>
        </div>
    )
}
