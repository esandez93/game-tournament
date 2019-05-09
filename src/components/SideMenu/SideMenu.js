import React from 'react';
import './SideMenu.scss';

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

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(8) + 1,
    },
  },
  header: {
    display: 'flex',
    padding: theme.spacing(1),
  },
  avatar: {
    cursor: 'pointer',
    height: theme.spacing(6),
    width: theme.spacing(6),
    marginRight: theme.spacing(2)
  }
}));

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
  const [open, setOpen] = React.useState(false);

  function toggleOpen () {
    setOpen(!open);
  }

  function navigate (url) {
    props.history.push(url);
  }

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
          <ListItem button disabled={item.disabled} key={index} onClick={() => navigate(item.url)}>
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
      name={login.login.name}
      username={login.login.username}
      avatar={login.login.preferences.avatar}
      ref={ref}
      {...props}
    />}
  </LoginContext.Consumer>
));
