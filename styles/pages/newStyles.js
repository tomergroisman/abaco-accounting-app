import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
        margin: theme.spacing(1),
        width: '100%',
    },
    title: {
        width: 'fit-content'
    },
    dividerRoot: {
        marginTop: theme.spacing(0.5),
        position: 'relative',
        left: theme.spacing(2),
        height: '2.5px',
        backgroundColor: props => { try { return theme.palette[props.name].main } catch { return} }
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
}));

export default useStyles;
