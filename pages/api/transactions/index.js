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
                let sql = `SELECT * FROM expenses WHERE user='${userId}'`;
                connection.query(sql, (err, expenses) => {
                    if (err) {
                        console.error("Get results error: " + err);
                        res.status(500).send(err);
                        return;
                    }
                    let sql = `SELECT * FROM incomes WHERE user='${userId}'`;
                    connection.query(sql, (err, incomes) => {
                        if (err) {
                            console.error("Get results error: " + err);
                            res.status(500).send(err);
                            return;
                        }
                        
                        const data = {
                            expenses: expenses,
                            incomes: incomes
                        }
                        res.status(200).json({transactions: createTransactions(data)});
                    });
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