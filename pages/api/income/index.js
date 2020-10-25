import axios from 'axios';
import { pool } from '../../../helpers/constants';
import { v4 as uuid} from 'uuid';

export default (req, res) => {
  pool.getConnection(async (err, connection) => {
    if (err) {
      console.error("Connection error: " + err);
      res.status(500).send(err);
    }

    switch (req.method) {
      case "GET": {
        const { user, n } = req.query;
        const sql = `SELECT * FROM incomes WHERE user='${user}'`;

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
        const { user } = req.query;
        const { customer, date, vat, total, category, paymentMethod, reference, comments, items } = req.body.data;
        const _id = uuid();
        const sql = 
          `INSERT INTO incomes (_id, customer, date, vat, total, category, payment_method, reference, comments, user)
          VALUES ('${_id}', '${customer}', '${date}', '${vat}', '${total}', '${category}',
            '${paymentMethod}', '${reference}', '${comments}', '${user}')`;

        connection.query(sql, err => {
            if (err) {
              console.error("Insert to db error: " + err);
              res.status(500).send(err);
            }
        });
        await axios.post(`/api/invoice?user=${user}`, {_id: _id, items: items});
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