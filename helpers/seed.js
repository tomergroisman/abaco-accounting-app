import { v4 as uuid} from 'uuid';
import { businessFetcher, incomeFetcher, customersFetcher} from '../helpers/fetchers';
import { formaDateToSubmit, dateToString, uploadInvoice } from '../helpers/functions';

export const erase = `
    DELETE FROM business WHERE user='guest';
    DELETE FROM categories WHERE user='guest';
    DELETE FROM customers WHERE user='guest';
    DELETE FROM expenses WHERE user='guest';
    DELETE FROM incomes WHERE user='guest';
    DELETE FROM invoices WHERE user='guest';
    DELETE FROM payment_methods WHERE user='guest';
    DELETE FROM suppliers WHERE user='guest';
`;

const invoicesToSeed = [
    {
        _id: uuid(),
        customer: "דונלד טראמפ",
        sum_before_vat: 1800,
        vat: "17",
        vat_amount: 306,
        total: 2106,
        category: "מכירות בארץ",
        payment_method: "PayPal",
        reference: "אסמכתא הכנסה לדוגמה 1",
        comments: "הכנסה לדוגמה 1",
        invoice_number: 401,
        items: [
            {
            description: "פריט 1",
            price: 100,
            quantity: 3,
            sum: 300,
            },
            {
            description: "פריט 2",
            price: 200,
            quantity: 6,
            sum: 1200,
            },
            {
            description: "פריט 3",
            price: 300,
            quantity: 1,
            sum: 300,
            },
        ],
    },
    {
        _id: uuid(),
        customer: "דני קושמרו",
        sum_before_vat: 28500,
        vat: "0",
        vat_amount: 0,
        total: 28500,
        category: 'מכירות בחו"ל',
        payment_method: "מזומן",
        reference: "אסמכתא הכנסה לדוגמה 2",
        comments: "הכנסה לדוגמה 2",
        invoice_number: 402,
        items: [
            {
            description: "מצלמת Canon D-9",
            price: 9500,
            quantity: 3,
            sum: 28500,
            },
        ],
    },
    {
        _id: uuid(),
        customer: "נירו לוי",
        sum_before_vat: 2941,
        vat: "17",
        vat_amount: 499.97,
        total: 3440.97,
        category: "מכירות בארץ",
        payment_method: "העברה בנקאית",
        reference: "אסמכתא הכנסה לדוגמה 3",
        comments: "הכנסה לדוגמה 3",
        invoice_number: 403,
        items: [
            {
            description: "טלויזיה",
            price: 2500,
            quantity: 1,
            sum: 2500,
            },
            {
            description: "פיצוחים",
            price: 13,
            quantity: 30,
            sum: 390,
            },
            {
            description: "קוקה קולה",
            price: 9,
            quantity: 3,
            sum: 27,
            },
            {
            description: "במבה",
            price: 4,
            quantity: 6,
            sum: 24,
            },
        ],
    },
];

const expensesToSeed = [
    {
        _id: uuid(),
        category: "אחזקה ותיקונים",
        supplier: "שופרסל",
        reference: "אסמכתא הוצאה לדוגמה 1",
        price: 500,
        vat: 120,
        total: 620,
        comments: "הוצאה לדוגמה 1"
    },
    {
        _id: uuid(),
        category: "הוצאות בארץ",
        supplier: "Adobe",
        reference: "אסמכתא הוצאה לדוגמה 2",
        price: 1620,
        vat: 326,
        total: 1946,
        comments: "הוצאה לדוגמה 2"
    },
    {
        _id: uuid(),
        category: "הוצאות רכב",
        supplier: "יש לי בוטן",
        reference: "אסמכתא הוצאה לדוגמה 3",
        price: 160,
        vat: 0,
        total: 160,
        comments: "הוצאה לדוגמה 3"
    },
]

export const seed = `
    INSERT INTO business
        VALUES ('אורח', 'אבן גבירול 50, תל אביב, ישראל', '1800-000000', 'guest@example.com', 'https://squid-productions.com/uploads/accounting_app/guest/default_logo.png', 'guest');
    ${seedCategories()}
    ${seedCustomers()}
    ${seedPaymentMethods()}
    ${seedSuppliers()}
    ${seedIncomes()}
    ${seedExpenses()}
`;

/**
 * Upload invoices pdf to the server
 */
export function upload(puppeteer) {
    invoicesToSeed.forEach(async (invoice) => {
        const businessInfo = await businessFetcher(null);
        const invoiceInfo = await incomeFetcher(null, invoice._id);
        const customerInfo = await customersFetcher(null, null, invoiceInfo.customer);  
        
        const data = {
            business: businessInfo,
            ...invoiceInfo,
            customer: customerInfo[0],
            date: dateToString(invoiceInfo.date),
        }
        uploadInvoice(puppeteer, data, "guest");
    });
}

/**
 * Seed the categories table
 */
function seedCategories() {
    return `
    INSERT INTO categories
        VALUES
            ('${uuid()}', 'expense', 'הוצאות בארץ', 'guest'),
            ('${uuid()}', 'expense', 'אחזקה ותיקונים', 'guest'),
            ('${uuid()}', 'expense', 'הוצאות רכב', 'guest'),
            ('${uuid()}', 'income', 'מכירות בארץ', 'guest'),
            ('${uuid()}', 'income', 'מכירות בחו"ל', 'guest'),
            ('${uuid()}', 'income', 'הכנסה ממניות', 'guest');`;
}

/**
 * Seed the customers table
 */
function seedCustomers() {
    return `
    INSERT INTO customers
        VALUES
            ('${uuid()}', 'דני קושמרו', 'ויצמן 10, גבעתיים, ישראל', '052-123456789', 'dani@kushmaro.co.il', 'מגיש חדשות 12', 'guest'),
            ('${uuid()}', 'דונלד טראמפ', 'שדרות פנסילבניה 1600, וושינגטון די סי, ארה"ב', '050-987654321', 'donald@president.com', 'הלקוח הראשון', 'guest'),
            ('${uuid()}', 'נירו לוי', 'הארי 10, ירושלים, ישראל', '054-4566545', 'niro@nirolevi.com', 'חבר של יוסי', 'guest');`;
}

/**
 * Seed the customers table
 */
function seedPaymentMethods() {
    return `
    INSERT INTO payment_methods
        VALUES
            ('${uuid()}', 'מזומן', 'guest'),
            ('${uuid()}', 'צ''ק', 'guest'),
            ('${uuid()}', 'PayPal', 'guest'),
            ('${uuid()}', 'העברה בנקאית', 'guest');`;
}

/**
 * Seed the customers table
 */
function seedSuppliers() {
    return `
    INSERT INTO suppliers
        VALUES
            ('${uuid()}', 'שופרסל', '1000', 'בורכוב 54, גבעתיים, ישראל', '03-5331013', 'shufersal@sheli.co.il', 'רשת שופרסל בע"מ', 'guest'),
            ('${uuid()}', 'Adobe', '2000', 'Andrew Wolf 10, Londin, UK', '44-2071231234', 'adobe@adobe.com', 'ספק תוכנה ומחשוב', 'guest'),
            ('${uuid()}', 'יש לי בוטן', '3000', 'הדולב 5, חיפה, ישראל', '057-2233445', 'yeshli@boten.co.il', 'ממתקים ופיצוחים', 'guest');`;
}

/**
 * Seed the income and invoices table
 */
function seedIncomes() {
    let resIncomes = '';
    let resInvoices = '';
    invoicesToSeed.forEach(invoice => {
        const { _id, customer, sum_before_vat, vat, vat_amount, total,
            category, payment_method, reference, comments, invoice_number } = invoice;

        resIncomes += `INSERT INTO incomes VALUES
            ('${_id}', '${customer}', '${formaDateToSubmit(new Date())}', '${sum_before_vat}',
            '${vat}', '${vat_amount}', '${total}', '${category}', '${payment_method}', '${reference}',
            '${comments}', '${invoice_number}', '${"guest"}');`;

        invoice.items.forEach(item => {
            const { description, price, quantity, sum } = item;
            resInvoices += `INSERT INTO invoices VALUES
                ('${_id}', '${description}', '${price}', '${quantity}', '${sum}', 'guest');`
        });
    });

    return `${resIncomes}
        ${resInvoices}`;
}

/**
 * Seed the expenses and invoices table
 */
function seedExpenses() {
    let resExpeses = '';
    expensesToSeed.forEach(expense => {
        const { _id, category, supplier, reference, price, vat, total, comments } = expense;

        resExpeses += `INSERT INTO expenses VALUES
            ('${_id}', '${category}', '${supplier}', '${reference}', '${formaDateToSubmit(new Date())}',
            '${price}', '${vat}', '${total}', '${comments}',  '${"guest"}');`;
    });

    return resExpeses;
}