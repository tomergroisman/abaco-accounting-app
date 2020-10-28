import React from 'react';
import { Typography, Divider } from '@material-ui/core';
import { useStyles } from '../styles/components/TitleStyles';

export default function PageTitle(props) {
    const { children } = props
    const classes = useStyles(props);

    // Render
    return (
        <Typography className={classes.title} variant="h3">
            {children}
            <Divider className={classes.dividerRoot}/>
        </Typography>
    )
}
