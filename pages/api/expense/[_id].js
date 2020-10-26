import { pool } from '../../../helpers/constants';

export default (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Connection error: " + err);
      res.status(500).send(err);
    }

    switch (req.method) {
      case "GET": {
        const { user, _id } = req.query;
        const sql = `SELECT * FROM expenses WHERE user='${user}' AND _id='${_id}'`;

        connection.query(sql, async (err, rows) => {
          if (err) {
            console.error("Get results error: " + err);
            res.status(500).send(err);
            return;
          }
          
          if (!rows[0]) res.status(200).json({expense: null});
          else res.status(200).json({expense: rows[0]});
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