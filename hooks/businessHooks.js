import { useState } from 'react';

export const setBusiness = (initialItem) => {
    const [name, setName] = useState(initialItem.name),
          [address, setAddress] = useState(initialItem.address),
          [phone, setPhone] = useState(initialItem.phone),
          [email, setEmail] = useState(initialItem.email),
          [logo, setLogo] = useState(initialItem.logo),
          [edit, setEdit] = useState({
              name: false,
              address: false,
              phone: false,
              email: false,
              logo: false,
          });
        
    const setters = {
        name: setName,
        address: setAddress,
        phone: setPhone,
        email: setEmail,
        logo: setLogo,
    }

    /**
     * Handle change function
     * 
     * @param {Object} value - value to update
     * @param {string} key - Key name
     */
    const handleChange = (value, key) => {
        setters[key](value);
    }

    /**
     * Set a field to edit mode
     * 
     * @param {String} field 
     */
    const editField = (field) => {
        setEdit({ ...edit, [field]: true })
    }

    /**
     * Save a field and exit edit mode
     * 
     * @param {String} field 
     */
    const doneEdit = (field) => {
        setEdit({ ...edit, [field]: false })
    }

    const edits = {
        start: editField,
        end: doneEdit,
    }

    /** Export */
    return [
        name, address, phone, email, logo, edit,
        handleChange, edits
    ];
}