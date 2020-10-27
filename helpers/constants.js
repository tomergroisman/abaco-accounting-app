const mysql = require('mysql');
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

export const pool = mysql.createPool({
    host     : process.env.MYSQL_HOST,
    user     : process.env.MYSQL_USER,
    password : process.env.MYSQL_PASSWORD,
    database : process.env.MYSQL_DATABASE
  });
  
export const sidebarItems = {
    main: [
        {
            text: "תנועה חדשה",
            icon: <InboxIcon/>,
            menuItems: [
                { text: "הפקת חשבונית", link: "/income/new" },
                { text: "הוצאה חדשה", link: "/expense/new" },
            ]
        },
        {
            text: "רשומה חדשה",
            icon: <InboxIcon/>,
            menuItems: [
                { text: "ספק", entry: "supplier" },
                { text: "לקוח", entry: "customer" },
                { text: "קטגוריה", entry: "category" },
                { text: "שיטת תשלום", entry: "paymentMethod" },
            ]
        },
        { text: "שלוש", icon: <MailIcon/> },
        { text: "ארבע", icon: <InboxIcon/> },
        { text: "חמש", icon: <InboxIcon/> },
    ],
    sub: [
        { text: "שש", icon: <MailIcon/>},
        { text: "שבע", icon: <InboxIcon/>},
    ]
}
export const drawerWidth = 200;
export const sidebarTopPadding = 3;