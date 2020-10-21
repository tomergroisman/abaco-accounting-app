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
          main: '#ff9999',
          dark: '#ff3333'
        },
        income: {
          main: '#33cc33',
          dark: '#29a329',
        },
      },
      typography: {
        fontFamily: `'Assistant', sans-serif`
      }
    
})

export default theme;