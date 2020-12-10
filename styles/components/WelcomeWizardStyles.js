import { makeStyles } from '@material-ui/core/styles';

const transitionsRoot = {
    animationDuration: '.8192s',
    animationFillMode: 'backwards',
    transformStyle: 'preserve-3d',
};

export const useStyles = makeStyles(theme => ({
    root: {
        overflow: 'hidden',
    },
    businessName: {
      width: "50%"
    },
    subTitle: {
      marginBottom: theme.spacing(5),
    },
    buttonsContainer: {
        display: 'flex',
        justifyContent: 'center',
        "& button": {
            margin: theme.spacing(5),
        }
    },
    skipButton: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    fieldRoot: {
      margin: theme.spacing(1),
    },
    numberField: {
      direction: "rtl",
      "& input": {
        textAlign: "center",
      }
    },
    emailField: {
      direction: "rtl",
    },
    fileInput: {
      display: "none"
    },
    logo: {
      maxHeight: 200,
      maxWidth: 200,
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center'
    },
    cardContainer: {
      marginRight: theme.spacing(4),
    },
    twoButtons: {
      display: 'flex',
      flexDirection: 'column',
      "& button": {
        margin: theme.spacing(1.5),
      }
    },

    enterRight: {
        animation: '$enterRight',
        ...transitionsRoot,
    },
    enterLeft: {
        animation: '$enterLeft',
        ...transitionsRoot,
    },
    exitRight: {
        animation: '$exitRight',
        ...transitionsRoot,
    },
    exitLeft: {
        animation: '$exitLeft',
        ...transitionsRoot,
    },
    "@keyframes enterRight": {
        from: {
          opacity: 0,
          transform: 'translate3d(100%, 0, 0)',
        },
        to: {
          opacity: 1,
        }
      },
    "@keyframes enterLeft": {
        from: {
          opacity: 0,
          transform: 'translate3d(-100%, 0, 0)',
        },
        to: {
          opacity: 1,
        }
      },
    "@keyframes exitRight": {
        from: {
          opacity: 1,
        },
        to: {
          opacity: 0,
          transform: 'translate3d(100%, 0, 0)',
        }
      },
    "@keyframes exitLeft": {
        from: {
          opacity: 1,
        },
        to: {
          opacity: 0,
          transform: 'translate3d(-100%, 0, 0)',
        }
      },
      title: {
        marginTop: theme.spacing(2),
      }
}));