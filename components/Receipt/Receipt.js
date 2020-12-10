import React, { useState } from 'react';
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
import { DragDropContext, Droppable, Draggable, resetServerContext } from "react-beautiful-dnd";
import ItemButtons from './ItemButtons';
import RowForm from './RowForm';
import { ccyFormat, numberWithCommas } from '../../helpers/functions';
import useStyles from '../../styles/components/ReceiptStyles';

var buttonWidth = 80;

export default function Recieipt(props) {
  const {
    items, subtotal, vat, total, method,
    handleChange, receiptFunctions, receiptErrors, valid, colWidth
  } = props;
  const { add, edit, remove, reorder } = receiptFunctions;
  const { paymentMethod, methodList } = method;
  const classes = useStyles();
  const [disableDrag, setDisableDrag] = useState(false);
  resetServerContext();

  /**
   * Handle change function
   * @param {String} op - The button operation
   * @param {Number} index - The item's index in the items array
   */
  const handleClick = (op, index) => {
    switch (op) {
      case "edit": {
        setDisableDrag(true)
        edit(index)
        return
      }
      case "remove": {
        remove(index)
        return
      }
    }
  }

  /**
   * On drag end function
   * Envoked when the drag in ended
   * @param {Object} results - The dnd results object
   */
  const onDragEnd = (results) => {
    // dropped outside the list
    if (!results.destination) return;

    const { source, destination } = results;
    reorder(source.index, destination.index);
  }

  return (
    <TableContainer>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell width={colWidth / 2} classes={{ head: classes.tableHead }}>#</TableCell>
            <TableCell width={colWidth * 4} classes={{ head: classes.tableHead }}>פירוט</TableCell>
            <TableCell width={colWidth * 2} classes={{ head: classes.tableHead }}>מחיר ליח'</TableCell>
            <TableCell width={colWidth * 2} classes={{ head: classes.tableHead }}>כמות</TableCell>
            <TableCell width={colWidth * 2.5} classes={{ head: classes.tableHead }}>סה"כ</TableCell>
            <TableCell width={colWidth}></TableCell>
          </TableRow>
        </TableHead>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="receipt">
            {provided => (
              <TableBody
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {items.map((item, i) => (
                  item.edit ?
                    <RowForm
                      key={item.desc}
                      edit={edit}
                      index={i}
                      item={item}
                      inEditError={receiptErrors.inEditError}
                      enableDrag={() => setDisableDrag(false)}
                    /> :
                    <Draggable key={item.desc} draggableId={item.desc} index={i} isDragDisabled={disableDrag}>
                      {provided => (
                      <TableRow ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <TableCell onClick={() => handleClick("edit", i)} width={colWidth / 2}>{i + 1}</TableCell>
                        <TableCell onClick={() => handleClick("edit", i)} width={colWidth * 4}>{item.desc}</TableCell>
                        <TableCell onClick={() => handleClick("edit", i)} width={colWidth * 2}>{numberWithCommas(item.price)}</TableCell>
                        <TableCell onClick={() => handleClick("edit", i)} width={colWidth * 2}>{item.qty}</TableCell>
                        <TableCell onClick={() => handleClick("edit", i)} width={colWidth * 2.5} className={classes.sum}>{numberWithCommas(ccyFormat(item.sum))}</TableCell>
                        <TableCell width={colWidth}><ItemButtons className={classes.buttonContainer} handleClick={handleClick} index={i} /></TableCell>
                      </TableRow>
                    )}
                    </Draggable>
                ))}
              {provided.placeholder}
              </TableBody>
            )}
          </Droppable>
        </DragDropContext>

        <TableBody>
          <RowForm add={add} index={items.length} onFocus={() => console.log("HI!")}/>

          <TableRow>
            <TableCell rowSpan={4} />
            <TableCell rowSpan={4} />
            <TableCell rowSpan={4} />
            <TableCell colSpan={2}>מחיר לפני מע"מ</TableCell>
            <TableCell className={classes.sum}>{numberWithCommas(ccyFormat(subtotal))}</TableCell>
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