import { pool } from '../../../helpers/constants';
import auth0 from '../../../lib/auth0';
import { getUser } from '../../../helpers/functions';
import { v4 as uuid} from 'uuid';

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
        const { n } = req.query;
        const sql = `SELECT * FROM incomes WHERE user='${userId}'`;

        connection.query(sql, (err, rows) => {
          if (err) {
            console.error("Get results error: " + err);
            res.status(500).send(err);
            return;
          }

          if (n) res.status(200).json(rows.length);   // Send lase income index
          else res.status(200).json(rows);            // Send all incomes
          
        });

        return
      }

      case "POST": {
        const { customer, date, vat, total, category, paymentMethod, reference, comments, items } = req.body.data;
        const _id = uuid();
        let sql = 
          `INSERT INTO incomes (_id, customer, date, vat, total, category, payment_method, reference, comments, user)
          VALUES ('${_id}', '${customer}', '${date}', '${vat}', '${total}', '${category}',
            '${paymentMethod}', '${reference}', '${comments}', '${userId}')`;

        connection.query(sql, err => {
            if (err) {
              console.error("Insert to db error: " + err);
              res.status(500).send(err);
              return;
            }
        });
        items.forEach(item => {
          const { desc, price, qty, sum } = item;
          sql = 
          `INSERT INTO invoices (_id, description, price_per_unit, quantity, sum, user)
          VALUES ('${_id}', '${desc}', '${price}', '${qty}', '${sum}', '${userId}')`;

          connection.query(sql, err => {
              if (err) {
                  console.error("Insert to db error: " + err);
                  res.status(500).send(err);
                  return;
              }
          });
        });

        res.status(200).send("Success");
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