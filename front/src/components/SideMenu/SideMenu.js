import React, { useEffect, useState } from 'react';
import './SideMenu.scss';
import styles from './SideMenu.styles';

// import PropTypes from 'prop-types';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import {
  Drawer,
  Typography,
  List,
  Divider,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import HomeIcon from '@material-ui/icons/Home';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import StorageIcon from '@material-ui/icons/Storage';
import GroupIcon from '@material-ui/icons/Group';
import SettingsIcon from '@material-ui/icons/Settings';
import PowerSettingsIcon from '@material-ui/icons/PowerSettingsNew';

import { LoginContext, LocaleContext, AppContext } from '@/context';
import { useWindowSize } from '@/hooks';
import { breakpoints } from '@/constants';
import { Avatar } from '@/components';

const useStyles = makeStyles(styles);

function SideMenu (props) {
  const {
    toggleOpen,
    open,
    avatar,
    name,
    username,
    logout
  } = props;

  const classes = useStyles();
  const [currentSection, setCurrentSection] = useState(null);

  const size = useWindowSize();

  const menu = [{
    icon: HomeIcon,
    text: props.translate('sections.home'),
    url: '/'
  }, {
    icon: PersonIcon,
    text: props.translate('sections.profile'),
    url: '/profile',
    disabled: true
  }, {
    icon: ShowChartIcon,
    text: props.translate('sections.ranking'),
    url: '/ranking'
  }, {
    icon: StorageIcon,
    text: props.translate('sections.matches'),
    url: '/matches'
  }, {
    icon: GroupIcon,
    text: props.translate('sections.users'),
    url: '/users'
  }, {
    icon: SettingsIcon,
    text: props.translate('sections.settings'),
    url: '/settings',
    disabled: true
  }];

  function navigate (url) {
    if (size.width <= breakpoints.m)
      toggleOpen();

    props.history.push(url);
  }

  useEffect(() => {
    setCurrentSection(props.location.pathname.split('/')[1]);
  }, [ props.location.pathname ]);

  // TODO: Disable some options if no World and/or Game selected ?
  return (
    <Drawer
      variant={size.width > breakpoints.m ? 'permanent' : 'temporary'}
      className={clsx('SideMenu', classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}
      open={open}
      onClose={toggleOpen}
    >
      <div className={classes.header}>
        <Avatar className={classes.avatar} src={avatar} name={name} onClick={toggleOpen} />
        <div>
          <Typography variant="body1">{username}</Typography>
          <Typography className={classes.secondaryText} variant="body2">{name}</Typography>
        </div>
      </div>
      <Divider />
      <List>
        {menu.map((item, index) => (
          <ListItem button disabled={item.disabled} key={index}
            selected={item.url.slice(1).toLowerCase() === currentSection}
            onClick={() => navigate(item.url)}
          >
            <ListItemIcon><item.icon /></ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <ListItem button onClick={logout}>
          <ListItemIcon><PowerSettingsIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
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
    {(login) =>
      <LocaleContext.Consumer>
        {(locale) =>
          <AppContext.Consumer>
            {(app) =>
              <SideMenu
                name={login.user.name}
                username={login.user.username}
                avatar={login.user.avatar}
                translate={locale.translate}
                ref={ref}
                open={app.sideMenu.isOpen}
                toggleOpen={app.sideMenu.toggle}
                logout={login.logout}
                {...props}
              />
            }
          </AppContext.Consumer>
        }
      </LocaleContext.Consumer>
    }
  </LoginContext.Consumer>
));
