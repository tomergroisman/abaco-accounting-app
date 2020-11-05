const mysql = require('mysql');
import RecentActorsIcon from '@material-ui/icons/RecentActors';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import TocIcon from '@material-ui/icons/Toc';
import SearchIcon from '@material-ui/icons/Search';

export const pool = mysql.createPool({
    host     : process.env.MYSQL_HOST,
    user     : process.env.MYSQL_USER,
    password : process.env.MYSQL_PASSWORD,
    database : process.env.MYSQL_DATABASE,
    multipleStatements: true
  });
  
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
        { text: 'סינון', icon: <SearchIcon/> },
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
    ];
export const drawerWidth = 200;
export const sidebarTopPadding = 3;