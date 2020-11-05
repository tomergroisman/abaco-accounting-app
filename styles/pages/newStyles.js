import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
        margin: theme.spacing(1),
        width: '100%',
    },
    form: {
        position: 'relative',
        top: theme.spacing(3)
    },
    sum: {
        marginLeft: theme.spacing(3)
    },
    buttonContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginTop: theme.spacing(4)
    },
    numberField: {
        '& input': {
            direction: 'rtl',
            textAlign: 'left'
        },
        [`& input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button`]: {
            '-webkit-appearance': 'none'
        },
        [`& input[type='number']`]: {
            '-moz-appearance': 'textfield'
        }
    },
    list: {
        "&:nth-child(1)": {
            borderBottom: '1px solid #9A9A9A'
        }
    }
}));

export default useStyles;
