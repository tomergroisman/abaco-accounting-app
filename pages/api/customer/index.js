import { pool } from '../../../helpers/constants';
import auth0 from '../../../lib/auth0';
import { v4 as uuid} from 'uuid';

export default (req, res) => {
  pool.getConnection(async (err, connection) => {
    if (err) {
      console.error("Connection error: " + err);
      res.status(500).send(err);
    }
    const session = await auth0.getSession(req);

    switch (req.method) {
      case "GET": {
        let { cols, lowerCase } = req.query;
        if (!cols) cols = '*';
        const sql = `SELECT ${cols} FROM customers WHERE user='${session ? session.user.name : "guest"}'`;
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
        const { name, address, phone, email, comments } = req.body.data;
        const sql = 
          `INSERT INTO customers (_id, name, address, phone, email, comments, user)
          VALUES ('${uuid()}', '${name}', '${address}', '${phone}', '${email}', '${comments}', '${session ? session.user.name : "guest"}')`;

        connection.query(sql, err => {
            if (err) {
              console.error("Insert to db error: " + err);
              res.status(500).send(err);
            }
        });

        res.status(200).send("Success");
        return
      }
      case "PUT": {
        const { _id } = req.query;
        const { name, address, phone, email, comments } = req.body.data;

        let sql = `SELECT user FROM customers WHERE _id='${_id}'`;
        connection.query(sql, (err, rows) => {
          if (err) {
            console.error("db error: " + err);
            res.status(500).send(err);
          }
          if (rows[0].user == (session ? session.user.name : "guest")) {
            sql = 
              `UPDATE customers
              SET name='${name}', address='${address}', phone='${phone}', email='${email}', comments='${comments}'
              WHERE _id='${_id}'`;
    
            connection.query(sql, err => {
                if (err) {
                  console.error("Insert to db error: " + err);
                  res.status(500).send(err);
                }
            });
            res.status(200).send('Success');

          } else res.status(401).send("Unauthorized");
        });

        return
      }
      case "DELETE": {
        const { _id } = req.query;
        let sql = `SELECT user FROM customers WHERE _id='${_id}'`;

        connection.query(sql, (err, rows) => {
          if (err) {
            console.error("Insert to db error: " + err);
            res.status(500).send(err);
          }
          if (rows[0].user == (session ? session.user.name : "guest")) {
            sql = 
              `DELETE FROM customers
              WHERE _id='${_id}'`;

            connection.query(sql, err => {
              if (err) {
                console.error("Delete from db error: " + err);
                res.status(500).send(err);
              }
            });
            res.status(200).send('Success');

          } else res.status(401).send("Unauthorized");
        });
        
        return;
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