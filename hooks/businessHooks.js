import { useState } from 'react';

export const setBusiness = (initialItem) => {
    let init = {
        name: initialItem?.name || "",
        address: initialItem?.address || "",
        phone: initialItem?.phone || "",
        email: initialItem?.email || "",
        logo: initialItem?.logo || null,
    }
    const [name, setName] = useState(init.name),
          [address, setAddress] = useState(init.address),
          [phone, setPhone] = useState(init.phone),
          [email, setEmail] = useState(init.email),
          [logo, setLogo] = useState(init.logo),
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

    /**
     * Reset the specific fields
     * 
     * @param {Array} fields - Array with fields names for reset
     */
    const deleteFields = (fields) => {
        fields.forEach(field => {
            setters[field] = "";
        });
    }

    /** Export */
    return [
        name, address, phone, email, logo, edit,
        handleChange, edits, deleteFields
    ];
}