import { pool } from '../../helpers/constants';
import { v4 as uuid} from 'uuid';

export default (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Connection error: " + err);
      res.status(500).send(err);
    }

    switch (req.method) {
      case "GET": {
        let { user, cols, lowerCase } = req.query;
        if (!cols) cols = '*';
        const sql = `SELECT ${cols} FROM customers WHERE user='${user}'`;
        connection.query(sql, (err, rows) => {
          if (err) {
            console.error("Get results error: " + err);
            res.status(500).send(err);
            return;
          }

          const customers = rows.map(customer => 
            lowerCase ?
              { ...customer, name: customer.name.toLowerCase() }:
              customer)
          res.status(200).send({customers: customers.sort((a, b) => a.name.localeCompare(b.name))});
          
        });

        return
      }

      case "POST": {
        const { user } = req.query;
        const { name, address, phone, email, comments } = req.body.data;
        const sql = 
          `INSERT INTO customers (_id, name, address, phone, email, comments, user)
          VALUES ('${uuid()}', '${name}', '${address}', '${phone}', '${email}', '${comments}', '${user}')`;

        connection.query(sql, err => {
            if (err) {
              console.error("Insert to db error: " + err);
              res.status(500).send(err);
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