import { ThemeProvider } from 'react-jss'
import theme from '../styles/theme';
import { useStyles } from  '../styles/app';
import axios from 'axios';

axios.defaults.baseURL = 'http://3.8.158.101:3000'

function MyApp({ Component, pageProps }) {
  useStyles()

  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  )}

export default MyApp;
