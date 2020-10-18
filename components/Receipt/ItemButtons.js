import React from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import useStyles from '../../styles/components/ReceiptStyles';

export default function ItemButtons(props) {
    const { edit, handleClick, index } = props;
    const classes = useStyles();
    
    if (edit) {
        return (
            <div className={classes.buttonContainer}>
                <AddIcon onClick={handleClick} />
            </div>
        )
    } else {
        return (
            <div className={classes.buttonContainer}>
                <EditIcon onClick={() => handleClick("edit", index)} />
                <DeleteIcon onClick={() => handleClick("delete", index)} />
                <MenuIcon onClick={() => handleClick("sort", index)} />
            </div>
        )
    }
}