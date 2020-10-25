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
        let { user, type } = req.query;
        let sql = `SELECT * FROM categories WHERE user='${user}'`;
        if (type) sql += ` AND type=${type}`;
        connection.query(sql, (err, rows) => {
          if (err) {
            console.error("Get results error: " + err);
            res.status(500).send(err);
            return;
          }

          res.status(200).send({categories: rows.sort((a, b) => a.name.localeCompare(b.name))});
          
        });

        return
      }

      case "POST": {
        const { user } = req.query;
        const { type, name } = req.body.data;
        const sql = 
          `INSERT INTO categories (_id, type, name, user)
          VALUES ('${uuid()}', '${type}', '${name}', '${user}')`;

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