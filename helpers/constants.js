import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

export const menuItems = {
    main: [
        { text: "אחד", icon: <InboxIcon/>},
        { text: "שתיים", icon: <InboxIcon/>},
        { text: "שלוש", icon: <MailIcon/>},
        { text: "ארבע", icon: <InboxIcon/>},
        { text: "חמש", icon: <InboxIcon/>},
    ],
    sub: [
        { text: "שש", icon: <MailIcon/>},
        { text: "שבע", icon: <InboxIcon/>},
    ]
}