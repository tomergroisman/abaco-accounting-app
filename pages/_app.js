import { useState, useEffect } from 'react';
import axios from 'axios';
import { ThemeProvider, StylesProvider, jssPreset } from '@material-ui/core/styles';
import { Alert, AlertTitle} from '@material-ui/lab';
import Container from '@material-ui/core/Container';
import { create } from 'jss';
import rtl from 'jss-rtl';
import auth0 from '../lib/auth0'
import theme from '../styles/theme';
import { useStyles } from  '../styles/global';
import { drawerWidth, sidebarTopPadding } from '../helpers/constants';
import { businessFetcher } from '../helpers/fetchers';
import Sidebar from '../components/Sidebar';
import GuestWelcome from '../components/GuestWelcome';
import { setAlerts } from '../hooks/alertsHooks';

axios.defaults.baseURL = process.env.BASEURL;


// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

function MyApp({ Component, pageProps, userInfo, baseUrl }) {
  const [entry, setEntry] = useState(null);
  const [guestWelcome, setGuestWelcome] = useState(!Boolean(userInfo));
  const [alerts, setStatus] = setAlerts(!Boolean(userInfo));
  const [contentWidth, setContentWidth] = useState(0);
  useStyles();  

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  });
  useEffect(() => {
    if (localStorage.getItem("welcomeGuest")) {
      setGuestWelcome(false);
    }
  }, []);


  const renderAlert = () => {
    for (const key in alerts) {

    }
    return (
      <div>
        { Object.keys(alerts).map(key => 
          alerts[key].isOn &&
          <Container key={key} maxWidth="md" style={{ marginBottom: '24px' }}>
            <Alert severity={alerts[key].severity} onClose={() => setStatus.set(key, false)} style={{ overflow: "auto" }}>
              <AlertTitle>{ alerts[key].title }</AlertTitle>
              { alerts[key].body }
            </Alert>
          </Container>
          )}
      </div>
    )
  }

  return (
    <StylesProvider jss={jss}>
      <ThemeProvider theme={theme}>
        <Sidebar
          user={userInfo}
          setChildWidth={setContentWidth}
          popup={[entry, setEntry]}
          drawerWidth={drawerWidth}
          padding={sidebarTopPadding}
          baseUrl={baseUrl}
        >
          {guestWelcome ?
          <GuestWelcome
            next={() => setGuestWelcome(false)}
          /> :
          <div>
            { renderAlert() }
            <Component width={contentWidth} popup={[entry, setEntry]} setAlertStatus={setStatus} {...pageProps} /> 
          </div> }
        </Sidebar>
      </ThemeProvider>
    </StylesProvider>
  )
}

MyApp.getInitialProps = async (appCtx) => {
  const welcome = "/welcome";
  const { req, res } = appCtx.ctx;
  const session = await auth0.getSession(req);
  const businessInfo = await businessFetcher(session);
  if (!businessInfo?.name && req.url != welcome) {
    res.writeHead(302, {
      Location: welcome,
    });
    res.end();
  }
  if (businessInfo?.name && req.url == welcome) {
    res.writeHead(302, {
      Location: "/",
    });
    res.end();
  }
  return {
    userInfo: session?.user,
    baseUrl: process.env.BASEURL,
  };
}

export default MyApp;
