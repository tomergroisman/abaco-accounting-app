const mysql = require('mysql');
import RecentActorsIcon from '@material-ui/icons/RecentActors';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import TocIcon from '@material-ui/icons/Toc';
import SearchIcon from '@material-ui/icons/Search';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';

export const pool = mysql.createPool({
    host     : process.env.MYSQL_HOST,
    user     : process.env.MYSQL_USER,
    password : process.env.MYSQL_PASSWORD,
    database : process.env.MYSQL_DATABASE,
    multipleStatements: true
  });

export const ftpConfig = {
    host     : process.env.FTP_HOST,
    user     : process.env.FTP_USER,
    password : process.env.FTP_PASSWORD,
    rootDirAbs  : process.env.FTP_ABSOLUTE_ROOT_DIR,
    rootDirRel  : process.env.FTP_RELATIVE_ROOT_DIR,
  };
  
export const sidebarItems = [
        {
            text: "תנועה חדשה",
            icon: <AddCircleIcon/>,
            menuItems: [
                { text: "הפקת חשבונית", link: "/income/new" },
                { text: "הוצאה חדשה", link: "/expense/new" },
            ]
        },
        {
            text: "רשומה חדשה",
            icon: <RecentActorsIcon/>,
            menuItems: [
                { text: "ספק", entry: "supplier" },
                { text: "לקוח", entry: "customer" },
                { text: "קטגוריה", entry: "category" },
                { text: "שיטת תשלום", entry: "paymentMethod" },
            ]
        },
        { text: 'סינון', icon: <SearchIcon/>, link: "/filter" },
        {
            text: "רשומות",
            icon: <TocIcon/>,
            menuItems: [
                { text: "ספקים", link: "/suppliers" },
                { text: "לקוחות", link: "/customers" },
                { text: "קטגוריות", link: "/categories" },
                { text: "שיטות תשלום", link: "/payment_methods" },
            ]
        },
        { text: 'העסק שלי', icon: <BusinessCenterIcon/>, link: "/my_business" },
    ];
export const drawerWidth = 200;
export const sidebarTopPadding = 6;

export const alerts = {
    guestAlert: {
        severity: "warning",
        title: "שים לב",
        body: "לא התחברת ולכן אתה מחובר כעת כאורח"
    },
    emailAlert: {
        severity: "error",
        title: "הקבלה לא נשלחה",
        body: "נראה שאין לנו את כתובת המייל של הלקוח... הוסף אותה ונסה שוב!"
    },
}