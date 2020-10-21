import { useState, useEffect } from 'react';

export const setExpenses = () => {
    const [category, setCategory] = useState(""),
          [supplier, setSupplier] = useState(""),
          [reference, setReference] = useState(""),
          [date, setDate] = useState(new Date().toLocaleDateString()),
          [price, setPrice] = useState(""),
          [vat, setVat] = useState(""),
          [total, setTotal] = useState(""),
          [comments, setComments] = useState("");

    const setters = {
        category: setCategory,
        supplier: setSupplier,
        reference: setReference,
        date: setDate,
        price: setPrice,
        vat: setVat,
        total: setTotal,
        comments: setComments,
    }

    useEffect(() => {
        if (price && vat)
            setTotal(Number(price) + Number(vat));
        else
            setTotal("");
    }, [price, vat])

    /**
     * Handle change function
     * 
     * @param {Object} evt - Event object
     * @param {string} key - Key name
     */
    const handleChange = (value, key) => {
        setters[key](value);
    }

    /** Export */
    return [
        category, supplier,reference, date, price, vat, total, comments,
        handleChange
    ];
}