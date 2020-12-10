import React, { useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Link from 'next/link'
import Container from '@material-ui/core/Container';

const GuestWelcome = (props) => {
    const { next } = props;

    useEffect(() => {
        return function setLocalStorage() {
            localStorage.setItem('welcomeGuest', true);
        }
    }, [])
    
    // Render
    return (
        <Container>
            <Typography gutterBottom variant="h2">ברוכים הבאים ל-Abaco!</Typography>
            <Typography gutterBottom variant="h5">
                Abaco
                היא אפליקציית רשת לניהול הכנסות והוצאות העסק, הפקת קבלות וניהול ספרי לקוחות וספקים.
            </Typography>
            <Typography gutterBottom variant="h5">
                אינכם מחוברים לחשבון אישי ולכן אתם מחוברים לחשבון "אורח" ציבורי. תוכלו&nbsp;
                <Link href="/api/login"><a>להתחבר</a></Link>
                &nbsp;או&nbsp;
                <Link href="/api/register"><a>להירשם</a></Link>.
            </Typography>
            <Typography gutterBottom variant="h5">
                כדי להמשיך לחקור את Accounting-App כאורח,&nbsp;
                <Link href="/">
                    <a onClick={next}>לחצו כאן</a>
                </Link>.
            </Typography>
            <Typography gutterBottom variant="h5">
                <strong>שימו לב!</strong>&nbsp;
                חשבון "אורח" מתאפס כל 24 שעות. כל הפעולות שתבצעו במהלך היום יימחקו ב-24 השעות הקרובות.
            </Typography>
        </Container>
    );
}

export default GuestWelcome;
