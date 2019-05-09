import React, { useEffect, useState } from 'react';
import './SideMenu.scss';
import styles from './styles';

import PropTypes from 'prop-types';
import clsx from 'clsx';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import PersonIcon from '@material-ui/icons/Person';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import StorageIcon from '@material-ui/icons/Storage';
import GroupIcon from '@material-ui/icons/Group';
import SettingsIcon from '@material-ui/icons/Settings';

import { LoginContext } from '@/context';

const useStyles = makeStyles(styles);

const menu = [{
  icon: PersonIcon,
  text: 'Profile',
  url: '/profile',
  disabled: true
}, {
  icon: ShowChartIcon,
  text: 'Ranking',
  url: '/ranking'
}, {
  icon: StorageIcon,
  text: 'History',
  url: '/history',
  disabled: true
}, {
  icon: GroupIcon,
  text: 'Users',
  url: '/users',
  disabled: true
}, {
  icon: SettingsIcon,
  text: 'Settings',
  url: '/settings',
  disabled: true
}]

function SideMenu (props) {
  const classes = useStyles();
  // const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);

  function toggleOpen () {
    setOpen(!open);
  }

  function navigate (url) {
    props.history.push(url);
  }

  useEffect(() => {
    console.log(props.location.pathname.split('/'))
    setCurrentSection(props.location.pathname.split('/')[1]);
  }, [ props.location.pathname ]);

  return (
    <Drawer
      variant="permanent"
      className={clsx('SideMenu', classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}
      open={open}
    >
      <div className={classes.header}>
        <Avatar className={classes.avatar} src={props.avatar} onClick={toggleOpen}>
          <PersonIcon />
        </Avatar>
        <div>
          <div>{props.username}</div>
          <div>{props.name}</div>
        </div>
      </div>
      <Divider />
      <List>
        {menu.map((item, index) => (
          <ListItem  button disabled={item.disabled} key={index}
            selected={item.text.toLowerCase() === currentSection}
            onClick={() => navigate(item.url)}
          >
            <ListItemIcon><item.icon /></ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}

      </List>
    </Drawer>
  );
}

SideMenu.propTypes = {

};
SideMenu.defaultProps = {

};

export default React.forwardRef((props, ref) => (
  <LoginContext.Consumer>
    {(login) => <SideMenu
      name={login.user.name}
      username={login.user.username}
      avatar={login.user.avatar}
      ref={ref}
      {...props}
    />}
  </LoginContext.Consumer>
));
