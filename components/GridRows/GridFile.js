import React, { useRef } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import ReplayIcon from '@material-ui/icons/Replay';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import { useStyles } from '../../styles/components/GridFormStyles';

export default function GridText(props) {
    const { inEdit, name, value, handleChange, edits } = props;
    const { current, initial } = value;
    const input = useRef(null)
    const classes = useStyles();

    /**
     * Handle submit function
     */
    const handleSubmit = (evt) => {
        handleChange(evt.target.files[0], name);
        edits.end();
    }

    /**
     * Close the input form
     */
    const close = () => {
        edits.end();
    }

    /**
     * Delete the file and close the form
     */
    const deleteFile = () => {
        handleChange(null, name);
        close();
    }

    return (
        <Grid item xs={10} className={classes.hoverRow}>
            { inEdit ?
            <div className={classes.editModeLogo}>
                <div className={classes.container}>
                    <Button className="chooseImg" variant="outlined"  color="primary" onClick={() => input.current.click()}>בחר תמונה</Button>
                    <input ref={input} type="file" className={classes.fileInput} onChange={handleSubmit} />
                    <CloseIcon className={classes.saveIcon} onClick={close} />
                </div>
            </div> : current ?
                <div className={classes.container}>
                    <Card>
                        <CardMedia
                            className={classes.logo}
                            component="img"
                            image={typeof(current) == "string" ? current : URL.createObjectURL(current)}
                        />
                    </Card>
                    <div className={classes.iconContainer}>
                        <EditIcon className={`icon ${classes.editIcon}`} onClick={() => edits.start()} />
                        <DeleteIcon className={classes.editIcon} onClick={deleteFile} />
                        { typeof(current) == "object" &&
                        <ReplayIcon
                            className={`icon ${classes.editIcon}`}
                            onClick={() => handleChange(initial, name)}
                        /> }
                    </div>
                </div> :
                <div>
                    <AddIcon className="icon" onClick={() => edits.start()} />
                    { initial &&
                    <ReplayIcon
                        className={`icon`}
                        onClick={() => handleChange(initial, name)}
                    /> }
                </div> }
        </Grid>
    )
}