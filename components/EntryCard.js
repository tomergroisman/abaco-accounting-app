import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import Typography from '@material-ui/core/Typography';
import { useStyles } from '../styles/components/EntryCardStyles';

export default function EntryCard(props) {
    const { _id, title, openForm, deleteSupplier } = props;
    const [showDelete, setShowDelete] = useState(false)
    const classes = useStyles();

    /**
     * Toggle the show delete state
     */
    const toggleDelete = () => {
        setShowDelete(!showDelete)
    }

    const handleDelete = (evt) => {
        evt.stopPropagation();
        deleteSupplier(_id);
    }

    // Render
    return (
        <Card
            onClick={openForm}
            onMouseEnter={toggleDelete}
            onMouseLeave={toggleDelete}
            className={classes.root}
            variant="outlined"
        >
            { showDelete &&<div onClick={handleDelete} className={classes.delete}><DeleteOutlineIcon /></div>}
            <Typography className={classes.title} color="textSecondary" variant="h5" gutterBottom>
                {title}
            </Typography>
        </Card>
    )
}