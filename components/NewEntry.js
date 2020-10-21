import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import SupplierForm from '../components/EntryForms/SupplierForm';
import CustomerForm from '../components/EntryForms/CustomerForm';
import CategoryForm from '../components/EntryForms/CategoryForm';

const mapper = {
    supplier: {
        title: "ספק חדש",
        form: <SupplierForm />,
    },
    customer: {
        title: "לקוח  חדש",
        form: <CustomerForm />,
    },
    category: {
        title: "קטגוריה חדשה",
        form: <CategoryForm />,
    },
}

export default function NewEntry(props) {
    const { entry, handleClose } = props;
    const [data, setData] = useState(null);

    const handleSubmit = () => {
        handleClose(data)
    }

    return (
        <Dialog open={Boolean(entry)} onClose={() => handleClose()}>
            {entry &&
            <div>
                <DialogTitle id="form-dialog-title">הוספת {mapper[entry].title}</DialogTitle>
                {mapper[entry].form}
            </div>
            }
        </Dialog>
    );
}