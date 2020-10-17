import { useRouter } from 'next/router'
import { ThemeProvider } from 'react-jss';
import theme from '../styles/theme';
import { useStyles } from  '../styles/global';
import { drawerWidth, sidebarTopPadding } from '../helpers/constants';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

axios.defaults.baseURL = 'http://3.8.158.101:8008'

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  useStyles()

  return (
    <ThemeProvider theme={theme}>
      <Sidebar router={router} drawerWidth={drawerWidth} padding={sidebarTopPadding} >
        <Component router={router} {...pageProps} />
      </Sidebar>
    </ThemeProvider>
  )}

export default MyApp;
