import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import { useStyles } from '../styles/components/EntryCardStyles';

export default function EntryCard(props) {
    const { _id, title, openForm, deleteEntry, isAdd } = props;
    const [showDelete, setShowDelete] = useState(false)
    const classes = useStyles();

    /**
     * Handle Delete function
     * 
     * @param {Object} evt - The event object
     */
    const handleDelete = (evt) => {
        evt.stopPropagation();
        deleteEntry(_id);
    }

    // Render
    if (isAdd) {
        return (
            <Card
                onClick={openForm}
                classes={{ root: classes.root }}
                className={classes.add}
                variant="outlined"
            >
                <Typography className={classes.title} color="textSecondary" variant="h5" gutterBottom>
                    <AddIcon />
                </Typography>
            </Card>
        )
    }
    return (
        <Card
            onClick={openForm}
            onMouseEnter={() => setShowDelete(true)}
            onMouseLeave={() => setShowDelete(false)}
            classes={{ root: classes.root }}
            variant="outlined"
        >
            { showDelete && <div onClick={handleDelete} className={classes.delete}><DeleteOutlineIcon /></div>}
            <Typography className={classes.title} color="textSecondary" variant="h5" gutterBottom>
                {title}
            </Typography>
        </Card>
    )
}