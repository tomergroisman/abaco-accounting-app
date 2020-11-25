import { makeStyles } from '@material-ui/core/styles';

 export const useStyles = makeStyles(theme => ({
    buttonConteiner: {
        display: 'flex',
        justifyContent: 'center',
        '& button': {
            margin: `0 ${theme.spacing(3)}px`
        }
    },
    container: {
        paddingTop: theme.spacing(6)
    },
    tableContainer: {
        paddingTop: theme.spacing(3),
    },
    tableHead: {
        '& th': {
            fontWeight: 'bold'
        }
    },
    seperatorCell: {
        padding: 0,
        borderTop: 'none',
        borderBottom: 'none',
        height: theme.spacing(2),
        backgroundColor: theme.palette.background.main
    },
    noBottomCell: {
        borderBottom: 'none'
    },
    metadata: {
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3)
    },
    cellTitle: {
        fontWeight: 'bold'
    },
    tableRoot: {
        padding: `${theme.spacing(3)}px 0`
    },
    noMargin: {
        margin: 0,
    }
 }));