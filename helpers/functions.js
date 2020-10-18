
import { useRef } from 'react';
import { sidebarItems } from './constants';

/**
 * Generate sidebar items references objectW
 * 
 * @returns {Object} - Sidebar items references object
 */
export function generateRefsObj() {
    let sidebarRefs = {};
    for (const section in sidebarItems) {
      sidebarItems[section].forEach((item, i) =>
      sidebarRefs[`item-${section}-${i}`] = useRef(null)
      );
    }
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