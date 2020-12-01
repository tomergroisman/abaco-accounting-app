import React from 'react';
import Link from 'next/link';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import InfoIcon from '@material-ui/icons/Info';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import CircularProgress from '@material-ui/core/CircularProgress';
import { numberWithCommas, formaDateToShow } from '../helpers/functions';
import { useStyles } from '../styles/components/TransactionsTableStyles';

// Mapping row index values
const mapper = {
    0: {
      expense: 'supplier',
      income: 'customer'
    }
}

export default function TransactionsTable(props) {
    const { transactions, loading, filter } = props;
    const classes = useStyles();
    
    // Render
    if (!transactions.length)
        return (
            <div className={classes.noTransactionsContainer}>
                <InfoIcon fontSize="large" />
                <Typography className={classes.noTransactionsText} variant="h4">
                    {filter ? 
                    "לא נמצאו תוצאות" :
                    "לא נמצאו הכנסות או הוצאות"
                    }
                </Typography>
            </div>
        )

    return (
        <TableContainer>
            <Table className={classes.table}>
                <TableHead className={classes.head}>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>לקוח/ספק</TableCell>
                        <TableCell>תאריך</TableCell>
                        <TableCell>סה"כ</TableCell>
                        <Hidden xsDown>
                            <TableCell>הערות</TableCell>
                        </Hidden>
                    </TableRow>
                </TableHead>
                <TableBody className={classes.body}>
                    {loading ? 
                    <TableRow>
                        <TableCell colSpan={5}>
                            <div className={classes.loaderContainer}>
                                <CircularProgress />
                            </div>
                        </TableCell>
                    </TableRow> :
                    transactions &&
                    transactions.map((t, i) => (
                    <TableRow key={t._id} className={classes[t.type]}>
                        <TableCell><Link href={`/${t.type}/${t._id}`} as={`/${t.type}/${t._id}`}>
                        <a>
                            {i + 1}
                        </a></Link></TableCell>
                        <TableCell>
                        {t[mapper[0][t.type]]}
                        </TableCell>
                        <TableCell>{formaDateToShow(t.date)}</TableCell>
                        <TableCell>{numberWithCommas(t.total)}</TableCell>
                        <Hidden xsDown>
                            <TableCell>{t.comments}</TableCell>
                        </Hidden>
                    </TableRow>
                    )) }
                </TableBody>
            </Table>
        </TableContainer>
    )
}
