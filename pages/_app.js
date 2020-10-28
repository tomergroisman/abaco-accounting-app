import { useState, useEffect } from 'react'
import axios from 'axios';
import { useRouter } from 'next/router';
import { ThemeProvider, StylesProvider, jssPreset } from '@material-ui/core/styles';
import { Alert, AlertTitle} from '@material-ui/lab';
import Container from '@material-ui/core/Container';
import { create } from 'jss';
import rtl from 'jss-rtl';
import theme from '../styles/theme';
import { useStyles } from  '../styles/global';
import { drawerWidth, sidebarTopPadding } from '../helpers/constants';
import Sidebar from '../components/Sidebar';
import { UserProvider, useFetchUser } from '../lib/user'

axios.defaults.baseURL = 'http://localhost:3000';


// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

function MyApp({ Component, pageProps }) {
  const { user, loading } = useFetchUser();
  const [entry, setEntry] = useState(null);
  const [showAlert, setShowAlert] = useState(true);
  const [contentWidth, setContentWidth] = useState(0);
  const router = useRouter();
  useStyles();

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  });

  const renderAlert = () => {
    return showAlert && (
      <Container maxWidth="md" style={{marginBottom: '24px'}}>
        <Alert severity="warning" onClose={() => setShowAlert(false)}>
          <AlertTitle>שים לב</AlertTitle>
          לא התחברת ולכן אתה מחובר כעת כאורח
        </Alert>
      </Container>
    )
  }

  return (
    <StylesProvider jss={jss}>
      <ThemeProvider theme={theme}>
        <UserProvider value={{user, loading}}>
          <Sidebar setChildWidth={setContentWidth} popup={[entry, setEntry]} drawerWidth={drawerWidth} padding={sidebarTopPadding} >
            {(user && user.name) == "guest" && renderAlert()}
            <Component width={contentWidth} popup={[entry, setEntry]} {...pageProps} />
          </Sidebar>
        </UserProvider>
      </ThemeProvider>
    </StylesProvider>
  )}

export default MyApp;
