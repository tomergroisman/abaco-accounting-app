import { pool } from '../../../helpers/constants';

export default (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Connection error: " + err);
      res.status(500).send(err);
    }

    switch (req.method) {
      case "POST": {
        const { user } = req.query;
        const { _id, items } = req.body;
        items.forEach(item => {
            const { desc, price, qty, sum } = item;
            const sql = 
            `INSERT INTO invoices (_id, description, price_per_unit, quantity, sum, user)
            VALUES ('${_id}', '${desc}', '${price}', '${qty}', '${sum}', '${user}')`;
  
            connection.query(sql, err => {
                if (err) {
                    console.error("Insert to db error: " + err);
                    res.status(500).send(err);
                }
            });
        })

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