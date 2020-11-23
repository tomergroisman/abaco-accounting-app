import { makeStyles } from '@material-ui/core/styles';

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
    }
  }));

export default useStyles;