import React, { Fragment } from 'react';
import styles from './BasePage.styles';

import { Redirect } from 'react-router-dom';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import {
  LoginContext,
  LocaleContext,
  WorkaroundContext
} from '@/context';
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
      {title !== 'Login' && <Typography variant="h4">{title}</Typography>}
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

const useStyles = makeStyles(styles);

function BasePage (props) {
  const {
    component: Component,
    name,
    toggleSideMenu,
    ...other
  } = props;

  const size = useWindowSize();

  const classes = useStyles();
  const moreClasses = makeStyles((theme) => ({
    page: {
      paddingTop: size.width < breakpoints.m ? theme.spacing(10) : theme.spacing(2)
    }
  }))();

  return (
    <LoginContext.Consumer>
      {(login) =>
        <WorkaroundContext.Consumer>
          {({ toggleSideMenu }) =>
            <LocaleContext.Consumer>
              {(locale) => (
                <Fragment>
                  <div className={classes.root}>
                    <Header classes={classes} logged={login.logged} toggleSideMenu={toggleSideMenu} title={locale.translate(`sections.${cleanString(props.name.toLowerCase())}`)} />
                    <Component className={clsx('Page', moreClasses.page)} {...other} />
                  </div>
                </Fragment>
                )
              }
            </LocaleContext.Consumer>
          }
        </WorkaroundContext.Consumer>
      }
    </LoginContext.Consumer>
  );
}

export default BasePage;
