const mysql = require('mysql');
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

export const connection = mysql.createConnection({
    host     : 'squid-productions.com',
    user     : 'u376134960_tomer',
    password : 'tGG0706a',
    database : 'u376134960_arduino'
  });
  
export const sidebarItems = {
    main: [
        {
            text: "תנועה חדשה",
            icon: <InboxIcon/>,
            menuItems: [
                { text: "הפקת חשבונית", link: "/new/income" },
                { text: "הוצאה חדשה", link: "/new/expense" },
            ]
        },
        {
            text: "רשומה חדשה",
            icon: <InboxIcon/>,
            menuItems: [
                { text: "ספק", link: "/new/supplier" },
                { text: "לקוח", link: "/new/customer" },
                { text: "סוג הוצאה", link: "/new/customer" },
                { text: "סוג הכנסה", link: "/new/customer" },
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