import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import BarLoader from "react-spinners/BarLoader";
import useStyles from '../styles/components/LoadingStyles';

export default function Loader(props) {
    const { width } = props;
    const classes = useStyles();
    const theme = useTheme();

    // Render
    return (
        <div className={classes.container}>
            <BarLoader color={theme.palette.primary.main} width={width || 200} height={6}/>
        </div>
    )
}
