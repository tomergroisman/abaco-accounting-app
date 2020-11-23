import { pool } from '../../../helpers/constants';
import auth0 from '../../../lib/auth0';
import { getUser } from '../../../helpers/functions'
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
        let { type, lowerCase } = req.query;
        const sql = `SELECT * FROM categories WHERE user='${userId}' AND type='${type}'`;
        connection.query(sql, (err, rows) => {
          if (err) {
            console.error("Get results error: " + err);
            res.status(500).send(err);
            return;
          }

          const categories = rows.map(category => 
            lowerCase ?
              { ...category, name: category.name.toLowerCase() }:
              category)
          res.status(200).send({categories: categories.sort((a, b) => a.name.localeCompare(b.name))});
        });
        return;
      }

      case "POST": {
        const { type, name } = req.body.data;
        const sql = `
          INSERT INTO categories (_id, type, name, user)
          VALUES ('${uuid()}', '${type}', '${name}', '${userId}')`;

        connection.query(sql, err => {
            if (err) {
              console.error("Insert to db error: " + err);
              res.status(500).send(err);
              return;
            }
        });

        res.status(200).send("Success");
        return
      }
      case "PUT": {
        const { _id } = req.query;
        const { type, name } = req.body.data;

        let sql = `SELECT user FROM categories WHERE _id='${_id}'`;
        connection.query(sql, (err, rows) => {
          if (err) {
            console.error("db error: " + err);
            res.status(500).send(err);
          }
          if (rows[0].user == (userId)) {
            sql = `
              UPDATE categories
              SET type='${type}', name='${name}'
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
        let sql = `SELECT user FROM categories WHERE _id='${_id}'`;

        connection.query(sql, (err, rows) => {
          if (err) {
            console.error("Insert to db error: " + err);
            res.status(500).send(err);
          }
          if (rows[0].user == (userId)) {
            sql = `
              DELETE FROM categories
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