import React, { useEffect, useState } from 'react';
import './SideMenu.scss';
import styles from './styles';

import PropTypes from 'prop-types';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
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
import Typography from '@material-ui/core/Typography';

import { LoginContext, LocaleContext } from '@/context';

const useStyles = makeStyles(styles);

function SideMenu (props) {
  const classes = useStyles();
  const [open, setOpen] = useState(window.innerWidth > 1080);
  const [currentSection, setCurrentSection] = useState(null);

  const menu = [{
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
    url: '/users',
    disabled: true
  }, {
    icon: SettingsIcon,
    text: props.translate('sections.settings'),
    url: '/settings',
    disabled: true
  }];

  function toggleOpen () {
    setOpen(!open);
  }

  function navigate (url) {
    props.history.push(url);
  }

  useEffect(() => {
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
          <Typography variant="body1">{props.username}</Typography>
          <Typography className={classes.secondaryText} variant="body2">{props.name}</Typography>
        </div>
      </div>
      <Divider />
      <List>
        {menu.map((item, index) => (
          <ListItem  button disabled={item.disabled} key={index}
            selected={item.url.slice(1).toLowerCase() === currentSection}
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
    {(login) =>
      <LocaleContext.Consumer>
        {(locale) =>
          <SideMenu
            name={login.user.name}
            username={login.user.username}
            avatar={login.user.avatar}
            translate={locale.translate}
            ref={ref}
            {...props}
          />
        }
      </LocaleContext.Consumer>
    }
  </LoginContext.Consumer>
));
