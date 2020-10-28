import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
    title: {
        width: 'fit-content',
        marginBottom: theme.spacing(4)
    },
    dividerRoot: {
        marginTop: theme.spacing(0.5),
        position: 'relative',
        left: theme.spacing(2),
        height: '2.5px',
        backgroundColor: ({dividerColor}) => dividerColor ? theme.palette[dividerColor].main : theme.palette.primary.main
    },
}));