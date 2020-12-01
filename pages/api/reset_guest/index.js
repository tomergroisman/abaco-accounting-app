import { pool } from '../../../helpers/constants';
import { deleteGuestFiles } from '../../../helpers/functions';
import { erase, seed, upload } from '../../../helpers/seed';
const puppeteer = require('puppeteer');

export default async function reset_guest(req, res) {
    if (req.method == "POST") {
        if (req.query?.keyword == process.env.RESET_KEYWORD) {
            deleteGuestFiles();

            pool.getConnection(async (err, connection) => {
                connection.query(erase, (err) => {
                    if (err) {
                        console.log(err)
                        res.status(500).send("Falied");
                        return
                    }

                    connection.query(seed, (err) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send("Falied");
                            return
                        }
                        upload(puppeteer);

                        res.status(200).send("Success");
                        connection.release();
                    });
                });
            });
        }
    }
}

export const config = {
    api: {
      externalResolver: true,
    },
  }