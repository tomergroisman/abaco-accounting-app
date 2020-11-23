import { pool } from '../../../helpers/constants';
import { getUser, uploadLogo } from '../../../helpers/functions';
import auth0 from '../../../lib/auth0';
import middleware from '../../../helpers/middleware/middleware';
import nextConnect from 'next-connect';
import { businessFetcher } from '../../../helpers/fetchers';

const handler = nextConnect();
handler.use(middleware);

handler.post(async (req, res) => {
    const session = await auth0.getSession(req);
    const userId = getUser(session);
    
    const { name, address, phone, email } = req.body;
    const { logo } = req.files;
    let dest = null;

    if (logo) {
      dest = uploadLogo(logo, userId);
    }

    const sql =       
      `INSERT INTO business (name, address, phone, email, logo, user)
      VALUES ('${name}', '${address}', '${phone}', '${email}', '${dest}', '${userId}')`;

    console.log(sql)


    pool.getConnection(async (err, connection) => {
      connection.query(sql, err => {
        if (err) {
            console.error(err);
            res.status(500).send(err);
            return;
        }
      });
    });

    res.status(200).send("Success");
});

handler.put(async (req, res) => {
    const session = await auth0.getSession(req);
    const userId = getUser(session);
    
    const { name, address, phone, email } = req.body;
    const { logo } = req.files;
    let dest = null;


    if (logo) {
      dest = uploadLogo(logo, userId);
    }

    const sql =       
          `UPDATE business
          SET name='${name}', address='${address}', phone='${phone}',
            email='${email}'${dest ? `, logo='${dest}'` : req.body.logo ? "" : ', logo=null'}
          WHERE user='${userId}'`;


    pool.getConnection(async (err, connection) => {
      connection.query(sql, err => {
        if (err) {
            console.error(err);
            res.status(500).send(err);
            return;
        }
      });
    });

    res.status(200).send("success");
});

handler.get(async(req, res) => {
  const session = await auth0.getSession(req);

  res.status(200).send({ businessInfo: await businessFetcher(session) || null });

});

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
}

export default handler;