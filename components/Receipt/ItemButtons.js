import React from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';
import useStyles from '../../styles/components/ReceiptStyles';

export default function ItemButtons(props) {
    const { mode, handleClick, index } = props;
    const classes = useStyles();
    
    switch (mode) {
        case "new": {
            return (
                <div className={classes.buttonContainer}>
                    <AddIcon onClick={handleClick} />
                </div>
            )
        }
        case "edit": {
            return (
                <div className={classes.buttonContainer}>
                    <SaveIcon onClick={handleClick} />
                </div>
            )
        }
        default: {
            return (
                <div className={classes.buttonContainer}>
                    <EditIcon onClick={() => handleClick("edit", index)} />
                    <DeleteIcon onClick={() => handleClick("remove", index)} />
                    <MenuIcon onClick={() => handleClick("sort", index)} />
                </div>
            )
        }
    }
}