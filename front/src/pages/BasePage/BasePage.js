import React, { Fragment } from 'react';

import { Redirect } from 'react-router-dom';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import { LoginContext, LocaleContext, AppContext } from '@/context';
import { cleanString } from '@/utils';
import { useWindowSize } from '@/hooks';
import { breakpoints } from '@/constants';

function Header (props) {
  const {
    className,
    classes,
    title,
    toggleSideMenu,
    logged,
    ...other
  } = props;

  const size = useWindowSize();

  return size.width > breakpoints.m ? (
    <div className={clsx('Header', className, classes.header)} {...other}>
      <Typography variant="h4">{title}</Typography>
    </div>
  ) : (
    <AppBar position="fixed" className={clsx('Header', className, classes.appBar)} {...other}>
      <Toolbar>
        {logged && <IconButton
          color="inherit"
          aria-label="Open drawer"
          edge="start"
          onClick={toggleSideMenu}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>}
        <Typography variant="h6" noWrap>
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

function BasePage (props) {
  const {
    component: Component,
    name,
    toggleSideMenu,
    ...other
  } = props;

  const size = useWindowSize();

  const classes = makeStyles((theme) => ({
    root: {
      flex: 1,
      paddingTop: theme.spacing(1),
      paddingRight: theme.spacing(4),
      paddingLeft: theme.spacing(4),
      paddingBottom: theme.spacing(1)
    },
    header: {
    },
    page: {
      paddingTop: size.width < breakpoints.m ? theme.spacing(10) : theme.spacing(2)
    }
  }))();

  return (
    <LoginContext.Consumer>
      {(login) =>
        <AppContext.Consumer>
          {(app) =>
            <LocaleContext.Consumer>
              {(locale) => {
                if (login.logged && name === 'Login') {
                  return <Redirect to='/' />
                } else if (login.logged || name === 'Login') {
                  return (
                    <Fragment>
                      <div className={classes.root}>
                        <Header className={clsx(classes.header)} classes={classes} logged={login.logged} toggleSideMenu={app.sideMenu.toggle} title={locale.translate(`sections.${cleanString(props.name.toLowerCase())}`)} />
                        <Component className={clsx('Page', classes.page)} {...other} />
                      </div>
                    </Fragment>
                  );
                } else {
                  return <Redirect to='/login' />
                }
              }}
            </LocaleContext.Consumer>
          }
        </AppContext.Consumer>
      }
    </LoginContext.Consumer>
  );
}

export default BasePage;
