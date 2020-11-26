import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { formaDateToSubmit } from '../helpers/functions'

export const setFilter = (initialTransactions) => {
    const init = {
        type: "all",
        customers: [],
        suppliers: [],
        dates: {
            start: null,
            end: null
        },
    }
    const [transactions, setTransactions] = useState(initialTransactions);
    const [type, setType] = useState(init.type),
          [customers, setCustomers] = useState(init.customers),
          [suppliers, setSuppliers] = useState(init.suppliers),
          [dates, setDates] = useState(init.dates);
    const [loading, setLoading] = useState(false);
    const firstUpdate = useRef(true);
        
    const setters = {
        type: setType,
        customers: setCustomers,
        suppliers: setSuppliers,
        dates: setDates,
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

    // Fields Array
    const fieldsArray = [
        type,
        customers,
        suppliers,
        dates,
    ]
    // Fields object
    const fields = { 
        type,
        customers,
        suppliers,
        dates,
    }

    useEffect(() => {
        const submitionFormatDates = {
            start: dates.start ? formaDateToSubmit(dates.start) : null,
            end: dates.end ? formaDateToSubmit(dates.end) : null
        }
        async function fetchData() {
            setLoading(true);
            const res = await axios.get('/api/transactions', { params: { ...fields, dates: submitionFormatDates } });
            setLoading(false);
            setTransactions(res.data.transactions)
        }
        
        if (!firstUpdate.current)
            fetchData();
        else
            firstUpdate.current = false;
    }, [...fieldsArray]);


    /** Export */
    return {
        transactions, fields, loading,
        handleChange
    };
}