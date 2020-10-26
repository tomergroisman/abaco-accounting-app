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
      borderLeft: 'none'
    },
    drawerContainer: {
      overflow: 'auto',
    },
    content: {
      padding: props => theme.spacing(props.padding),
      width: '100%',
      // margin: 'auto'
    },
    menu: {
      left: 0,
      right: props => `${props.drawerWidth * 0.75}px`,
    },
    connectionStatus: {
      position: 'absolute',
      bottom: 0,
      padding: `${theme.spacing(5)}px ${theme.spacing(1.5)}px`
    }
  }));