import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
    direction: 'rtl',
    palette: {
        primary: {
          main: "#008ae6"
        },
        secondary: {
          main: "#757575"
        },
        expense: {
          main: '#ff9999'
        },
        income: {
          main: '#33cc33'
        },
      },
      typography: {
        fontFamily: `'Assistant', sans-serif`
      }
    
})

export default theme;