import { ftpConfig } from "../../../helpers/constants";
import { customersFetcher, businessFetcher, incomeFetcher } from "../../../helpers/fetchers";
import { getUser } from "../../../helpers/functions";
import auth0 from '../../../lib/auth0';
const nodemailer = require("nodemailer");

export default async function sendPDF(req, res) {
  const session = await auth0.getSession(req);
  const userId = getUser(session);
  const { _id } = req.query;

  const incomeInfo = await incomeFetcher(session, _id);
  const businessInfo = await businessFetcher(session);
  const customerInfo = await customersFetcher(session, null, incomeInfo.customer);

  if (!customerInfo.email) {
    res.status(200).send("No email");
    return;
  }

  const filename = `invoice-${incomeInfo.invoice_number}.pdf`;
  const path = `https://${process.env.FTP_HOST}/${ftpConfig.rootDirRel}/${userId}/invoices/${filename}`;


  const body =
    `<strong>שלום ${incomeInfo.customer}!</strong><br>
    קבלה מספר ${incomeInfo.invoice_number} מבית העסק ${businessInfo.name} מוכנה!<br><br>
    הקבלה מצורפת למייל זה, נא לא להשיב`

  const transporter = nodemailer.createTransport({
    host: process.env.TRANSPORTER_HOST,
    port: process.env.TRANSPORTER_PORT,
    auth: {
        user: process.env.TRANSPORTER_USER,
        pass: process.env.TRANSPORTER_PASSWORD
    }
  });
    
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"Abaco חשבונאות בקלות" <${process.env.TRANSPORTER_USER}>`, // sender address
    to: `${customerInfo.email}`,
    subject: "הקבלה שלך מוכנה!",
    html: body,
    attachments: [
      {
        filename,
        path
      }
    ]
  });

  res.status(200).send(info)

}

export const config = {
  api: {
    externalResolver: true,
  },
}