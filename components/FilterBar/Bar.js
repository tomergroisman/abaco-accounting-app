import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import DateSelect from './DateSelect';
import MultipleSelect from './MultipleSelect';
import TypeRadio from './TypeRadio';
import { useStyles } from '../../styles/components/FilterBarStyles';

export default function Bar(props) {
    const { fields, handleChange, lists } = props;
    const classes = useStyles();

    // Rener
    return (
        <Card variant="outlined" className={classes.card}>
            <CardContent classes={{ root: classes.classContentRoot}}>
                <Grid container spacing={3} classes={{ root: classes.gridRoot }}>
                    <Grid item sm={3} xs={12}>
                        <TypeRadio
                            value={fields.type}
                            handleChange={(evt) => handleChange(evt.target.value, "type")}
                        />
                    </Grid>
                    <Grid item sm={3} xs={12}>
                        <MultipleSelect
                            options={lists.customers}
                            title="לקוח"
                            placeholder="כל הלקוחות"
                            handleChange={(values) => handleChange(values, "customers")}
                            isEmpty={!fields.customers[0]}
                        />
                    </Grid>
                    <Grid item sm={3} xs={12}>
                        <MultipleSelect
                            options={lists.suppliers}
                            title="ספק"
                            placeholder="כל הספקים"
                            handleChange={(values) => handleChange(values, "suppliers")}
                            isEmpty={!fields.suppliers[0]}
                        />
                    </Grid>
                    <Grid item sm={3} xs={12}>
                        <DateSelect
                            title="תאריכים"
                            dates={fields.dates}
                            handleChangeStart={(value) => handleChange({ ...fields.dates, start: value }, "dates")}
                            handleChangeEnd={(value) => handleChange({ ...fields.dates, end: value }, "dates")}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}
