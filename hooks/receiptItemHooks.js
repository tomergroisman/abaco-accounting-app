import { useState, useEffect } from 'react';

export const setReceiptItems = () => {
    const [desc, setDesc] = useState(""),
          [price, setPrice] = useState(0),
          [qty, setQty] = useState(1),
          [sum, setSum] = useState(0);

    const setters = {
        desc: setDesc,
        price: setPrice,
        qty: setQty,
        sum: setSum,
    }

    useEffect(() => {
        const sum = Number(price) * Number(qty);
        if (!isNaN(sum))
            setSum(sum);
    }, [price, qty])

    /**
     * Handle change function
     * 
     * @param {Object} evt - Event object
     * @param {string} key - Key name
     */
    const handleChange = (value, key) => {
        setters[key](value);
    }

    /**
     * Validate the form for submition
     */
    const validation = (refs) => {
        return refs.every(ref => ref.current.isValid()) && desc;
    }

    /**
     * Clears the form
     */
    const clear = () => {
        setDesc("");
        setPrice(0);
        setQty(1);
        setSum(0);
    }

    /** Export */
    return [
        desc, price, qty, sum,
        handleChange, validation, clear
    ];
}