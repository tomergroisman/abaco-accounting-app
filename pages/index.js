import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Container from '@material-ui/core/Container';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import auth0 from '../lib/auth0';
import { numberWithCommas } from '../helpers/functions';
import { transactionsFetcher } from '../helpers/fetchers';
import Loader from '../components/Loader'
import useStyles from '../styles/pages/indexStyles';

// Mapping row index values
const mapper = {
  0: {
    expense: 'supplier',
    income: 'customer'
  }
}

export default function Home(props) {
  const transactions = JSON.parse(props.transactions);
  // const [transactions, setTransactions] = useState(null);
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

  // /**
  //  * Fetch the relevand data frm the server
  //  */
  // const fetchData = async () => {
  //   const { data } = await axios.get(`/api/transactions`);
  //   setTransactions(data.transactions);
  // }

  // /** ComponentDidMount */
  // useEffect(() => {
  //   fetchData();
  // }, []);

  return (
    <Container maxWidth="md">
      <TableContainer>
        <Table className={classes.table} aria-label="simple table">
          <TableHead className={classes.head}>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>לקוח/ספק</TableCell>
              <TableCell>תאריך</TableCell>
              <TableCell>סה"כ</TableCell>
              <TableCell>הערות</TableCell>
            </TableRow>
          </TableHead>
          { transactions &&
          <TableBody className={classes.body}>
            {transactions.map((t, i) => (
              <TableRow key={t._id} className={classes[t.type]}>
                <TableCell><Link href={`/${t.type}/${t._id}`} as={`/${t.type}/${t._id}`}>
                  <a>
                    {i + 1}
                  </a></Link></TableCell>
                <TableCell>
                  {t[mapper[0][t.type]]}
                </TableCell>
                <TableCell>{formatDate(t.date)}</TableCell>
                <TableCell>{numberWithCommas(t.total)}</TableCell>
                <TableCell>{t.comments}</TableCell>
              </TableRow>
            ))}
          </TableBody> }
        </Table>
      </TableContainer>
      { !transactions && <Loader /> }
    </Container>
  );
}

export async function getServerSideProps(ctx) {
  const session = await auth0.getSession(ctx.req);
  return {
      props: {
          transactions: await transactionsFetcher(session)
      }
  }
}