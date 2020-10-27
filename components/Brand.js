import React from 'react';
import useStyles from '../styles/components/BrandStyles';

export default function Brand(props) {
    const { name, router } = props;
    const classes = useStyles(props);

    /** Render */
    return (
        <div>
            <div className={classes.gap}></div>
            <div onClick={() => router.push('/')}
                className={classes.container}
            >
                <div className={classes.background}>
                    { name }
                </div>
            </div>
        </div>
    )
}
