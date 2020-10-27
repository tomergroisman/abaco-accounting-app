import { makeStyles } from '@material-ui/core/styles';

const useLoadingStyles = makeStyles(theme => ({
    container: {
        // animationName: '$loader',
        // animationDuration: '0.7s',
        // animationTimingFunction: 'edge-in-out',
        // animationIterationCount: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: theme.spacing(10),
        height: '150px'
    },
    '@keyframes loader': {
        '0%': {
            opacity: 0,
            transform: 'translate(0px,50px);',
        },
        '70%': { 
            transform: 'translate(0,-25px);',
            opacity: 1
        },
        '100%': { 
            transform: 'translate(0,0);',
        },
    }
}));

export default useLoadingStyles;