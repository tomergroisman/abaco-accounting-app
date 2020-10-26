import { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import { ThemeProvider, StylesProvider, jssPreset } from '@material-ui/core/styles';
import { create } from 'jss';
import rtl from 'jss-rtl';
import theme from '../styles/theme';
import { useStyles } from  '../styles/global';
import { drawerWidth, sidebarTopPadding } from '../helpers/constants';
import Sidebar from '../components/Sidebar';
import { UserContext } from '../helpers/context'
import axios from 'axios';

axios.defaults.baseURL = 'http://3.8.158.101:8008';

// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

function MyApp({ Component, pageProps }) {
  const [entry, setEntry] = useState(null);
  const [contentWidth, setContentWidth] = useState(0);
  const router = useRouter();
  useStyles();

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  });

  /**
   * Get the current route name
   */
  const getName = () => {
    return router.route.replace(/^.*\//, "");
  }

  return (
    <StylesProvider jss={jss}>
      <ThemeProvider theme={theme}>
        <UserContext.Provider value='guest'>
          <Sidebar setChildWidth={setContentWidth} popup={[entry, setEntry]} drawerWidth={drawerWidth} padding={sidebarTopPadding} >
            <Component width={contentWidth} popup={[entry, setEntry]} name={getName()} {...pageProps} />
          </Sidebar>
        </UserContext.Provider>
      </ThemeProvider>
    </StylesProvider>
  )}

export default MyApp;
