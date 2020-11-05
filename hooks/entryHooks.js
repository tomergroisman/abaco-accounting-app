import { useState } from 'react';

export const setSupplier = (initialItem) => {
    let init;
    if (!initialItem) init = {
        name: "",
        companyId: "",
        address: "",
        email: "",
        phone: "",
        comments: ""
    }
    else init = { ...initialItem, companyId: initialItem.company_id };

    const [name, setName] = useState(init.name),
          [companyId, setCompanyId] = useState(init.companyId),
          [address, setAddress] = useState(init.address),
          [email, setEmail] = useState(init.email),
          [phone, setPhone] = useState(init.phone),
          [comments, setComments] = useState(init.comments);
    const setters = {
        name: setName,
        companyId: setCompanyId,
        address: setAddress,
        email: setEmail,
        phone: setPhone,
        comments: setComments,
    }

    /**
     * Handle change function
     * 
     * @param {Object} evt - Event object
     * @param {string} key - Key name
     */
    const handleChange = (value, key) => {
        setters[key](value)
    }

    // Export
    return [
        name, companyId, address, email, phone, comments,
        handleChange
    ];
}

export const setCustomer = (initialItem) => {
    let init;
    if (!initialItem) init = {
        name: "",
        address: "",
        email: "",
        phone: "",
        comments: ""
    }
    else init = { ...initialItem };

    const [name, setName] = useState(init.name),
          [address, setAddress] = useState(init.address),
          [email, setEmail] = useState(init.email),
          [phone, setPhone] = useState(init.phone),
          [comments, setComments] = useState(init.comments);
    const setters = {
        name: setName,
        address: setAddress,
        email: setEmail,
        phone: setPhone,
        comments: setComments,
    }

    /**
     * Handle change function
     * 
     * @param {Object} evt - Event object
     * @param {string} key - Key name
     */
    const handleChange = (value, key) => {
        setters[key](value)
    }

    // Export
    return [
        name, address, email, phone, comments,
        handleChange
    ];
}

export const setCategory = (initialItem) => {
    let init;
    if (!initialItem) init = {
        type: "",
        name: "",
    }
    else init = { ...initialItem };

    const [type, setType] = useState(init.type),
          [name, setName] = useState(init.name),
          [validator, setValidator] = useState({
              error: false,
              helperText: "לא נבחר סוג קטגוריה"
          });
    const setters = {
        type: setType,
        name: setName
    }

    /**
     * Handle change function
     * 
     * @param {Object} evt - Event object
     * @param {string} key - Key name
     */
    const handleChange = (value, key) => {
        setters[key](value)
        if (key == "type") clearValidator();
    }

    /**
     * Validate the radio form
     */
    const validate = () => {
        const err = type === "";
        setValidator({ ...validator, error: err });
    }

    /**
     * Clear the radio form validation
     */
    const clearValidator = () => {
        setValidator({ ...validator, error: false });
    }

    const valid = {
        validator: validator,
        validate: validate,
        clear: clearValidator
    }

    // Export
    return [
        type, name,
        handleChange,
        valid
    ];
}

export const setPaymentMethod = (initialItem) => {
    let init;
    if (!initialItem) init = {
        name: "",
    }
    else init = { ...initialItem };

    const [name, setName] = useState(init.name);
    const setters = {
        name: setName,
    }

    /**
     * Handle change function
     * 
     * @param {Object} evt - Event object
     * @param {string} key - Key name
     */
    const handleChange = (value, key) => {
        setters[key](value)
    }

    // Export
    return [
        name,
        handleChange
    ];
}
