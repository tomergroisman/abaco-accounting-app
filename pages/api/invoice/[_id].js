import { pool } from '../../../helpers/constants';

export default (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Connection error: " + err);
      res.status(500).send(err);
    }

    switch (req.method) {
      case "GET": {
        const { user, _id } = req.query;
        const cols = 'description, price_per_unit, quantity, sum'
        const sql = `SELECT ${cols} FROM invoices WHERE user='${user}' AND _id='${_id}'`;

        connection.query(sql, (err, rows) => {
          if (err) {
            console.error("Get results error: " + err);
            res.status(500).send(err);
            return;
          }

          else res.status(200).json({items: rows});            // Send all incomes
          
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