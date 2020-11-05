
import { useRef } from 'react';
import { sidebarItems } from './constants';

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