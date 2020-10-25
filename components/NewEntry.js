import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import SupplierForm from '../components/EntryForms/SupplierForm';
import CustomerForm from '../components/EntryForms/CustomerForm';
import CategoryForm from '../components/EntryForms/CategoryForm';
import PaymentMethodForm from '../components/EntryForms/PaymentMethodForm';

export default function NewEntry(props) {
    const { entry, close } = props;
    const mapper = {
        supplier: {
            title: "ספק חדש",
            form: <SupplierForm close={close} />,
        },
        customer: {
            title: "לקוח  חדש",
            form: <CustomerForm close={close} />,
        },
        category: {
            title: "קטגוריה חדשה",
            form: <CategoryForm close={close} />,
        },
        paymentMethod: {
            title: "שיטת תשלום חדשה",
            form: <PaymentMethodForm close={close} />,
        },
    }

    return (
        <Dialog open={Boolean(entry)} onClose={close} maxWidth='md' fullWidth>
            {entry &&
            <div>
                <DialogTitle id="form-dialog-title">הוספת {mapper[entry].title}</DialogTitle>
                {mapper[entry].form}
            </div>
            }
        </Dialog>
    );
}