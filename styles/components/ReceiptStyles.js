import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    table: {
    },
    tableHead: {
      fontWeight: 'bold'
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-around',
        '& svg': {
            cursor: 'pointer'
        }
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
    }
  });

export default useStyles;