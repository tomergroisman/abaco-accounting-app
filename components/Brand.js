import React, { useContext } from 'react';
import useStyles from '../styles/components/BrandStyles';
import { UserContext } from '../helpers/context';

export default function Brand(props) {
    const { name, router } = props;
    const classes = useStyles(props);
    const user = useContext(UserContext)

    /** Render */
    return (
        <div>
            <div className={classes.gap}></div>
            <div onClick={() => router.push({ pathname: '/', query: {user: user} }, '/')}
                className={classes.container}
            >
                <div className={classes.background}>
                    { name }
                </div>
            </div>
        </div>
    )
}
