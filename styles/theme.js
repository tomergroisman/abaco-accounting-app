import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
    direction: 'rtl',
    palette: {
        primary: {
          main: "#008ae6"
        },
        secondary: {
          main: "#E62400"
        },
        background: {
          light: '#F1F1F1',
          main: '#ebeff4',
          dark: '#D0DBE6',
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