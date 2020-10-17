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
      backgroundColor: '#ebeff4',
      borderLeft: 'none'
    },
    drawerContainer: {
      overflow: 'auto',
    },
    content: {
      padding: props => theme.spacing(props.padding),
    },
    listRoot: {
      textAlign: 'right'
    },
  }));