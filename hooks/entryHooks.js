import { useState } from 'react';

export const setSupplier = () => {
    const [name, setName] = useState(""),
          [companyId, setCompanyId] = useState(""),
          [address, setAddress] = useState(""),
          [email, setEmail] = useState(""),
          [phone, setPhone] = useState(""),
          [comments, setComments] = useState("");
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

export const setCustomer = () => {
    const [name, setName] = useState(""),
          [address, setAddress] = useState(""),
          [email, setEmail] = useState(""),
          [phone, setPhone] = useState(""),
          [comments, setComments] = useState("");
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

export const setCategory = () => {
    const [type, setType] = useState(""),
          [name, setName] = useState(""),
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
        console.log({ ...validator, error: err })
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

export const setPaymentMethod = () => {
    const [name, setName] = useState("");
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
