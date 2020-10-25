import { useState, useEffect } from 'react';

export const setReceiptItems = (item) => {
    let initialVals = {
        desc: "",
        price: 0,
        qty: 1,
        sum: 0,
    }
    if (item) initialVals = { ...item }
    const [desc, setDesc] = useState(initialVals.desc),
          [price, setPrice] = useState(initialVals.price),
          [qty, setQty] = useState(initialVals.qty),
          [sum, setSum] = useState(initialVals.sum);

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