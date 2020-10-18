import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ItemButtons from './ItemButtons';
import RowForm from './RowForm';
import { ccyFormat, numberWithCommas } from '../../helpers/functions';
import useStyles from '../../styles/components/ReceiptStyles';

var buttonWidth = 80;

export default function Recieipt(props) {
  const {
    items, subtotal, vat, total,
    addItem, deleteItem, isFormValid
  } = props;
  const classes = useStyles();

  const handleClick = (op, index) => {
    switch (op) {
      case "edit": {
        return
      }
      case "delete": {
        deleteItem(index)
        return
      }
      case "sort": {
        return;
      }
    }
  }

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell classes={{ head: classes.tableHead }}>#</TableCell>
            <TableCell classes={{ head: classes.tableHead }}>פירוט</TableCell>
            <TableCell classes={{ head: classes.tableHead }} align="right">מחיר ליח'</TableCell>
            <TableCell classes={{ head: classes.tableHead }} align="right">כמות</TableCell>
            <TableCell classes={{ head: classes.tableHead }} align="right">סה"כ</TableCell>
            <TableCell width={buttonWidth}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, i) => (
            <TableRow key={item.desc}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{item.desc}</TableCell>
              <TableCell align="right">{item.price}</TableCell>
              <TableCell align="right">{item.qty}</TableCell>
              <TableCell className={classes.sum} align="right">{numberWithCommas(ccyFormat(item.sum))}</TableCell>
              <TableCell><ItemButtons className={classes.buttonContainer} handleClick={handleClick} index={i} /></TableCell>
            </TableRow>
          ))}

          <RowForm addItem={addItem} index={items.length + 1} />

          <TableRow>
            <TableCell rowSpan={3} />
            <TableCell rowSpan={3} />
            <TableCell rowSpan={3} />
            <TableCell colSpan={2}>מחיר לפני מע"מ</TableCell>
            <TableCell className={classes.sum} align="right">{numberWithCommas(ccyFormat(subtotal))}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>מע"מ</TableCell>
            <TableCell align="right">{`${vat}%`}</TableCell>
            <TableCell className={classes.sum} align="right">{numberWithCommas(ccyFormat((vat / 100) * subtotal))}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>סה"כ כולל מע"מ</TableCell>
            <TableCell className={classes.sum} align="right">{numberWithCommas(ccyFormat(total))}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}