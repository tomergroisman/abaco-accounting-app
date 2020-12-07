import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
    '@global': {
        'html, body': {
            direction: 'rtl',
            textAlign: 'right',
            padding: 0,
            margin: 0,
            fontFamily: `'Assistant', sans-serif`,
            [theme.breakpoints.up('xs')]: {
                fontSize: '0.85rem'
            },
            [theme.breakpoints.up('md')]: {
                fontSize: '1.1rem'
            },
        }
    },
}));