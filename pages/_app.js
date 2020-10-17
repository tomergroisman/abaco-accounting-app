import { useRouter } from 'next/router'
import { ThemeProvider, StylesProvider, jssPreset } from '@material-ui/core/styles';
import { create } from 'jss';
import rtl from 'jss-rtl';
import theme from '../styles/theme';
import { useStyles } from  '../styles/global';
import { drawerWidth, sidebarTopPadding } from '../helpers/constants';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { getDisplayName } from 'next/dist/next-server/lib/utils';

axios.defaults.baseURL = 'http://3.8.158.101:8008';

// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  useStyles();

  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  const getName = () => {
    return router.route.replace(/^.*\//, "");
  }

  return (
    <StylesProvider jss={jss}>
      <ThemeProvider theme={theme}>
        <Sidebar router={router} drawerWidth={drawerWidth} padding={sidebarTopPadding} >
          <Component router={router} name={getName()} {...pageProps} />
        </Sidebar>
      </ThemeProvider>
    </StylesProvider>
  )}

export default MyApp;
