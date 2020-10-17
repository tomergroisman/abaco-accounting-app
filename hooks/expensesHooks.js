import { useState, useEffect } from 'react';

export const setExpenses = () => {
    const [type, setType] = useState(""),
          [supplier, setSupplier] = useState(""),
          [reference, setReference] = useState(""),
          [date, setDate] = useState(""),
          [price, setPrice] = useState(""),
          [vat, setVat] = useState(""),
          [total, setTotal] = useState(""),
          [comments, setComments] = useState("");

    const setters = {
        type: setType,
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
            setTotal(parseFloat(price) + parseFloat(vat))
    }, [price, vat])

    const handleChange = (evt, field) => {
        setters[field](evt.target.value);
    }

    /** Export */
    return [
        type, supplier,reference, date, price, vat, total, comments,
        handleChange
    ];
}