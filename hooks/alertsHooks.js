import { useState } from 'react';

export const setAlerts = (isUser) => {
    let init = {
        guestAlert: {
            isOn: isUser,
            severity: "warning",
            title: "שים לב",
            body: "לא התחברת ולכן אתה מחובר כעת כאורח"
        },
        emailAlert: {
            isOn: false,
            severity: "error",
            title: "הקבלה לא נשלחה",
            body: "נראה שאין לנו את כתובת המייל של הלקוח... הוסף אותה ונסה שוב!"
        },
        registeredOnlyAlert: {
            isOn: false,
            severity: "warning",
            title: "אופס!",
            body: "האפשרות הזו פתוחה רק למשתמשים רשומים"
        },
    }
    const [alerts, setAlerts] = useState(init);

    /**
     * Toggle an alert on status
     * 
     * @param {string} alert - Alert name
     */
    const toggleAlert = (alert) => {
        const currentStatus = alerts[alert].isOn;
        let newAlerts = { ...alerts };
        newAlerts[alert].isOn = !currentStatus

        setAlerts(newAlerts);
    }

    /**
     * Set an alert to a specific status
     * 
     * @param {string} alert - Alert name
     * @param {string} newStatus - The new status, can be true or false
     */
    const setAlertStatus = (alert, newStatus) => {
        let newAlerts = { ...alerts };
        newAlerts[alert].isOn = newStatus;

        setAlerts(newAlerts);
    }

    const setStatus = {
        toggle: toggleAlert,
        set: setAlertStatus,
    }

    /** Export */
    return [
        alerts, setStatus
    ];
}