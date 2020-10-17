import { createUseStyles } from "react-jss";

export const useStyles = createUseStyles({
    '@global': {
        'html, body': {
            direction: 'rtl',
            textAlign: 'right',
            padding: 0,
            margin: 0,
            fontFamily: `-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
            Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif`
        }
    }
});