import React from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles(theme => ({
    container: {
        height: '4rem',
        padding: props => `0 ${props.drawerWidth / 15}px`,        
    },
    background: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 'auto 0',
        height: '100%',
        fontWeight: '500',
        borderRadius: '40px',
        backgroundColor: '#D0DBE6',
    },
    gap: {
        height: props => theme.spacing[props.gap - 1]
    }
}));

export default function Brand(props) {
    const { name } = props;
    const classes = useStyles(props);

    return (
        <div>
            <div className={classes.gap}></div>
            <div className={classes.container}>
                <div className={classes.background}>
                    { name }
                </div>
            </div>
        </div>
    )
}
