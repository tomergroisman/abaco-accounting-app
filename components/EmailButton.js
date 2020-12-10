import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Paper from '@material-ui/core/Paper';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import Popper from '@material-ui/core/Popper';
import Button from '@material-ui/core/Button';
import { sendPDF } from '../helpers/functions';
import { useStyles } from '../styles/components/EmailButtonStyles'

export default function EmailButton(props) {
    const { user, invoiceId, color, variant, noEmail, onSuccess } = props;
    const [anchorEl, setAnchorEl] = useState(null);
    const router = useRouter();
    const classes = useStyles();

    /**
     * Send the invoice PDF to the customer's mail
     */
    const sendToEmail = () => {
        sendPDF(invoiceId, router, noEmail, onSuccess);
    }

    return (
        <div
            onMouseEnter={(evt) => { if (user == "guest") setAnchorEl(evt.currentTarget) } }
            onMouseLeave={() => { if (user == "guest") setAnchorEl(null) } }
            className={classes.container}
        >
            <Button
                onClick={sendToEmail}
                disabled={user == "guest"}
                color={color || "primary"}
                variant={variant || "text"}
            >
                שלח במייל
            </Button>
            <Popper
                className={classes.popper}
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                placement="top"
                transition
            >
                {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={200}>
                    <Paper className={classes.paper}>
                        <Typography variant="caption">האפשרות הזו פתוחה רק למשתמשים רשומים</Typography>
                    </Paper>
                </Fade> )}
            </Popper>
        </div>
    )
}
