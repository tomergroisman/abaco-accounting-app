import auth0 from '../../../lib/auth0';
import { pool } from '../../../helpers/constants';
import { getUser } from '../../../helpers/functions';

export default (req, res) => {
  pool.getConnection(async (err, connection) => {
    if (err) {
      console.error("Connection error: " + err);
      res.status(500).send(err);
    }
    const session = await auth0.getSession(req);
    const userId = getUser(session);

    switch (req.method) {
      case "GET": {
        const { _id } = req.query;
        let sql = `SELECT * FROM incomes WHERE user='${userId}' AND _id='${_id}'`;

        connection.query(sql, async (err, rows) => {
          if (err) {
            console.error("Get results error: " + err);
            res.status(500).send(err);
            return;
          }
          
          if (!rows[0]) res.status(200).json({ income: null });
          else {
            const cols = 'description, price_per_unit, quantity, sum'
            sql = `SELECT ${cols} FROM invoices WHERE user='${userId}' AND _id='${_id}'`;

            connection.query(sql, (err, items) => {
              if (err) {
                console.error("Get results error: " + err);
                res.status(500).send(err);
                return;
              }
              res.status(200).json({ income: { ...rows[0], items: items } });

            });  
          }
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