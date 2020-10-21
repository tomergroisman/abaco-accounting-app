import React, { useState, useContext } from 'react';
import axios from 'axios';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { sidebarItems } from '../helpers/constants';
import { generateRefsObj } from '../helpers/functions';
import Brand from '../components/Brand';
import { UserContext } from '../helpers/context';
import useStyles from '../styles/components/SidebarStyles';
import NewEntry from './NewEntry';

export default function Sidebar(props) {
  const { router, drawerWidth, padding } = props;
  const classes = useStyles(props);
  const sidebarRefs = generateRefsObj();
  const [anchorEl, setAnchorEl] = useState();
  const [entry, setEntry] = useState(null);
  const user = useContext(UserContext);

  /**
   * Handle sidebar item click function
   * 
   * @param {Object} evt - An event object
   * @param {*} item - The sidebar item object that was clicked
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
    setAnchorEl(null);
  }

  /**
   * Close the entry dialog
   * 
   * @param {Object} data - Data to post toentry API
   */
  const handleCloseDialog = (data) => {
    if (data)
      axios.post(`/api/${entry}?user=${user}`, {data: data});
    setEntry(null);
  }

  /**
   * Renders the sidebar items list
   * 
   * @param {Array} items - Sidebar items array
   * @param {string} section - The current sidebar section: main, sub
   */
  const renderList = (items, section) => {
    return items.map((item, i) => (
      <div key={item.text}>
        <ListItem ref={sidebarRefs[`item-${section}-${i}`]} button onClick={(evt) => handleClick(evt, item)}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
        { item.menuItems &&
          <Menu
            anchorEl={anchorEl}
            open={anchorEl === sidebarRefs[`item-${section}-${i}`].current}
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

  /** Render */
  return (
    <div className={classes.root}>
      <NewEntry entry={entry} handleClose={handleCloseDialog} />
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{ paper: classes.drawerPaper }}
      >
        <div className={classes.drawerContainer}>
          <Brand router={router} name="Test" padding={padding} drawerWidth={drawerWidth} />
          <List>
            {renderList(sidebarItems['main'], "main")}
          </List>
          <Divider variant="middle"/>
          <List>
            {renderList(sidebarItems['sub'], "sub")}
          </List>
        </div>
        <div className={classes.connectionStatus}>
          <span>מחובר כ-{user}</span>
        </div>
      </Drawer>
      <div className={classes.content} >
        {props.children}
      </div>
    </div>
  );
}