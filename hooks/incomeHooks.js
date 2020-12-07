import { useState, useEffect } from 'react';

export const setIncome = (popup, fetched) => {
    const [customerList, setCustomerList] = useState(fetched.customerList),
          [methodList, setMethodList] = useState(fetched.methodList),
          [categoryList, setCategoryList] = useState(fetched.categoryList),
          [lastIndex, setLastIndex] = useState(fetched.lastIndex),
          [date, setDate] = useState(new Date().toLocaleDateString()),
          [customer, setCustomer] = useState(null),
          [items, setItems] = useState([]),
          [subtotal, setSubtotal] = useState(0),
          [vat, setVat] = useState(0),
          [total, setTotal] = useState(0),
          [category, setCategory] = useState(null),
          [paymentMethod, setPaymentMethod] = useState(null),
          [reference, setReference] = useState(""),
          [comments, setComments] = useState(""),
          [validator, setValidator] = useState({
            isValid: true,
            itemsError: false,
            inEditError: false,
            customer: {
                error: false,
                helperText: "לא נבחר לקוח"
            },
            category: {
                error: false,
                helperText: "לא נבחרה קטגוריה"
            },
            paymentMethod: {
                error: false,
                helperText: "לא נבחרה שיטת תשלום"
            },
        }),
        [entry, setEntry] = popup;

    const setters = {
        date: setDate,
        customer: setCustomer,
        items: setItems,
        vat: setVat,
        subtotal: setSubtotal,
        total: setTotal,
        category: setCategory,
        paymentMethod: setPaymentMethod,
        reference: setReference,
        comments: setComments
    }
    const autocomplete = {
        customer: customer,
        category: category,
        paymentMethod: paymentMethod,
    }
    

    /**
     * Set subtotal new value after items array changed
     * and check items validator
     */
    useEffect(() => {
        let newSubtotal = 0;
        items.forEach(item => newSubtotal += item.sum)
        setSubtotal(newSubtotal);
        if (items.length > 0) setValidator({...validator, isValid: true, itemsError: false, inEditError: false})
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
        if (value && value.adder) {
            setEntry(key);
            return
        }
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
     * Edits an item of the items array
     * 
     * @param {Number} index - The index of the item to edit
     */
    const editItem = (index, newItem) => {
        let newItems = [...items];
        if (newItem)
            newItems[index] = newItem;
        else
            newItems[index] = {...newItems[index], edit: true};
        setItems(newItems);

    }

    /**
     * Reorders the items array
     * Swapping sourceIdx with destIdx
     * @param {Number} sourceIdx - The item's index on current items array
     * @param {Number} destIdx  - Desired item's index on the new items array
     */
    const reorderItems = (sourceIdx, destIdx) => {
        let newItems = [...items];
        const [removed] = newItems.splice(sourceIdx, 1);
        newItems.splice(destIdx, 0, removed);
        setItems(newItems)
    }

    /**
     * Removes an item from the items array
     * 
     * @param {Number} index - The index of the item to remove
     */
    const removeItem = (index) => {
        let newItems = [...items];
        newItems.splice(index, 1)
        setItems(newItems);
    }

    // Receipt functions object for export
    const receipt = {
        add: addItem,
        edit: editItem,
        remove: removeItem,
        reorder: reorderItems,
    }

        /**
     * Validate the autocomplete fields of the form
     */
    const validateAutocomplete = () => {
        let newValidator = {...validator};
        if (items.length == 0) {
            newValidator.isValid = false;
            newValidator.itemsError = true;
        }
        if (items.find(item => item.edit)) {
            newValidator.isValid = false;
            newValidator.inEditError = true;
        }
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

    // Validator object for export
    const apis = {
        customerList: customerList,
        methodList: methodList,
        categoryList: categoryList,
        lastIndex: lastIndex,
        setters: {
            customerList: setCustomerList,
            methodList: setMethodList,
            categoryList: setCategoryList,
            lastIndex: setLastIndex,
        }
    }

    /** Export */
    return [
        apis, date, customer, items, subtotal, vat, total, category, paymentMethod, reference, comments,
        handleChange, receipt, valid
    ];
}