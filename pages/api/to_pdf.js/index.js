import { ftpConfig } from '../../../helpers/constants';
import auth0 from '../../../lib/auth0';
const ejs = require('ejs');
const puppeteer = require('puppeteer');
const Client = require('ftp');

export default async function toPdf(req, res) {
    if (req.method == "GET") {
        const session = await auth0.getSession(req);
        const user = session ? session.user.nickname : "guest";

        const data = {
            user: "guest",
            business: {
                name: "Squid Productions",
                address: "הצנחנים 2, גבעתיים, ישראל",
                phone: "054-4276323",
                mail: "office@squid-productions.com",
                logo: "https://squid-productions.com/public/logo/squid-200x200.png",
            },
            customer: {
                name: "איה אראל",
                address: "האחות חיה 15, רמת גן, ישראל",
                phone: "054-6230302"
            },
            date: "09/11/2020",
            vat: 0,
            total: 650,
            category: "הוצאות בארץ",
            paymentMethod: "מזומן",
            reference: "1050",
            comments: "לקוח נדיר",
            items: [{
                desc: "ממתקים",
                price: 100,
                qty: 5,
                sum: 500,
            },
            {
                desc: "כובע",
                price: 75,
                qty: 2,
                sum: 150,
            }],
            invoiceNum: 403
        }
        const newData = { ...data, sumBeforeVat: data.total / (data.vat / 100 + 1)}
        const publicDir = `${process.cwd()}/public`;
        const html = await ejs.renderFile(`${publicDir}/html_to_pdf/index.ejs`, { data: newData });

        (async () => {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.setContent(html);
            const buffer = await page.pdf({ format: 'A4' });      
            await browser.close();

            const c = new Client();
            c.on('ready', () => {
                c.mkdir(`${ftpConfig.rootDir}/${user}/invoices`, true, (err) => {
                    if (err) {
                        console.error(err)
                        console.error("Directory already exists");
                    }
                });
                c.put(buffer, `${ftpConfig.rootDir}/${user}/invoices/invoice-${data.invoiceNum}.pdf`, (err) => {
                    if (err) throw err;
                    c.end();
                });
            });

            c.connect(ftpConfig);
          })();

        res.status(200).send(html)
    }
}