import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import BarLoader from "react-spinners/BarLoader";
import { numberWithCommas } from '../helpers/functions';
import { useFetchUser  } from '../lib/user';
import useLoadingStyles from '../styles/components/LoadingStyles';
import useStyles from '../styles/pages/indexStyles';

// Mapping row index values
const mapper = {
  0: {
    expense: 'supplier',
    income: 'customer'
  }
}

export default function Home() {
  const { user, loading } = useFetchUser();
  const [transactions, setTransactions] = useState([]);
  const [loadingScreen, setLoadingScreen] = useState(true);
  const classes = useStyles();
  const loadingClasses = useLoadingStyles();
  const theme = useTheme();

  /**
   * Format string date to dd/mm/yyyy
   * 
   * @param {String} strDate Date in string format
   */
  const formatDate = (strDate) => {
    const [yyyy, mm, dd] = strDate.replace(/T.*/, "").split("-");
    return `${dd}/${mm}/${yyyy}`
  }

  /**
   * Fetch the relevand data frm the server
   */
  const fetchData = async () => {
    const { data } = await axios.get(`/api/transactions?user=${user.name}`);
    setTransactions(data.transactions);
    setLoadingScreen(false);
  }

  /** ComponentDidMount */
  useEffect(() => {
    if (!loading && user) fetchData();
  }, [loading]);

  if (loadingScreen)
    return (
      <div className={loadingClasses.container}>
        <BarLoader color={theme.palette.primary.main} width={200} height={6}/>
      </div>
    )
  return (
    <Container maxWidth="md">
      <TableContainer component={Paper}>
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
          <TableBody>
            {transactions.map((t, i) => (
              <TableRow key={t._id} className={classes[t.type]}>
                <TableCell><Link href={`/${t.type}/${t._id}`} passHref>
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
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}