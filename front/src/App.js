import React, { useEffect, useState } from 'react';
import './App.scss';
import styles from './App.styles';

import {
  Switch,
  Route
} from 'react-router-dom';
import { withRouter } from "react-router";
import { withTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import routes from '@/routes';
import {
  ThemeContext,
  LocaleContext,
  LoginContext,
  AppContext,
  WorkaroundContext
} from '@/context';
import * as languages from '@/locale';
import * as themes from '@/themes';
import { NotFound } from '@/pages';
import { withAuth } from '@/hoc';
import {
  OfflineBadge,
  SideMenu,
  Select
} from '@/components';
import { login, logout } from '@/api/auth';
import { getGames } from '@/api/worlds';
import clsx from 'clsx';

const DEV_MODE = false; // process.env.NODE_ENV === 'development';

const useStyles = makeStyles(styles);

function DevConfig (props) {
  const classes = makeStyles((theme) => ({
    root: {
      position: 'absolute',
      top: 0,
      right: 0,
      padding: theme.spacing(1) / 2,
      backgroundColor: theme.palette.error.dark,
      border: `2px solid ${theme.palette.text.secondary}`,
      zIndex: 1200
    }
  }))();

  const {
    themeContext,
    localeContext
  } = props;

  function toggleLocale () {
    localeContext.changeLocale(localeContext.locale === 'es' ? 'en' : 'es');
  }
  function toggleTheme () {
    themeContext.changeTheme(themeContext.name === 'defaultLight' ? 'defaultDark' : 'defaultLight');
  }

  return (
    <div className={classes.root}>
      <button onClick={toggleLocale}>Locale</button>
      <button onClick={toggleTheme}>Theme</button>
    </div>
  );
}

function MultiProvider (props) {
  const {
    workaroundContext,
    themeContext,
    localeContext,
    loginContext,
    appContext,
    children
  } = props;

  return (
    <WorkaroundContext.Provider value={workaroundContext}>
      <ThemeContext.Provider value={themeContext}>
        <ThemeProvider theme={themeContext.theme}>
          <LocaleContext.Provider value={localeContext}>
            <LoginContext.Provider value={loginContext}>
              <AppContext.Provider value={appContext}>
                {children}
              </AppContext.Provider>
            </LoginContext.Provider>
          </LocaleContext.Provider>
        </ThemeProvider>
      </ThemeContext.Provider>
    </WorkaroundContext.Provider>
  );
}

const localeExists = (locale) => languages[locale] ? true : false;
const themeExists = (theme) => themes[theme] ? true : false;

// TODO: Change locale to save name too
function App (props) {
  const {
    i18n,
    t,
    history
  } = props;

  const classes = useStyles();
  const [ routed, setRouted ] = useState([]);
  const [ themeContext, setThemeContext ] = useState({
    name: 'defaultDark',
    theme: themes.defaultDark,
    changeTheme: changeTheme
  });
  const [ localeContext, setLocaleContext ] = useState({
    locale: 'en',
    changeLocale: changeLocale,
    translate: t
  });

  const [ loginContext, setLoginContext ] = useState({
    logged: false,
    user: {},
    world: localStorage.getItem('world'),
    game: localStorage.getItem('game'),
    login: doLogin,
    logout: doLogout
  });
  const [ appContext, setAppContext ] = useState({
    offline: false,
    sideMenu: {
      isOpen: window.innerWidth > 960
    }
  });
  // TODO: It has to be another solution. The issue is with closure-related if it's put in appContext.sideMenu.
  const [ workaroundContext, setWorkaroundContext ] = useState({
    toggleSideMenu
  });

  const [ games, setGames ] = useState([]);
  const [ worlds, setWorlds ] = useState([]);

  function changeLocale (locale) {
    if (localeExists(locale)) {
      i18n.changeLanguage(locale)
      setLocaleContext({
        ...localeContext,
        locale: locale
      });
    }
  }

  function changeTheme (theme) {
    if (themeExists(theme)) {
      setThemeContext({
        ...themeContext,
        name: theme,
        theme: themes[theme]
      });
    }
  }

  function toggleSideMenu () {
    setAppContext({
      ...appContext,
      sideMenu: {
        ...appContext.sideMenu,
        isOpen: !appContext.sideMenu.isOpen
      }
    });
  }

  function setOfflineStatus () {
    setAppContext({
      ...appContext,
      offline: !navigator.onLine
    });
  }

  function selectWorld (world) {
    localStorage.setItem('world', world);
    setLoginContext({
      ...loginContext,
      world
    });
  }

  function selectGame (game) {
    localStorage.setItem('game', game);
    setLoginContext({
      ...loginContext,
      game
    });
  }

  function doLogin ({ username, password }) {
    login(username, password)
      .then((user) => {
        const _user = {
          ...user
        };

        localStorage.setItem('user', JSON.stringify(_user));

        setLoginContext({
          ...loginContext,
          logged: true,
          user: _user
        });
        changeLocale(_user.settings.locale);
        changeTheme(_user.settings.theme);
        history.push('/');
      })
      .catch(console.error);
  }

  function doLogout () {
    logout()
      .then((res) => {
        localStorage.removeItem('user');
        history.push('/login');
        setLoginContext({
          ...loginContext,
          user: {},
          logged: false
        });
      })
      .catch(console.error);
  }

  useEffect(() => {
    if (!loginContext.user.worlds) return;

    let items = [];
    loginContext.user.worlds.forEach((world) => {
      items.push({
        value: world.id,
        text: world.name,
        image: world.avatar
      });
    });

    setWorlds([ ...items ]);
  }, [ loginContext.user.worlds ]);

  useEffect(() => {
    if (!loginContext.world) return;

    // TODO: Manage errors
    getGames(loginContext.world).then((res) => {
      const items = []
      res.forEach((game) => {
        items.push({
          value: game.id,
          text: game.name,
          image: game.logos.favicon
        });
      });

      setGames([ ...items ]);
    }).catch(console.error);
  }, [ loginContext.world ]);

  useEffect(() => {
    window.addEventListener('online', setOfflineStatus);
    window.addEventListener('offline', setOfflineStatus);

    function setLogin (value) {
      if (value === false) {
        doLogout();
      }

      if (loginContext.logged !== value && (value === true || value === false)) {

        // TODO: Maybe do a get user?
        setLoginContext({
          ...loginContext,
          logged: value
        });
      }
    }

    const _routed = routes.map((route, index) => {
      const Routed = route.auth ? withAuth(route.component, setLogin) : route.component;

      return <Route key={index} exact path={route.path} component={Routed} />
    });

    setRouted(_routed);

    return () => {
      window.removeEventListener('online', setOfflineStatus);
      window.removeEventListener('offline', setOfflineStatus);
    }
  }, []);

  useEffect(() => {
    if (JSON.stringify(loginContext.user) === '{}') {
      const user = localStorage.getItem('user');

      if (user) {
        setLoginContext({
          ...loginContext,
          logged: true,
          user: JSON.parse(user)
        });
      } else if (loginContext.logged) {
        setLoginContext({
          ...loginContext,
          logged: false
        });
      }
    }
  });

  return (
    <MultiProvider
      themeContext={themeContext}
      localeContext={localeContext}
      loginContext={loginContext}
      appContext={appContext}
      workaroundContext={workaroundContext}
    >
      <div className="App" style={{
        backgroundColor: themeContext.theme.palette.background.default,
        color: themeContext.theme.palette.text.primary
      }}>
        {appContext.offline && <OfflineBadge />}
        {DEV_MODE && <DevConfig themeContext={themeContext} localeContext={localeContext} />}
        {loginContext.logged && <Route render={(props) => <SideMenu toggleOpen={toggleSideMenu} {...props} />}/>}
        <div className={clsx(classes.container)}>
          {loginContext.logged && <div className={clsx(classes.selectors)}>
            <Select
              className={clsx(classes.selector)}
              label={localeContext.translate('entities.world')}
              items={worlds}
              value={loginContext.world}
              onChange={(e) => selectWorld(e.target.value)}
              required
              disabled={loginContext.user.worlds && loginContext.user.worlds.length > 0}
            />
            <Select
              className={clsx(classes.selector)}
              label={localeContext.translate('entities.game')}
              items={games}
              value={loginContext.game}
              onChange={(e) => selectGame(e.target.value)}
              required
              disabled={games.length > 0}
            />
          </div>}
          <Switch>
            {routed}
            <Route component={NotFound}/>
          </Switch>
        </div>
      </div>
    </MultiProvider>
  );
}

export default withRouter(withTranslation()(App));
