import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import InputAdornment from '@material-ui/core/InputAdornment';
import { TextValidator } from 'react-material-ui-form-validator';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import ItemButtons from './ItemButtons';
import RowForm from './RowForm';
import { ccyFormat, numberWithCommas } from '../../helpers/functions';
import useStyles from '../../styles/components/ReceiptStyles';

var buttonWidth = 80;

export default function Recieipt(props) {
  const {
    items, subtotal, vat, total, method,
    handleChange, receiptFunctions, receiptErrors, valid
  } = props;
  const { add, edit, remove } = receiptFunctions;
  const { paymentMethod, methodList } = method;
  const classes = useStyles();

  const handleClick = (op, index) => {
    switch (op) {
      case "edit": {
        edit(index)
        return
      }
      case "remove": {
        remove(index)
        return
      }
      case "sort": {
        return;
      }
    }
  }

  return (
    <TableContainer>
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
            item.edit ?
              <RowForm key={item.desc} edit={edit} index={i} item={item} color={receiptErrors.inEditError ? "secondary" : "primary"} /> :
              <TableRow key={item.desc}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{item.desc}</TableCell>
                <TableCell align="right">{numberWithCommas(item.price)}</TableCell>
                <TableCell align="right">{item.qty}</TableCell>
                <TableCell className={classes.sum} align="right">{numberWithCommas(ccyFormat(item.sum))}</TableCell>
                <TableCell><ItemButtons className={classes.buttonContainer} handleClick={handleClick} index={i} /></TableCell>
              </TableRow>
          ))}

          <RowForm add={add} index={items.length} color={receiptErrors.itemsError && "secondary"}/>

          <TableRow>
            <TableCell rowSpan={4} />
            <TableCell rowSpan={4} />
            <TableCell rowSpan={4} />
            <TableCell colSpan={2}>מחיר לפני מע"מ</TableCell>
            <TableCell className={classes.sum} align="right">{numberWithCommas(ccyFormat(subtotal))}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>מע"מ</TableCell>
            <TableCell align="right">
              <TextValidator
                classes={{ root: classes.root }}
                className={classes.numberField}
                value={vat}
                onChange={(evt) => handleChange(evt.target.value, "vat")}
                InputProps={{
                    endAdornment: <InputAdornment>%</InputAdornment>,
                    }}
                validators={['isFloat']}
                errorMessages={['אנא הכנס מספר']}
                onFocus={() => !vat && handleChange("", "vat")}
                onBlur={() => !vat.length && handleChange(0, "vat")}
              />
            </TableCell>
            <TableCell className={classes.sum} align="right">{numberWithCommas(ccyFormat((vat / 100) * subtotal))}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>סה"כ כולל מע"מ</TableCell>
            <TableCell className={classes.sum} align="right">{numberWithCommas(ccyFormat(total))}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3}>
              <Autocomplete
                    id="autocomplete-payment-method"
                    value={paymentMethod}
                    onChange={(evt, newMethod) => handleChange(newMethod, "paymentMethod")}
                    onInputChange={() => valid.clear("paymentMethod")}
                    options={[{adder: true, value: "הוסף שיטת תשלום חדשה"}, ...methodList]}
                    getOptionLabel={option => option.adder ? option.value : option}
                    classes={{ option: classes.list }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            classes={{ root: classes.root }}
                            label="שיטת תשלום"
                            error={valid.validator.paymentMethod.error}
                            helperText={valid.validator.paymentMethod.error && valid.validator.paymentMethod.helperText}
                        />)}
                    noOptionsText="לא נמצאו תוצאות"
                />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}