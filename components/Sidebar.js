import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios'
import { useRouter } from 'next/router';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AssignmentIcon from '@material-ui/icons/Assignment';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { sidebarItems } from '../helpers/constants';
import { generateRefsObj } from '../helpers/functions';
import Brand from '../components/Brand';
import Loader from '../components/Loader';
import useStyles from '../styles/components/SidebarStyles';
import NewEntry from './NewEntry';

export default function Sidebar(props) {
  const { popup, drawerWidth, padding, setChildWidth } = props;
  const { user, loading } = props.user;
  const [entry, setEntry] = popup;
  const classes = useStyles(props);
  const sidebarRefs = generateRefsObj();
  const [anchorEl, setAnchorEl] = useState();
  const [businessInfo, setBusinessInfo] = useState(null);
  const childRef = useRef();
  const router = useRouter();

  /**
   * Handle sidebar item click function
   * 
   * @param {Object} evt - An event object
   * @param {Object} item - The sidebar item object that was clicked
   */
  const handleClick = (evt, item) => {
    if (item.link) {        // Direct link
      router.push(item.link);
      return
    }
    if (item.menuItems) {   // Open item's menu
      setAnchorEl(evt.currentTarget);
      return
    }
  }

  /**
   * Hadle close menu function
   * 
   * @param {String} menuItem - The menuItem key in the sidebar item
   */
  const handleCloseMenu = (menuItem) => {
    if (menuItem.entry) {
      setEntry(menuItem.entry)
    }
    if (menuItem.link) {
      router.push({ pathname: menuItem.link }, menuItem.link);
    }
    setAnchorEl(null);
  }

  /**
   * Renders the sidebar items list
   * 
   * @param {Array} items - Sidebar items array
   * @param {string} section - The current sidebar section: main, sub
   */
  const renderMenuItems = () => {
    return sidebarItems.map((item, i) => (
      <div key={item.text}>
        <ListItem ref={sidebarRefs[`item-${i}`]} button onClick={(evt) => handleClick(evt, item)}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
        { item.menuItems &&
          <Menu
            anchorEl={anchorEl}
            open={anchorEl === sidebarRefs[`item-${i}`].current}
            onClose={handleCloseMenu}
            anchorOrigin={{
              vertical: 'top',
              horizontal: drawerWidth * .1,
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            { item.menuItems.map(menuItem =>
              <MenuItem onClick={() => handleCloseMenu(menuItem)} key={menuItem.text}>
                {menuItem.text}
              </MenuItem>
            )}
          </Menu>
          }
        </div>))
  }

  /** ComponentDidMount */
  useEffect(() => {
    setChildWidth(childRef.current.offsetWidth);
  }, []);
  /** Fetch business info */
  useEffect(() => {
    async function fetchData() {
      if (!loading) {
        const res = await axios.get("/api/business");
        const info = res.data.businessInfo;
        setBusinessInfo(info || {});
      }
    }

    fetchData();
  }, [user, router]);

  /** Render */
    return (
      <div className={classes.root}>
        <NewEntry entry={entry} close={() => setEntry(null)} />
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{ paper: classes.drawerPaper }}
        >
          { !businessInfo ?
          <Loader width={drawerWidth - 20} /> :
            <div>
              {businessInfo.name &&
              <div className={classes.drawerContainer}>
                <Brand router={router} name={ businessInfo && businessInfo.name || ""} padding={padding} drawerWidth={drawerWidth} />
                <List>
                  {renderMenuItems()}
                </List>
                <Divider variant="middle"/>
              </div> }
              <List>
                { user ?
                <ListItem button onClick={() => router.push('/api/logout')}>
                  <ListItemIcon><ArrowBackIosIcon /></ListItemIcon>
                  <ListItemText primary="התנתק" />
                </ListItem> :
                <div>
                  <ListItem button onClick={() => router.push('/api/login')}>
                    <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                    <ListItemText primary="התחבר" />
                  </ListItem>
                  <ListItem button onClick={() => router.push('/api/login')}>
                    <ListItemIcon><AssignmentIcon /></ListItemIcon>
                    <ListItemText primary="הרשם" />
                  </ListItem>
                </div> }
              </List>
            </div> }
            </Drawer>
          <div ref={childRef} className={classes.content} >
            {props.children}
          </div>
      </div>
    );
}