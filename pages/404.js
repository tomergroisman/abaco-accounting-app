import React from 'react';
import Typography from '@material-ui/core/Typography';
import { useStyles } from '../styles/pages/404Styles';

export default function PageNotFound(props) {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <img src="https://squid-productions.com/uploads/abaco/public/oops.svg" className={classes.image} />
            <Typography variant="h4" align="center">
                הדף שביקשת לא נמצא!
            </Typography>
        </div>
    )
}
