import { v4 as uuid} from 'uuid';
import { businessFetcher, incomeFetcher, customersFetcher} from './fetchers';
import { formaDateToSubmit, dateToString, uploadInvoice } from './functions';

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

const guestSeedBusiness = `
    INSERT INTO business
        VALUES ('אורח', 'אבן גבירול 50, תל אביב, ישראל', '1800-000000', 'guest@example.com', 'https://squid-productions.com/uploads/abaco/users/guest/default_logo.png', 'guest');`

export function getSeedSQL(user) {
    const userId = user ? user : "guest";
    let seedBusiness = guestSeedBusiness;
    if (user) {
        seedBusiness =
            `INSERT INTO business (user)
                VALUES ('${userId}');`;
    }
    return `
    ${seedBusiness}
    ${seedCategories(userId)}
    ${seedCustomers(userId)}
    ${seedPaymentMethods(userId)}
    ${seedSuppliers(userId)}
    ${seedIncomes(userId)}
    ${seedExpenses(userId)}`
}

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
            customer: customerInfo,
            date: dateToString(invoiceInfo.date),
        }
        uploadInvoice(puppeteer, data, "guest");
    });
}

/**
 * Seed the categories table
 * 
 * @param {String} userId - Ther seeded user id
 */
function seedCategories(userId) {
    return `
    INSERT INTO categories
        VALUES
            ('${uuid()}', 'expense', 'ארנונה', '${userId}'),
            ('${uuid()}', 'expense', 'הוצאות רכב', '${userId}'),
            ('${uuid()}', 'expense', 'הוצאות תקשורת', '${userId}'),
            ('${uuid()}', 'expense', 'משכורות לעובדים', '${userId}'),
            ('${uuid()}', 'expense', 'קניות סחורה', '${userId}'),
            ('${uuid()}', 'expense', 'שכירות משרד', '${userId}'),
            ('${uuid()}', 'income', 'הכנסה ממניות', '${userId}'),
            ('${uuid()}', 'income', 'הכנסה משכירות', '${userId}'),
            ('${uuid()}', 'income', 'מכירות בארץ', '${userId}'),
            ('${uuid()}', 'income', 'מכירות בחו"ל', '${userId}'),
            ('${uuid()}', 'income', 'שכר טרחה', '${userId}'),
            ('${uuid()}', 'income', 'תשלום בעבור שירות', '${userId}');`;
}

/**
 * Seed the customers table
 * 
 * @param {String} userId - Ther seeded user id
 */
function seedCustomers(userId) {
    if (userId == "guest") {
        return `
        INSERT INTO customers
            VALUES
                ('${uuid()}', 'דני קושמרו', 'ויצמן 10, גבעתיים, ישראל', '052-123456789', 'dani@kushmaro.co.il', 'מגיש חדשות 12', '${userId}'),
                ('${uuid()}', 'דונלד טראמפ', 'שדרות פנסילבניה 1600, וושינגטון די סי, ארה"ב', '050-987654321', 'donald@president.com', 'הלקוח הראשון', '${userId}'),
                ('${uuid()}', 'נירו לוי', 'הארי 10, ירושלים, ישראל', '054-4566545', 'niro@nirolevi.com', 'חבר של יוסי', '${userId}');`;
    }
    return "";
}

/**
 * Seed the customers table
 * 
 * @param {String} userId - Ther seeded user id
 */
function seedPaymentMethods(userId) {
    return `
    INSERT INTO payment_methods
        VALUES
            ('${uuid()}', 'מזומן', '${userId}'),
            ('${uuid()}', 'צ''ק', '${userId}'),
            ('${uuid()}', 'PayPal', '${userId}'),
            ('${uuid()}', 'Bit', '${userId}'),
            ('${uuid()}', 'העברה בנקאית', '${userId}');`;
}

/**
 * Seed the customers table
 * 
 * @param {String} userId - Ther seeded user id
 */
function seedSuppliers(userId) {
    if (userId == "guest") {
        return `
        INSERT INTO suppliers
            VALUES
                ('${uuid()}', 'שופרסל', '1000', 'בורכוב 54, גבעתיים, ישראל', '03-5331013', 'shufersal@sheli.co.il', 'רשת שופרסל בע"מ', '${userId}'),
                ('${uuid()}', 'Adobe', '2000', 'Andrew Wolf 10, Londin, UK', '44-2071231234', 'adobe@adobe.com', 'ספק תוכנה ומחשוב', '${userId}'),
                ('${uuid()}', 'יש לי בוטן', '3000', 'הדולב 5, חיפה, ישראל', '057-2233445', 'yeshli@boten.co.il', 'ממתקים ופיצוחים', '${userId}');`;
    }
    return "";
}

/**
 * Seed the income and invoices table
 * 
 * @param {String} userId - Ther seeded user id
 */
function seedIncomes(userId) {
    if (userId == "guest") {
        let resIncomes = '';
        let resInvoices = '';
        invoicesToSeed.forEach(invoice => {
            const { _id, customer, sum_before_vat, vat, vat_amount, total,
                category, payment_method, reference, comments, invoice_number } = invoice;
    
            resIncomes += `INSERT INTO incomes VALUES
                ('${_id}', '${customer}', '${formaDateToSubmit(new Date())}', '${sum_before_vat}',
                '${vat}', '${vat_amount}', '${total}', '${category}', '${payment_method}', '${reference}',
                '${comments}', '${invoice_number}', '${userId}');`;
    
            invoice.items.forEach(item => {
                const { description, price, quantity, sum } = item;
                resInvoices += `INSERT INTO invoices VALUES
                    ('${_id}', '${description}', '${price}', '${quantity}', '${sum}', '${userId}');`
            });
        });
    
        return `${resIncomes}
            ${resInvoices}`;
    }
    return "";
}

/**
 * Seed the expenses and invoices table
 * 
 * @param {String} userId - Ther seeded user id
 */
function seedExpenses(userId) {
    if (userId == "guest") {
        let resExpeses = '';
        expensesToSeed.forEach(expense => {
            const { _id, category, supplier, reference, price, vat, total, comments } = expense;
    
            resExpeses += `INSERT INTO expenses VALUES
                ('${_id}', '${category}', '${supplier}', '${reference}', '${formaDateToSubmit(new Date())}',
                '${price}', '${vat}', '${total}', '${comments}',  '${userId}');`;
        });
    
        return resExpeses;
    }
    return "";
}