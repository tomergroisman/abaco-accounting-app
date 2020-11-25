import { ftpConfig } from '../../../helpers/constants';
import auth0 from '../../../lib/auth0';
import { dateToString, getUser } from '../../../helpers/functions'
import { businessFetcher, customersFetcher, incomeFetcher } from '../../../helpers/fetchers';
const download = require('download');
const ejs = require('ejs');
const puppeteer = require('puppeteer');
const Client = require('ftp');

export default async function toPdf(req, res) {
    const session = await auth0.getSession(req);
    const userId = getUser(session);

    if (req.method == "GET") {
        const { invoice_number } = req.query;
        (async () => {
            download(`https://${process.env.FTP_HOST}/uploads/accounting_app/${userId}/invoices/invoice-${invoice_number}.pdf`)
            .pipe(res);
            res.setHeader('Content-disposition', `attachment; filename=invoice-${invoice_number}.pdf`);
        })();
    }
    if (req.method == "POST") {
        const { _id } = req.query;

        const businessInfo = await businessFetcher(session);
        const invoiceInfo = await incomeFetcher(session, _id);
        const customerInfo = await customersFetcher(session, invoiceInfo.customer);
        
        const data = {
            business: businessInfo,
            ...invoiceInfo,
            customer: customerInfo,
            date: dateToString(invoiceInfo.date),
        }

        const publicDir = `${process.cwd()}/public`;
        const html = await ejs.renderFile(`${publicDir}/html_to_pdf/index.ejs`, { data });

        (async () => {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.setContent(html);
            const buffer = await page.pdf({ format: 'A4' });      
            await browser.close();

            const c = new Client();
            c.on('ready', () => {
                c.put(buffer, `${ftpConfig.rootDir}/${userId}/invoices/invoice-${data.invoice_number}.pdf`, (err) => {
                    if (err) throw err;
                    c.end();
                });
            });

            c.connect(ftpConfig);
          })();

        res.status(200).send("Success")
    }
}