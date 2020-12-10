import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
    container: {
        width: 'fit-content',        
    },
    paper: {
        padding: `0 ${theme.spacing(0.5)}px`,
    },
    popper: {
        zIndex: '10000',
    }
}));