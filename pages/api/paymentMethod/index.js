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
        let { lowerCase } = req.query;
        const sql = `SELECT * FROM payment_methods WHERE user='${session ? session.user.name : "guest"}'`;
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
        const { name } = req.body.data;
        const sql = 
          `INSERT INTO payment_methods (_id, name, user)
          VALUES ('${uuid()}', '${name}', '${session ? session.user.name : "guest"}')`;

        connection.query(sql, err => {
            if (err) {
              console.error("Insert to db error: " + err);
              res.status(500).send(err);
              return
            }
            res.status(200).send("Success");
        });

        return
      }
      case "PUT": {
        const { _id } = req.query;
        const { name } = req.body.data;

        let sql = `SELECT user FROM payment_methods WHERE _id='${_id}'`;
        connection.query(sql, (err, rows) => {
          if (err) {
            console.error("db error: " + err);
            res.status(500).send(err);
          }
          if (rows[0].user == (session ? session.user.name : "guest")) {
            sql = `
              UPDATE payment_methods
              SET name='${name}'
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
        let sql = `SELECT user FROM payment_methods WHERE _id='${_id}'`;

        connection.query(sql, (err, rows) => {
          if (err) {
            console.error("Insert to db error: " + err);
            res.status(500).send(err);
          }
          if (rows[0].user == (session ? session.user.name : "guest")) {
            sql = `
              DELETE FROM payment_methods
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