
import { useRef } from 'react';
const Client = require('ftp');
import { pool, sidebarItems, ftpConfig } from './constants';
const fs = require('fs');

/**
 * Generate sidebar items references objectW
 * 
 * @returns {Object} - Sidebar items references object
 */
export function generateRefsObj() {
  let sidebarRefs = new Object();
  sidebarItems.forEach((item, i) =>
    sidebarRefs[`item-${i}`] = useRef(null)
  );
  return sidebarRefs;
}

/**
 * Get today's date
 * 
 * @returns {string} - Today's date
 */
export function getTodayDate() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
}

/**
 * Format a date for mySQL submition
 * 
 * @param {String} date - Date (dd/mm/yyyy) to formt
 * @returns A yyyy-mm-dd formated date
 */
export function formaDateToSubmit(date) {
  const splitDate = date.split("/");
  const mm = splitDate[0];
  const dd = splitDate[1];
  const yyyy = splitDate[2];

  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Format a date for to show to the user
 * 
 * @param {String} date - Date to formt
 * @returns A dd-mm-yyyy formated date
 */
export function formaDateToShow(date) {
  const splitDate = date.replace(/T.*/, "").split("-")
  const yyyy = splitDate[0];
  const mm = splitDate[1];
  const dd = splitDate[2];

  return `${dd}/${mm}/${yyyy}`;
}
/**
 * Format a dashed phone number to show to the user
 * 
 * @param {String} phone - Date to formt
 * @returns A dashed phone nuber
 */
export function toDashedPhone(phone) {
  if (phone[1] == '5')
    return phone.substring(0, 3) + "-" + phone.substring(3)
  else
    return phone.substring(0, 2) + "-" + phone.substring(2)
}

/**
 * Returns a ccy format float number (x.xx)
 * 
 * @param {Number} num - The number to format
 */
export function ccyFormat(num) {
  return `${num.toFixed(2)}`;
}

/**
 * Returns a string number seperated by commas
 * 
 * @param {String} n - Number to operate on
 */
export function numberWithCommas(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Enable instant validation only after clicking the submit button
 */
export const enbleInstantValidate = (formValidator) => {
  formValidator.instantValidate = true;
  formValidator.childs.forEach(element => element.instantValidate = true)
}

/**
 * Return a transactions array, sorted by date
 * 
 * @param {Array} data 
 */
export function createTransactions(data) {
  let transactions = [];
  for (const type in data) {
      data[type].forEach(t => t.type = type.slice(0, -1));
      transactions.push(...data[type]);
  }
  transactions.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
  return transactions;
}

/**
 * 
 * @param {Object} file - File object to upload
 * @param {String} user - The user's id
 */
export function uploadLogo(file, user) {
  const logoFile = fs.readFileSync(file.path)
  const ext = file.name.replace(/.*\.(.*)$/, "$1");
  const dest = `${ftpConfig.rootDir}/${user}/logo-${Date.now()}.${ext}`;
  const c = new Client();

  // Upload the file to the server
  function upload() {
    c.put(logoFile, dest, (err) => {
      if (err) console.error(err);

      // Delete temp uploaded file
      fs.unlinkSync(file.path, (err) => {
        if (err) console.error(err);
      });

      c.end();
    });
  }

  c.on('ready', () => {
    c.list(`${ftpConfig.rootDir}/${user}`, (err, list) => {
      if (err) console.error(err);

      try {
        const prevLogoName = list.filter(item => item.type != 'd' && item.name.includes("logo"))[0].name;
        c.delete(`${ftpConfig.rootDir}/${user}/${prevLogoName}`, (err) => {
          if (err) console.error(err);
          upload()
        });
      } catch {
        upload()
      }
    });
  });

  c.connect(ftpConfig);
  return `https://${process.env.FTP_HOST}/${dest}`;
}

/**
 * Create a new user on the system:
 *    - Open a user's directory on the FTP server
 * 
 * @param {String} user - The new Auth0 user id
 */
export function createUser(user) {
  const c = new Client();

  c.on('ready', () => {
    c.mkdir(`${ftpConfig.rootDir}/${user}`, true, (err) => err && console.err(err));
    c.mkdir(`${ftpConfig.rootDir}/${user}/invoices`, true, (err) => err && console.err(err));
    
    c.end();
  });

  c.connect(ftpConfig);
}

/**
 * Get My-SQL pool connection
 * Returns a connection object
 */

export function connect() {
  return new Promise((resolve, reject) => {    
      pool.getConnection(async (err, connection) => {
          if (err) {
              reject(null);
          }
          resolve(connection)
      });
  });
}
/**
 * Get authenticated user id
 */
export function getUser(session) {
  return session ? session.user.sub.replace("auth0|", "") : "guest";
}

/**
 * Generate a form data object from the data to upload
 */
export function toFormData(data) {
  let formData = new FormData();

  for (const key in data) {
    formData.append(key, data[key] || null);
  }

  return formData;
}