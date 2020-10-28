import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import SupplierForm from '../components/EntryForms/SupplierForm';
import CustomerForm from '../components/EntryForms/CustomerForm';
import CategoryForm from '../components/EntryForms/CategoryForm';
import PaymentMethodForm from '../components/EntryForms/PaymentMethodForm';

export default function NewEntry(props) {
    const { entry, close } = props;
    const isArray = Array.isArray(entry);
    const name = isArray ? entry[0] : entry;
    const mapper = {
        supplier: {
            titleNew: "ספק חדש",
            titleEdit: "ספק",
            form: <SupplierForm close={close} initialItem={isArray ? entry[1] : null}/>,
        },
        customer: {
            titleNew: "לקוח  חדש",
            titleEdit: "לקוח ",
            form: <CustomerForm close={close} initialItem={isArray ? entry[1] : null}/>,
        },
        category: {
            titleNew: "קטגוריה חדשה",
            titleEdit: "קטגוריה",
            form: <CategoryForm close={close} initialItem={isArray ? entry[1] : null}/>,
        },
        paymentMethod: {
            titleNew: "שיטת תשלום חדשה",
            titleEdit: "שיטת תשלום",
            form: <PaymentMethodForm close={close} initialItem={isArray ? entry[1] : null}/>,
        },
    }

    return (
        <Dialog open={Boolean(entry)} onClose={close} maxWidth='md' fullWidth>
            {entry &&
            <div>
                { !isArray ?
                <DialogTitle id="form-dialog-title">הוספת {mapper[name].titleNew}</DialogTitle> :
                <DialogTitle id="form-dialog-title">עריכת {mapper[name].titleEdit}</DialogTitle> }
                {mapper[name].form}
            </div>
            }
        </Dialog>
    );
}