import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
    container: {
        height: '4rem',
        padding: props => `0 ${props.drawerWidth / 15}px`,        
    },
    background: {
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 'auto 0',
        height: '100%',
        fontWeight: 'bold',
        borderRadius: '40px',
        backgroundColor: theme.palette.background.dark,
    },
    gap: {
        height: props => theme.spacing(props.padding)
    }
}));