import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
    fieldRoot: {
        margin: theme.spacing(1),
    },
    textField: {
        width: "50%",
        [theme.breakpoints.down("xs")]: {
            width: "70%",
        }
    },
    addressFieldAddress: {
        width: "40%",
        [theme.breakpoints.down("xs")]: {
            width: "50%",
        }
    },
    addressFieldCity: {
        width: "20%",
        [theme.breakpoints.down("xs")]: {
            width: "30%",
        }
    },
    addressFieldCountry: {
        width: "20%",
        [theme.breakpoints.down("xs")]: {
            width: "30%",
        }
    },
    phoneField: {
        width: "20%",
        [theme.breakpoints.down("xs")]: {
            width: "40%",
        }
    },
    initialPhone: {
        width: '10%',
        [theme.breakpoints.down("xs")]: {
            width: "20%",
        }
    },
    numericalField: {
        direction: "rtl",
        "& input": {
            textAlign: 'center',
        },
    },
    phoneSeperator: {
        position: "relative",
        bottom: theme.spacing(1),
    },
    editMode: {
        "& form > div": {
            width: "100%",
            display: 'inline'
        }
    },
    editModeLogo: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        "& button": {
            margin: theme.spacing(1),
            padding: "5px",
        }
    },
    saveIcon: {
        margin: theme.spacing(1),
        marginLeft: 0,
    },
    saveIconLabel: {
        margin: theme.spacing(2),
        marginLeft: 0,
    },
    setLogoIcons: {
        margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
        marginBottom: 0,
    },
    editIcon: {
        visibility: 'hidden',
    },
    iconContainer: {
        marginLeft: theme.spacing(1),
        [theme.breakpoints.down("xs")]: {
            display: "grid",
            "& svg" : {
                margin: theme.spacing(0.75),
            }
        }
    },
    detailText: {
        display: 'inline-block',
        margin: 0,
        marginRight: theme.spacing(1),
    },
    container: {
        display: 'flex',
        alignItems: 'center',
    },
    justifyCenter: {
        justifyContent: "center"
    },
    hoverRow: {
        margin: "auto",
        "&:hover svg": {
            visibility: 'visible',
        },
        "& .icon": {
            padding: 0,
            border: "none",
            background: "none",
        }
    },
    logo: {
        maxHeight: 200,
        maxWidth: 200,
    },
    fileInput: {
        display: "none"
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        margin: `${theme.spacing(5)}px 0`,
    }
}));