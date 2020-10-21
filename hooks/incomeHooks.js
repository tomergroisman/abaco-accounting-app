import { useState, useEffect } from 'react';

export const setIncome = () => {
    const [date, setDate] = useState(new Date().toLocaleDateString()),
          [customer, setCustomer] = useState(""),
          [items, setItems] = useState([]),
          [subtotal, setSubtotal] = useState(0),
          [vat, setVat] = useState(0),
          [total, setTotal] = useState(0),
          [comments, setComments] = useState("");

    const setters = {
        date: setDate,
        customer: setCustomer,
        items: setItems,
        vat: setVat,
        subtotal: setSubtotal,
        total: setTotal,
        comments: setComments
    }

    /**
     * Set subtotal new value after items array changed
     */
    useEffect(() => {
        let newSubtotal = 0;
        items.forEach(item => newSubtotal += item.sum)
        setSubtotal(newSubtotal);
    }, [items])

    /**
     * Set total new value after subtotal value changed
     */
    useEffect(() => {
        if (vat > 0)
            setTotal(subtotal + subtotal * (Number(vat) / 100))
        else
            setTotal(subtotal)
    }, [subtotal, vat])

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
     * Add an item to the items array
     * 
     * @param {Array} item 
     */
    const addItem = (item) => {
        setItems([...items, item]);
    }

    /**
     * Deletes an item from the items array
     * 
     * @param {Number} index - The index of the item to delete
     */
    const deleteItem = (index) => {
        let newItems = [...items];
        newItems.splice(index, 1)
        setItems(newItems);

    }

    /** Export */
    return [
        date, customer, items, subtotal, vat, total, comments,
        handleChange, addItem, deleteItem
    ];
}