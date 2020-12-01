import { makeStyles } from '@material-ui/core/styles';
import { drawerWidth } from '../../helpers/constants'

export default makeStyles(theme => ({
    root: {
      display: 'flex',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
      backgroundColor: theme.palette.background.main,
      borderLeft: 'none',
      position: 'absolute'

    },
    drawerContainer: {
      overflow: 'auto',
    },
    content: {
      padding: props => theme.spacing(props.padding),
      width: '100%',
      overflow: "auto",
      [theme.breakpoints.down('xs')]: {
        padding: props => `${theme.spacing(props.padding)}px 0`,
      },
    },
    menu: {
      left: 0,
      right: props => `${props.drawerWidth * 0.75}px`,
    },
    connectionStatus: {
      width: drawerWidth - 2 * theme.spacing(1.5),
      padding: `0 ${theme.spacing(1.5)}px`,
      wordWrap: 'break-word'
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center'
    },
    menuButtonContainer: {
      position: 'absolute',
      left: 0,
    },
    menuButton: {
      padding: theme.spacing(3),
      position: 'fixed',
    }
  }));