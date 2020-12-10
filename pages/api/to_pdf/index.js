import auth0 from '../../../lib/auth0';
import { dateToString, getUser, uploadInvoice, fixApostrophes } from '../../../helpers/functions'
import { businessFetcher, customersFetcher, incomeFetcher } from '../../../helpers/fetchers';
import { ftpConfig } from '../../../helpers/constants';
const download = require('download');
const puppeteer = require('puppeteer');

export default async function to_pdf(req, res) {
    const session = await auth0.getSession(req);
    const userId = getUser(session);

    if (req.method == "GET") {
        const { invoice_number } = req.query;
        (async () => {
            download(`https://${process.env.FTP_HOST}/${ftpConfig.rootDirRel}/${userId}/invoices/invoice-${invoice_number}.pdf`)
            .pipe(res);
            res.setHeader('Content-disposition', `attachment; filename=invoice-${invoice_number}.pdf`);
        })();
    }
    if (req.method == "POST") {
        const { _id } = req.query;

        const businessInfo = await businessFetcher(session);
        const invoiceInfo = await incomeFetcher(session, _id);
        const customerInfo = await customersFetcher(session, null, fixApostrophes(invoiceInfo.customer));
        
        const data = {
            business: businessInfo,
            ...invoiceInfo,
            customer: customerInfo,
            date: dateToString(invoiceInfo.date),
        }

        uploadInvoice(puppeteer, data, userId);

        res.status(200).send("Success");
    }
}

export const config = {
    api: {
      externalResolver: true,
    },
  }