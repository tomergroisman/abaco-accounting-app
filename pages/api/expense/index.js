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
        const sql = `SELECT * FROM expenses WHERE user=${session ? session.user.name : "guest"}`;

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
        const { category, supplier, reference, date, price, vat, total, comments } = req.body.data;
        const sql = `
          INSERT INTO expenses (_id, category, supplier, reference, date, price, vat, total, comments, user)
          VALUES ('${uuid()}', '${category}', '${supplier}', '${reference}', '${date}', '${price}',
            '${vat}', '${total}', '${comments}', '${session ? session.user.name : "guest"}')`;

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