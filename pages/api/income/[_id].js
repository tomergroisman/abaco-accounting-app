import axios from 'axios';
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
        const sql = `SELECT * FROM incomes WHERE user='${user}' AND _id='${_id}'`;

        connection.query(sql, async (err, rows) => {
          if (err) {
            console.error("Get results error: " + err);
            res.status(500).send(err);
            return;
          }
          
          const { data } = await axios.get(`/api/invoice/${_id}?user=${user}`);
          res.status(200).json({income: { ...rows[0], items: data.items }});
          
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