import { createUseStyles } from 'react-jss';

export default createUseStyles(theme => ({
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
        fontWeight: '500',
        borderRadius: '40px',
        backgroundColor: '#D0DBE6',
    },
    gap: {
        height: props => theme.spacing(props.padding)
    }
}));