import React from 'react';
import { useRouter } from 'next/router'
import axios from 'axios';
import DefaultErrorPage from 'next/error';
import Container from '@material-ui/core/Container';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
import { formaDateToShow } from '../../helpers/functions';
import { useStyles } from '../../styles/pages/showStyles';

export default function ShowExpense(props) {
    const { expense } = props;
    const classes = useStyles(props);
    const router = useRouter();

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
                    <Button onClick={router.back} variant="contained" size="large" color="primary">חזור</Button>
                </div>
            </Container>
        </div>
        )
        :
        <DefaultErrorPage statusCode={404} />
}

ShowExpense.getInitialProps = async (ctx) => {
    const { user, _id } = ctx.query;
    const { data } = await axios.get(`/api/expense/${_id}?user=${user}`);
    return { expense: data.expense}
}
