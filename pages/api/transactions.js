import { pool } from '../../helpers/constants';

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
    pool.getConnection((err, connection) => {
        if (err) {
        console.error("Connection error: " + err);
        res.status(500).send(err);
        }

        switch (req.method) {
            case "GET": {
                const { user } = req.query;

                let sql = `SELECT * FROM expenses WHERE user='${user}'`;
                connection.query(sql, (err, expenses) => {
                    if (err) {
                        console.error("Get results error: " + err);
                        res.status(500).send(err);
                    }
                    let sql = `SELECT * FROM incomes WHERE user='${user}'`;
                    connection.query(sql, (err, incomes) => {
                        if (err) {
                            console.error("Get results error: " + err);
                            res.status(500).send(err);
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