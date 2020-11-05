import { makeStyles } from '@material-ui/core/styles';

const borderGlow = 'inset 0px 0px 0px 2px'

const useStyles = makeStyles(theme => ({
    table: {
    },
    tableHead: {
      fontWeight: 'bold',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-around',
        '& svg': {
            cursor: 'pointer'
        }
    },
    newItem: {
      backgroundColor: theme.palette.background.light,
      border: ({color}) => color && `2px solid ${theme.palette[color].main}`,
    },
    editItemGlow: {
      animationName: '$glow-edit',
      animationDuration: '4s',
      animationTimingFunction: 'linear',
      animationIterationCount:'infinite',
    },
    editItemError: {
      animationName: '$glow-error',
      animationDuration: '4s',
      animationTimingFunction: 'linear',
      animationIterationCount:'infinite',
    },
    numberField: {
      '& input': {
          direction: 'rtl',
          textAlign: 'left'
      },
      [`& input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button`]: {
          '-webkit-appearance': 'none'
      },
      [`& input[type='number']`]: {
          '-moz-appearance': 'textfield'
      }
    },
    sum: {
      direction: 'rtl',
      textAlign: 'left'
    },
    list: {
      "&:nth-child(1)": {
          borderBottom: '1px solid #9A9A9A'
      }
    },
    '@keyframes glow-edit': {
      '0%': { boxShadow: `${borderGlow}  ${theme.palette.primary.light}` },
      '35%': { boxShadow: `${borderGlow} ${theme.palette.primary.main}` },
      '65%': { boxShadow: `${borderGlow} ${theme.palette.primary.main}` },
      '100%': { boxShadow: `${borderGlow} ${theme.palette.primary.light}` }
    },
    '@keyframes glow-error': {
      '0%': { boxShadow: `${borderGlow}  ${theme.palette.secondary.light}` },
      '35%': { boxShadow: `${borderGlow} ${theme.palette.secondary.main}` },
      '65%': { boxShadow: `${borderGlow} ${theme.palette.secondary.main}` },
      '100%': { boxShadow: `${borderGlow} ${theme.palette.secondary.light}` }
    }
  }));

export default useStyles;