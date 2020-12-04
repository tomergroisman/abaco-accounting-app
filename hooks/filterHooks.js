import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { fixApostrophes, formaDateToSubmit } from '../helpers/functions';

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

    // Fields object
    const fields = { 
        type,
        customers,
        suppliers,
        dates,
    }

    async function fetchData() {
        const submitionFormatDates = {
            start: dates.start ? formaDateToSubmit(dates.start) : null,
            end: dates.end ? formaDateToSubmit(dates.end) : null
        }
        setLoading(true);
        const fixedFields = {
            type: type,
            customers: fixApostrophes(customers),
            suppliers: fixApostrophes(suppliers),
            dates: submitionFormatDates
        }
        const res = await axios.get('/api/transactions', { params: fixedFields });
        setLoading(false);
        setTransactions(res.data.transactions)
    }

    useEffect(() => {
        let newType;   
        if (customers[0] && suppliers[0])   // Both customer and supplier filter
            newType = "all";
        else if (customers[0])              // Only customer filter
            newType = "income";
        else if (suppliers[0])              // Only supplier
            newType = "expense";
        else                                // No filter
            newType = "all";
        
        if (newType === type) {
            fetchData();
            return
        }
        setType(newType)
    }, [customers, suppliers]);

    useEffect(() => {       
        if (!firstUpdate.current)
            fetchData();
        else
            firstUpdate.current = false;
    }, [type, dates]);


    /** Export */
    return {
        transactions, fields, loading,
        handleChange
    };
}