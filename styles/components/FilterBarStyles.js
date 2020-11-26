import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
    gridRoot: {
        marginBottom: theme.spacing(2),
    },
    classContentRoot: {
        padding: theme.spacing(3),
        "&:last-child": {
            paddingBottom: 0
        }
    },
    inputRoot: {
        marginTop: theme.spacing(2),
    },
    card: {
        marginBottom: theme.spacing(3)
    }
  }));