import { pool } from '../../../helpers/constants';
import { getUser } from '../../../helpers/functions';
import auth0 from '../../../lib/auth0';

/**
 * Create a transactions array
 * @param {Object} data - Fetched expenses and incomes data object
 */
function createTransactions(data) {
    let transactions = [];
    for (const type in data) {
        data[type].forEach(t => t.type = type.slice(0, -1));
        transactions.push(...data[type]);
    }
    transactions.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
    return transactions;
}

/**
 * Disassemble an array to an IN state for mySQL
 * [1, 2, 3] => '1', '2', '3'
 * 
 * @param {Array} array - The array to disassemble
 */
function disassembleArray(array) {
    if (Array.isArray(array))
        return array.map(item => `'${item}'`).join(", ");
    return `'${array}'`;
}

/**
 * Return a dates adder to the sql query
 * 
 * @param {Object} dates - Dates object, composed on a start date and an end date (strings, mm/dd/yyy) 
 */
function setDatedQuery(dates) {
    let adder = '';
    if (dates.start)
        adder += `AND date >= '${dates.start}' `;
    if (dates.end)
        adder += `AND date <= '${dates.end}' `;
    
    return adder
}

export default (req, res) => {
    pool.getConnection(async (err, connection) => {
        if (err) {
            console.error("Connection error: " + err);
            res.status(500).send(err);
            return;
        }
        const session = await auth0.getSession(req);
        const userId = getUser(session);

        switch (req.method) {
            case "GET": {
                let sql;
                if (!req.query) {
                    sql =
                        `SELECT * FROM expenses WHERE user='${userId}';
                        SELECT * FROM incomes WHERE user='${userId}';`;
                } else {
                    const { type } = req.query;
                    const suppliers = req.query['suppliers[]'];
                    const customers = req.query['customers[]'];
                    const dates = JSON.parse(req.query.dates);
                    const adders = {
                        suppliers: suppliers ? `AND supplier IN (${disassembleArray(suppliers)})` : "",
                        customers: customers ? `AND customer IN (${disassembleArray(customers)})` : "",
                        dates: setDatedQuery(dates),
                    }
                    sql =
                        `SELECT * FROM expenses WHERE ${type === "income" ? "0" : `user='${userId}' ${adders.suppliers}`} ${adders.dates};
                        SELECT * FROM incomes WHERE ${type === "expense" ? "0" : `user='${userId}' ${adders.customers}`} ${adders.dates};`;
                }
                connection.query(sql, (err, results) => {
                    if (err) {
                        console.error("Get results error: " + err);
                        res.status(500).send(err);
                        return;
                    }
                    const data = {
                        expenses: results[0],
                        incomes: results[1]
                    }
                    res.status(200).json({ transactions: createTransactions(data) });
                });
                return
            }
            default: {
                res.status(500).send('Error');
            }
        }

        connection.release();
    });
}

export const config = {
  api: {
    externalResolver: true,
  },
}