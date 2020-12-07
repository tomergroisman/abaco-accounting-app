import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
    container: {
        padding: props => `0 ${props.drawerWidth / 15}px`,        
    },
    background: {
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 'auto 0',
        height: 'fit-content',
        fontWeight: 'bold',
        borderRadius: '40px',
        padding: '10px 10px',
        backgroundColor: theme.palette.background.dark,
        textAlign: 'center',
    },
    gap: {
        height: theme.spacing(4)
    }
}));