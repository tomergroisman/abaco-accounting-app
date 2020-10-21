import { pool } from '../../../helpers/constants';

export default (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Connection error: " + err);
      res.status(500).send(err);
    }

    switch (req.method) {
      case "GET": {
        const sql = `SELECT * FROM expenses`;

        connection.query(sql, (err, rows) => {
          if (err) {
            console.error("Get results error: " + err);
            res.status(500).send(err);
            return;
          }

          res.status(200).json(rows);
        });

        return
      }

      case "POST": {
        const { user } = req.query;
        const { _id, category, supplier, reference, date, price, vat, total, comments } = req.body.data;
        const sql = 
          `INSERT INTO expenses (_id, category, supplier, reference, date, price, vat, total, comments, user)
          VALUES ('${_id}', '${category}', '${supplier}', '${reference}', '${date}', '${price}', '${vat}', '${total}', '${comments}', '${user}')`;

        connection.query(sql, err => {
            if (err) {
              console.error("Insert to db error: " + err);
              res.status(500).send(err);
              return
            }
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