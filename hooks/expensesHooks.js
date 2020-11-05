import { useState, useEffect } from 'react';

export const setExpenses = (popup, fetched) => {
    const [suppliersList, setSuppliersList] = useState(fetched.suppliersList),
          [categoryList, setCategoryList] = useState(fetched.categoryList),
          [category, setCategory] = useState(null),
          [supplier, setSupplier] = useState(null),
          [reference, setReference] = useState(""),
          [date, setDate] = useState(new Date().toLocaleDateString()),
          [price, setPrice] = useState(""),
          [vat, setVat] = useState(""),
          [total, setTotal] = useState(""),
          [comments, setComments] = useState(""),
          [validator, setValidator] = useState({
            isValid: true,
            category: {
                error: false,
                helperText: "לא נבחרה קטגוריה"
            },
            supplier: {
                error: false,
                helperText: "לא נבחר ספק"
            }
        }),
        [entry, setEntry] = popup;
        
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
    const autocomplete = {
        category: category,
        supplier: supplier
    }
    const apis = {
        suppliersList: suppliersList,
        categoryList: categoryList,
        setters: {
            suppliersList: setSuppliersList,
            categoryList: setCategoryList
        }
    }

    useEffect(() => {
        if (price)
            setTotal(Number(price) + Number(vat));
        else
            setTotal("");
    }, [price, vat])

    /**
     * Handle change function
     * 
     * @param {Object} value - value to update
     * @param {string} key - Key name
     */
    const handleChange = (value, key) => {
        // Open popup
        if (value && value.adder) {
            setEntry(key);
            return
        }

        setters[key](value);
    }

    /**
     * Validate the autocomplete fields of the form
     */
    const validateAutocomplete = () => {
        let newValidator = {...validator};
        for (const key in newValidator) {
            if (autocomplete[key] === null) newValidator.isValid = false;
            if (newValidator[key].error !== undefined)
                newValidator[key].error = autocomplete[key] == null;
        }
        setValidator(newValidator);
    }

    /**
     * Clear an error of specific autocomplete component
     * 
     * @param {String} key - The key to clear the error of
     */
    const clearValidator = (key) => {
        let newValidator = {...validator};
        newValidator.isValid = true;
        newValidator[key].error = false;
        setValidator(newValidator);
    }

    // Validator object for export
    const valid = {
        validator: validator,
        validate: validateAutocomplete,
        clear: clearValidator
    }

    /** Export */
    return [
        apis, category, supplier, reference, date, price, vat, total, comments,
        handleChange, valid
    ];
}