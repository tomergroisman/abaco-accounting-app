import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
    table: {
      tableLayout: "fixed",
      overflow: 'auto',
      ["@media (max-width:450px)"]: {
        tableLayout: "auto",
      }
    },
    head: {
      '& th': {
        fontWeight: 'bold'
      },
      "& th:nth-of-type(1)": {
        width: '10%'
      },
      "& th:nth-of-type(2)": {
        width: '25%'
      },
      "& th:nth-of-type(3)": {
        width: '17.5%'
      },
      "& th:nth-of-type(4)": {
        width: '17.5%'
      },
      "& th:nth-of-type(5)": {
        width: '30%'
      },
    },
    tableRow: {
      cursor: "pointer",
    },
    income: {
      '& td:not(:first-child)': {
        color: theme.palette.income.dark
      }
    },
    expense: {
      '& td:not(:first-child)': {
        color: theme.palette.expense.dark
      }
    },
    body: {
      '& tr:last-of-type td': {
        borderBottom: 'none'
      }
    },
    noTransactionsContainer: {
      display: 'flex',
      alignItems: 'center'
    },
    noTransactionsText: {
      marginLeft: theme.spacing(3)
    },
    loaderContainer: {
      display: 'flex',
      justifyContent: 'center',
    }
  }));