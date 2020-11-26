import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
    root: {
      transition: 'background-color 150ms ease-in-out',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: theme.palette.background.light,
      },
      padding: theme.spacing(2),
      position: "relative"
    },
    title: {
      margin: 0,
      textAlign: 'center'
    },
    delete: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '0px 0px 4px 0px',
      height: 30,
      position: 'absolute',
      top: 0,
      left: 0,
      width: 30,
      color: '#e6e6e6',
      backgroundColor: theme.palette.secondary.main
    },
    add: {
      '&:hover': {
        backgroundColor: '#FBF5D6',
      },
    }
}));