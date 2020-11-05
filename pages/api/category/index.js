import { pool } from '../../../helpers/constants';
import auth0 from '../../../lib/auth0';
import { v4 as uuid} from 'uuid';

export default (req, res) => {
  pool.getConnection(async (err, connection) => {
    if (err) {
      console.error("Connection error: " + err);
      res.status(500).send(err);
      return;
    }
    const session = await auth0.getSession(req);

    switch (req.method) {
      case "GET": {
        let { type, lowerCase } = req.query;
        const sql = `SELECT * FROM categories WHERE user='${session ? session.user.name : "guest"}' AND type='${type}'`;
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
          VALUES ('${uuid()}', '${type}', '${name}', '${session ? session.user.name : "guest"}')`;

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