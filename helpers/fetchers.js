import { createTransactions } from './functions';
import { connect, getUser } from './functions';

/**
 * Get the wanted income from the database
 * 
 * @param {Object} ctx - The next js context object
 * @param {Object} session - Current session object
 */
export async function incomeFetcher(session, _id) {
    const connection = await connect();

    return new Promise((resolve, reject) => {
        const userId = getUser(session);
        const cols = 'description, price_per_unit, quantity, sum'
        let sql = `
            SELECT * FROM incomes WHERE user='${userId}' AND _id='${_id}';
            SELECT ${cols} FROM invoices WHERE user='${userId}' AND _id='${_id}';`;

        connection.query(sql, async (err, results) => {
        if (err) {
            console.error(err)
            reject(null);
        }
        
        connection.release();
        if (!results[0][0]) resolve(null);
        else {
            resolve({
                    ...results[0][0],
                    items: results[1]
                });
            }
        });
    })
}

/**
 * Get the wanted income from the database
 * 
 * @param {Object} ctx - The next js context object
 * @param {Object} session - Current session object
 */
export async function expenseFetcher(ctx, session) {
    const connection = await connect();

    return new Promise((resolve, reject) => {  
        const userId = getUser(session);  
        const { _id } = ctx.query;
        let sql = `SELECT * FROM expenses WHERE user='${userId}' AND _id='${_id}'`;

        connection.query(sql, async (err, expenses) => {
        if (err) {
            console.error(err)
            reject({ });;
        }
        
        connection.release();
        resolve(expenses[0] || null);
        });
    })
}

/**
 * Get the user's transactions from the database
 * 
 * @param {Object} session - Current session object
 */
export async function transactionsFetcher(session) {
    const connection = await connect();

    return new Promise((resolve, reject) => {
        const userId = getUser(session);
        const sql = `SELECT * FROM expenses WHERE user='${userId}'`;
        connection.query(sql, (err, expenses) => {
            if (err) {
                console.error(err);
                reject({ });
            }
            let sql = `SELECT * FROM incomes WHERE user='${userId}'`;
            connection.query(sql, (err, incomes) => {
                if (err) {
                    console.error(err);
                    reject({ });
                }
                
                const data = {
                    expenses: expenses,
                    incomes: incomes
                }

                connection.release();
                resolve(createTransactions(data));
            });
        });
    });
}

/**
 * Get the user's suppliers from the database
 * 
 * @param {Object} session - Current session object
 */
export async function suppliersFetcher(session, columns) {
    const connection = await connect();

    return new Promise((resolve, reject) => {
        const userId = getUser(session);
        const sql = `SELECT ${columns ? columns : "*"} FROM suppliers WHERE user='${userId}'`;

        connection.query(sql, (err, suppliers) => {
            if (err) reject(null);

            connection.release();
            resolve(suppliers.sort((a, b) => a.name.localeCompare(b.name)));
        });
    });
}

/**
 * Get the user's customers from the database
 * 
 * @param {Object} session - Current session object
 */
export async function customersFetcher(session, columns, customerName) {
    const connection = await connect();

    return new Promise((resolve, reject) => {
        const userId = getUser(session);
        const sql = `SELECT ${columns ? columns : "*"} FROM customers WHERE user='${userId}' ${customerName ? `AND name='${customerName}'` : ""};`;

        connection.query(sql, (err, customers) => {
            if (err) reject(null);

            connection.release();

            if (customerName)
                resolve(customers[0]);
            else 
                resolve(customers.sort((a, b) => a.name.localeCompare(b.name)));
        });
    });
}

/**
 * Get the user's customers from the database
 * 
 * @param {Object} session - Current session object
 */
export async function categoriesFetcher(session) {
    const connection = await connect();

    return new Promise((resolve, reject) => {
        const userId = getUser(session);
        const sql = `SELECT * FROM categories WHERE user='${userId}'`;

        connection.query(sql, (err, categoriesQuery) => {
            if (err) reject(null);

            connection.release();
            const categories = {
                income: categoriesQuery.filter(category => category.type == "income")
                    .sort((a, b) => a.name.localeCompare(b.name)),
                expense: categoriesQuery.filter(category => category.type == "expense")
                    .sort((a, b) => a.name.localeCompare(b.name))
            }
            resolve(categories);
        });
    });
}

/**
 * Get the user's customers from the database
 * 
 * @param {Object} session - Current session object
 */
export async function paymentMethodFetcher(session) {
    const connection = await connect();

    return new Promise((resolve, reject) => {
        const userId = getUser(session);
        const sql = `SELECT * FROM payment_methods WHERE user='${userId}'`;

        connection.query(sql, (err, methods) => {
            if (err) reject(null);

            connection.release();
            resolve(methods.sort((a, b) => a.name.localeCompare(b.name)));
        });
    });
}

/**
 * Get the user's new income data from the database
 * 
 * @param {Object} session - Current session object
 */
export async function newIncomeFetcher(session) {
    const connection = await connect();

    return new Promise((resolve, reject) => {
        const userId = getUser(session);
        let sql = `
            SELECT _id FROM incomes WHERE user='${userId}';
            SELECT name FROM customers WHERE user='${userId}';
            SELECT name FROM payment_methods WHERE user='${userId}';
            SELECT name FROM categories WHERE user='${userId}' AND type='income';`;
        connection.query(sql, (err, results) => {
            if (err) reject({ });
            
            const lastIndex = results[0].length;
            const customerList = results[1].map(item => item.name).sort((a, b) => a.localeCompare(b));
            const methodList = results[2].map(item => item.name).sort((a, b) => a.localeCompare(b));
            const categoryList = results[3].map(item => item.name).sort((a, b) => a.localeCompare(b));

            connection.release();
            resolve({
                lastIndex,
                customerList,
                methodList,
                categoryList
            });
        });
    });
}

/**
 * Get the user's new expense data from the database
 * 
 * @param {Object} session - Current session object
 */
export async function newExpenseFetcher(session) {
    const connection = await connect();

    return new Promise((resolve, reject) => {
        const userId = getUser(session);
        const sql = `
        SELECT name FROM suppliers WHERE user='${userId}';
        SELECT name FROM categories WHERE user='${userId}' AND type='expense';`;
        connection.query(sql, (err, results) => {
            if (err) reject({ });
            
            const suppliersList = results[0].map(item => item.name).sort((a, b) => a.localeCompare(b));
            const categoryList = results[1].map(item => item.name).sort((a, b) => a.localeCompare(b));

            connection.release();
            resolve({
                suppliersList,
                categoryList
            });
        });
    });
}

/**
 * Get the user's business information from the database
 * 
 * @param {Object} session - Current session object
 */
export async function businessFetcher(session, user) {
    const connection = await connect();

    return new Promise((resolve, reject) => {
        const userId = getUser(session);
        const sql = `
        SELECT * FROM business WHERE user='${userId}';`
        connection.query(sql, (err, business) => {
            if (err) reject(null);
            
            connection.release();
            resolve(business[0] || null);
        });
    });
}

/**
 * Get the user's relevant information for pdf generation
 * 
 * @param {Object} session - Current session object
 */
export async function pdfInvoiceFetcher(session) {
    const connection = await connect();

    return new Promise((resolve, reject) => {
        const userId = getUser(session);
        let sql = `
            SELECT * FROM business WHERE user='${userId}';
            SELECT * FROM incomes JOIN invoices USING _id='${_id} WHERE user='${userId}';`;
        connection.query(sql, (err, results) => {
            if (err) reject(null);
            
            console.log(results)

            connection.release();
            resolve(results);
        });
    });
}