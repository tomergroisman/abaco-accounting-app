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
    }
  }));

export default useStyles;