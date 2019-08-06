import React, { useState, useEffect } from 'react';
import styles from './Header.styles';

import clsx from 'clsx';

import { getThemeProps } from '@material-ui/styles';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import { Select } from '@/components';
import {
  AppContext,
  LocaleContext,
  LoginContext
} from '@/context';
import { useWindowSize } from '@/hooks';
import { breakpoints } from '@/constants';
import { cleanString } from '@/utils';

const useStyles = makeStyles(styles);

function Selectors (props) {
  const {
    worlds,
    selectWorld,
    games,
    selectGame
  } = props;

  const classes = useStyles();

  return (
    <LocaleContext.Consumer>
      {(locale) => (
        <LoginContext.Consumer>
          {(login) => (
            <div className={clsx(classes.selectors)}>
              <Select
                className={clsx(classes.selector)}
                label={locale.translate('entities.world')}
                items={worlds}
                value={login.world}
                onChange={(e) => selectWorld(e.target.value)}
                inputProps={{ className: classes.selectorInput }}
                {...getThemeProps}
              />

              <Select
                className={clsx(classes.selector)}
                label={locale.translate('entities.game')}
                items={games}
                value={login.game}
                onChange={(e) => selectGame(e.target.value)}
                inputProps={{ className: classes.selectorInput }}
                {...getThemeProps}
              />
            </div>
          )}
        </LoginContext.Consumer>
      )}
    </LocaleContext.Consumer>
  );
}

function Header (props) {
  const {
    className,
    toggleSideMenu,
    logged,
    worlds,
    selectWorld,
    games,
    selectGame,
    staticContext,
    location,
    title,
    HeaderComp,
    ...other
  } = props;

  const classes = useStyles();
  const size = useWindowSize();

  return logged ?
      size.width > breakpoints.m ? (
        <div className={clsx('Header', className, classes.header)} {...other}>
          {HeaderComp
            ? <HeaderComp className={clsx(classes.title)} title={title} />
            : <Typography className={clsx(classes.title)} variant="h4">{title}</Typography>
          }

          <Selectors
            worlds={worlds}
            selectWorld={selectWorld}
            games={games}
            selectGame={selectGame}
          />
        </div>
      ) : (
        <AppBar position="fixed" className={clsx('Header', className, classes.appBar)} {...other}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              edge="start"
              onClick={toggleSideMenu}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              {title}
            </Typography>

            <Selectors
              worlds={worlds}
              selectWorld={selectWorld}
              games={games}
              selectGame={selectGame}
            />
          </Toolbar>
        </AppBar>
      )
    : <div></div>
}

export default React.forwardRef((props, ref) => (
  <AppContext.Consumer>
    {(app) =>
      <LocaleContext.Consumer>
        {(locale) => <Header {...props} title={app.title} HeaderComp={app.header} ref={ref} />}
      </LocaleContext.Consumer>
    }
  </AppContext.Consumer>
));

