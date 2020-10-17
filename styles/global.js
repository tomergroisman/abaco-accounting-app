import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles({
    '@global': {
        'html, body': {
            direction: 'rtl',
            textAlign: 'right',
            padding: 0,
            margin: 0,
            fontFamily: `'Assistant', sans-serif`
        }
    }
});