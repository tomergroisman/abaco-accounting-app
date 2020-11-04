import { pool } from './constants';

export async function incomeFetcher(ctx, session) {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            if (err) {
                console.error(err)
                reject({ props: { } });
            }
    
            const { _id } = ctx.query;
            let sql = `SELECT * FROM incomes WHERE user='${session ? session.user.name : "guest"}' AND _id='${_id}'`;
    
            connection.query(sql, async (err, incomes) => {
            if (err) {
                console.error(err)
                reject({ props: { } });
            }
            
            if (!incomes[0]) return { props: { } };
            else {
                const cols = 'description, price_per_unit, quantity, sum'
                sql = `SELECT ${cols} FROM invoices WHERE user='${session ? session.user.name : "guest"}' AND _id='${_id}'`;
    
                connection.query(sql, (err, items) => {
                if (err) {
                    console.error(err)
                    reject({ props: { } });
                }
                resolve(JSON.stringify({
                        ...incomes[0],
                        items: items
                    }));
                });
            }
            });
            connection.release();
        });
    })
}