import React from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { numberWithCommas } from '../helpers/functions';

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 650,
  },
  head: {
    '& th': {
      fontWeight: 'bold'
    }
  },
  income: {
    '& td': {
      color: theme.palette.income.dark
    }
  },
  expense: {
    '& td': {
      color: theme.palette.expense.dark
    }
  }
}));

// Mapping row index values
const mapper = {
  0: {
    expense: 'supplier',
    income: 'customer'
  }
}

export default function Home(props) {
  const { transactions } = props;
  const classes = useStyles();

  /**
   * Format string date to dd/mm/yyyy
   * 
   * @param {String} strDate Date in string format
   */
  const formatDate = (strDate) => {
    const [yyyy, mm, dd] = strDate.replace(/T.*/, "").split("-");
    return `${dd}/${mm}/${yyyy}`
  }

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead className={classes.head}>
          <TableRow>
            <TableCell>לקוח/ספק</TableCell>
            <TableCell>תאריך</TableCell>
            <TableCell>סה"כ</TableCell>
            <TableCell>הערות</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map(t => (
            <TableRow key={t._id} className={classes[t.type]}>
              <TableCell>
                {t[mapper[0][t.type]]}
              </TableCell>
              <TableCell>{formatDate(t.date)}</TableCell>
              <TableCell>{numberWithCommas(t.total)}</TableCell>
              <TableCell>{t.comments}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

Home.getInitialProps = async (ctx) => {
  const { user } = ctx.query;
  const { data } = await axios.get(`/api/transactions?user=${user}`);
  return { transactions: data.transactions };
}