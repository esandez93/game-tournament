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
    items
  } = props;

  const classes = useStyles();
  const [currentSection, setCurrentSection] = useState(null);

  const size = useWindowSize();

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
        {items.map((item, index) => {
          if (item.separator) {
            return <Divider key={index} className={clsx(classes.divider)} />;
          } else {
            return (
              <ListItem className={clsx({ [ classes.error ]: item.hasError && item.hasError() })} button disabled={item.disabled} key={index}
                selected={item.url ? item.url.slice(1).toLowerCase() === currentSection : false}
                onClick={() => {
                  if (item.onClick) {
                    if (item.onClick()) {
                      navigate(item.url);
                    }
                  } else {
                    navigate(item.url);
                  }
                }}
              >
                <ListItemIcon><item.icon /></ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            );
          }
        })}
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
                {...props}
              />
            }
          </AppContext.Consumer>
        }
      </LocaleContext.Consumer>
    }
  </LoginContext.Consumer>
));
