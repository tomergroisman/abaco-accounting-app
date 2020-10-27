import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import DefaultErrorPage from 'next/error';
import BarLoader from "react-spinners/BarLoader";
import { useTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
import { useUser } from '../../lib/user';
import { formaDateToShow } from '../../helpers/functions';
import useLoadingStyles from '../../styles/components/LoadingStyles';
import { useStyles } from '../../styles/pages/showStyles';

export default function ShowExpense(props) {
    const [expense, setExpense] = useState(null);
    const [loadingScreen, setLoadingScreen] = useState(true);
    const { user, loading } = useUser();
    const classes = useStyles(props);
    const loadingClasses = useLoadingStyles();
    const router = useRouter();
    const theme = useTheme();

    const fetchData = async () => {
        const { data } = await axios.get(`/api/expense/${router.query._id}?user=${user.name}`);
        setExpense(data.expense);
        setLoadingScreen(false)
    }

    /** ComponentDidMount */
    useEffect(() => {
        if (!loading && user) fetchData();
    }, [loading])

    // Render
    if (loadingScreen) return (
        <div className={loadingClasses.container}>
            <BarLoader color={theme.palette.primary.main} width={200} height={6}/>
        </div>
    )
    return expense  ? (
        <div className={classes.root}>
            <Container className={classes.container} maxWidth='md'>
                <TableContainer className={classes.tableRoot}>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell width={100} className={classes.cellTitle}>תאריך</TableCell>
                                <TableCell colSpan={2} >{formaDateToShow(expense.date)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell width={100} className={classes.cellTitle}>קטגוריה</TableCell>
                                <TableCell colSpan={2} >{expense.category}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell width={100} className={classes.cellTitle}>ספק</TableCell>
                                <TableCell colSpan={2} >{expense.supplier}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell width={100} className={classes.cellTitle}>אסמכתא</TableCell>
                                <TableCell colSpan={2} >{expense.reference}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell width={100} rowSpan={3} className={classes.cellTitle}>תשלום</TableCell>
                                <TableCell width={150}>סה"כ לפני מע"מ</TableCell>
                                <TableCell>{expense.price}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell width={150}>מע"מ</TableCell>
                                <TableCell>{expense.vat}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell width={150}>סה"כ תשלום</TableCell>
                                <TableCell>{expense.total}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell width={100} className={`${classes.cellTitle} ${classes.noBottomCell}`}>הערות</TableCell>
                                <TableCell colSpan={2} className={classes.noBottomCell}>{expense.comments}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

                <div className={classes.buttonConteiner}>
                    <Button onClick={() => router.back()} variant="contained" size="large" color="primary">חזור</Button>
                </div>
            </Container>
        </div>
        )
        :
        <DefaultErrorPage statusCode={404} />
}