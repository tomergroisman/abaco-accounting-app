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
        let { user, lowerCase } = req.query;
        const sql = `SELECT * FROM payment_methods WHERE user='${user}'`;
        connection.query(sql, (err, rows) => {
          if (err) {
            console.error("Get results error: " + err);
            res.status(500).send(err);
            return;
          }
          const methods = rows.map(method => 
            lowerCase ?
              { ...method, name: method.name.toLowerCase() }:
              method)
          res.status(200).send({methods: methods.sort((a, b) => a.name.localeCompare(b.name))});
        });
        return
      }

      case "POST": {
        const { user } = req.query;
        const { name } = req.body.data;
        const sql = 
          `INSERT INTO payment_methods (_id, name, user)
          VALUES ('${uuid()}', '${name}', '${user}')`;

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