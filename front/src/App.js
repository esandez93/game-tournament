import React, { useEffect, useState, useReducer } from 'react';
import './App.scss';
import styles from './App.styles';

import {
  Switch,
  Route
} from 'react-router-dom';
import clsx from 'clsx';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import {
  Slide
} from '@material-ui/core';

import {
  Home as HomeIcon,
  Person as ProfileIcon,
  Public as WorldsIcon,
  Group as UsersIcon,
  Gamepad as GamesIcon,
  ShowChart as RankingIcon,
  Storage as MatchesIcon,
  Settings as SettingsIcon,
  PowerSettingsNew as PowerSettingsIcon
} from '@material-ui/icons';

import routes from '@/routes';
import {
  ThemeContext,
  LocaleContext,
  LoginContext,
  AppContext
} from '@/context';
import {
  appReducer,
  loginReducer
} from '@/reducers';
import { useWindowSize } from '@/hooks';
import { breakpoints } from '@/constants';
import * as languages from '@/locale';
import * as themes from '@/themes';
import { NotFound } from '@/pages';
import { withAuth } from '@/hoc';
import {
  Header,
  OfflineBadge,
  SideMenu,
  Snackbar
} from '@/components';
import { login, logout } from '@/api/auth';
import { getOwnUser } from '@/api/users';
import { getGames } from '@/api/worlds';
import { setInvalidTokenCallback } from '@/utils';

// const DEV_MODE = process.env.NODE_ENV === 'development';

const useStyles = makeStyles(styles);

function MultiProvider (props) {
  const {
    themeContext,
    localeContext,
    loginContext,
    appContext,
    children
  } = props;

  return (
    <ThemeContext.Provider value={themeContext}>
      <ThemeProvider theme={themeContext.theme}>
        <LocaleContext.Provider value={localeContext}>
          <LoginContext.Provider value={loginContext}>
            <AppContext.Provider value={appContext}>
              <Route render={(props) => children } />
            </AppContext.Provider>
          </LoginContext.Provider>
        </LocaleContext.Provider>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

const localeExists = (locale) => languages[locale] ? true : false;
const themeExists = (theme) => themes[theme] ? true : false;

const initialLoginContext = {
  logged: false,
  user: {},
  world: localStorage.getItem('world') || 'null',
  game: localStorage.getItem('game') || 'null',
};

const initialAppContext = {
  page: 'home',
  offline: false,
  sideMenu: {
    isOpen: window.innerWidth > 960
  }
};

function App (props) {
  const {
    i18n,
    t,
    history
  } = props;

  const storageTheme = localStorage.getItem('theme') || 'defaultDark';
  const storageLocale = localStorage.getItem('locale') || 'en';

  const size = useWindowSize();
  const classes = useStyles();

  const [ themeContext, setThemeContext ] = useState({
    name: storageTheme,
    theme: themes[storageTheme],
    changeTheme
  });
  const [ localeContext, setLocaleContext ] = useState({
    locale: storageLocale,
    changeLocale,
    translate: t
  });
  const [ loginContext, loginDispatch ] = useReducer(loginReducer, {
    ...initialLoginContext,
    changeUser,
    selectWorld,
    login: doLogin,
    logout: doLogout
  });
  const [ appContext, appDispatch ] = useReducer(appReducer, {
    ...initialAppContext,
    setTitle,
    setHeader,
    sideMenu: {
      ...initialAppContext.sideMenu,
      toggleSideMenu
    }
  });

  const [ routed, setRouted ] = useState([]);
  const [ snackbar, setSnackbar ] = useState({
    open: false,
    message: null
  });
  const [ games, setGames ] = useState([]);
  const [ worlds, setWorlds ] = useState([]);

  // TODO: Add the error checks also on each view and redirect to home with error alert
  const menuItems = [
    {
      icon: HomeIcon,
      text: t('sections.home'),
      url: '/'
    }, {
      icon: ProfileIcon,
      text: t('sections.profile'),
      url: '/profile',
      disabled: true
    }, {
      icon: WorldsIcon,
      text: t('sections.worlds'),
      url: '/worlds'
    }, {
      separator: true
    }, {
      icon: UsersIcon,
      text: t('sections.users'),
      url: '/users',
      hasError: () => !isWorldSelected(),
      onClick: () => {
        let nav = true;

        if (!isWorldSelected()) {
          setSnackbar({
            open: true,
            message: t('app.errors.noWorld')
          });
          nav = false;
        }

        return nav;
      }
    }, {
      icon: GamesIcon,
      text: t('sections.games'),
      url: '/games',
      hasError: () => !isWorldSelected(),
      onClick: () => {
        let nav = true;

        if (!isWorldSelected()) {
          setSnackbar({
            open: true,
            message: t('app.errors.noWorld')
          });
          nav = false;
        }

        return nav;
      }
    }, {
      icon: RankingIcon,
      text: t('sections.ranking'),
      url: '/ranking',
      hasError: () => !isWorldSelected(),
      onClick: () => {
        let nav = true;

        if (!isWorldSelected()) {
          setSnackbar({
            open: true,
            message: t('app.errors.noWorld')
          });
          nav = false;
        }

        return nav;
      }
    }, {
      icon: MatchesIcon,
      text: t('sections.matches'),
      url: '/matches',
      hasError: () => !isWorldSelected() || !isGameSelected(),
      onClick: () => {
        let nav = true;

        if (!isWorldSelected()) {
          setSnackbar({
            open: true,
            message: t('app.errors.noWorld')
          });
          nav = false;
        } else if (!isGameSelected()) {
          setSnackbar({
            open: true,
            message: t('app.errors.noGame')
          });
          nav = false;
        }

        return nav;
      }
    }, {
      separator: true
    }, {
      icon: SettingsIcon,
      text: t('sections.settings'),
      url: '/settings'
    }, {
      icon: PowerSettingsIcon,
      text: t('sections.logout'),
      onClick: doLogout
    }
  ];

  function changeUser (user) {
    loginDispatch({ type: 'changeUser', user });
  }

  function changeLocale (locale) {
    if (localeExists(locale)) {
      i18n.changeLanguage(locale);
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
    appDispatch({ type: 'toggleSideMenu' });
  }

  function setTitle (title) {
    appDispatch({ type: 'setTitle', title });
  }

  function setHeader (header) {
    appDispatch({ type: 'setHeader', header });
  }

  function setOfflineStatus () {
    appDispatch({ type: 'setIsOffline', offline: !navigator.onLine });
  }

  function selectWorld (world) {
    loginDispatch({ type: 'changeWorld', world, history });
  }

  function selectGame (game) {
    loginDispatch({ type: 'changeGame', game, history });
  }

  function initUserValues(user) {
    function selectDefaults() {
      if (user.worlds[0]) {
        selectWorld(user.worlds[0].id);

        if (user.worlds[0].games[0]) {
          selectGame(user.worlds[0].games[0].id);
        }
      }
    }

    if (user && loginContext.world) {
      let found = false;

      user.worlds.forEach((world) => {
        if (world.id === loginContext.world) {
          createGameItems(world.games);
          found = true;
        }
      });

      if (!found) {
        createGameItems([]);
        selectDefaults();
      }
    } else {
      selectDefaults();
    }
  }

  function createGameItems (games = []) {
    if (!games || !loginContext.world) return;

    let items = [{
      value: 'null',
      text: <em>{t('app.selectGame')}</em>
    }];

    games.forEach((game) => {
      items.push({
        value: game.id,
        text: game.name,
        image: game.logos ? game.logos.favicon: null
      });
    });

    let found = false;

    if (loginContext.user.worlds) {
      loginContext.user.worlds.forEach((world) => {
        world.admins.forEach((admin) => {
          if (admin === loginContext.user.id) {
            found = true;
          }
        });
      });
    }

    if (found) {
      items.push({
        value: 'new',
        text: <strong>{t('app.createNewGame')}</strong>
      });
    }

    setGames([ ...items ]);
  }

  function createWorldItems (worlds = []) {
    if (!worlds) return;

    let items = [{
      value: 'null',
      text: <em>{t('app.selectWorld')}</em>
    }];

    worlds.forEach((world) => {
      items.push({
        value: world.id,
        text: world.name,
        avatar: world.avatar,
        avatarName: world.name
      });
    });

    items.push({
      value: 'new',
      text: <strong>{t('app.createNewWorld')}</strong>
    });

    setWorlds([ ...items ]);
  }

  function doLogin ({ username, password }) {
    login(username, password)
      .then((user) => {
        const _user = {
          ...user
        };

        initUserValues(user);

        loginDispatch({ type: 'login', user: _user });

        console.log('doLogin')

        changeLocale(_user.settings.locale);
        changeTheme(_user.settings.theme);
        history.push('/');
      })
      .catch(console.error);
  }

  function doLogout () {
    logout()
      .then((res) => {
        /* localStorage.removeItem('world');
        localStorage.removeItem('game'); */

        loginDispatch({ type: 'setLogged', logged: false });

        history.push('/login');
      })
      .catch(console.error);
  }

  function isGameSelected () {
    return loginContext.game && loginContext.game !== 'null' && loginContext.game !== 'new';
  }

  function isWorldSelected () {
    return loginContext.world && loginContext.world !== 'null' && loginContext.world !== 'new';
  }

  useEffect(() => {
    createWorldItems(loginContext.user.worlds);
  }, [ loginContext.user.worlds ]);

  // TODO: Fix Game initial auto select
  useEffect(() => {
    console.log('useEffect world');
    if (!loginContext.user.worlds || !isWorldSelected()) {
      createGameItems([]);
      selectGame('null');
    } else {
      loginContext.user.worlds.forEach((world) => {
        if (world.id === loginContext.world) {
          getGames(world.id)
            .then(games => {
              console.log(games)
              createGameItems(games);

              if (!games || games.length === 0) {
                selectGame('null');
              }
            })
            .catch(console.error);
        }
      });
    }
  }, [ loginContext.world, loginContext.user.worlds ]);

  useEffect(() => {
    window.addEventListener('online', setOfflineStatus);
    window.addEventListener('offline', setOfflineStatus);

    function setLogin (value) {
      if (value === false) {
        doLogout();
      }

      if (![true, false].includes(loginContext.logged)) {
        // TODO: Maybe do a get user?
        loginDispatch({ type: 'setLogged', logged: value });
      }
    }

    const _routed = routes.map((route, index) => {
      const Routed = route.auth ? withAuth(route.component, setLogin) : route.component;
      let params = {
      };

      if (route.path.includes('/worlds')) {
        params.createWorldItems = createWorldItems;
        params.selectWorld = selectWorld;
      }

      return <Route key={index} path={route.path} render={(props) => <Routed {...props} {...params} />} />
    });

    setRouted(_routed);

    setInvalidTokenCallback(doLogout);

    getOwnUser()
      .then(user => {
        loginDispatch({ type: 'login', user });
      })
      .catch(console.error)

    return () => {
      window.removeEventListener('online', setOfflineStatus);
      window.removeEventListener('offline', setOfflineStatus);
    }
  }, []);

  return (
    <MultiProvider
      themeContext={themeContext}
      localeContext={localeContext}
      loginContext={loginContext}
      appContext={appContext}
    >
      <div className="App" style={{
        backgroundColor: themeContext.theme.palette.background.default,
        color: themeContext.theme.palette.text.primary
      }}>
        {appContext.offline && <OfflineBadge />}
        {loginContext.logged && <Route render={(props) =>
          <SideMenu toggleOpen={toggleSideMenu} items={menuItems} {...props} />
        }/>}
        <Snackbar
          variant="error"
          direction="up"
          message={snackbar.message}
          open={snackbar.open}
          onClose={() => setSnackbar({ open: false })}
          TransitionComponent={Slide}
          anchorOrigin={{
            vertical: 'top',
            horizontal: size.width > breakpoints.m ? 'right' : 'center'
          }}
        />
        <div className={clsx(classes.app)}>
          <Route render={(props) =>
            <Header
              logged={loginContext.logged}
              toggleSideMenu={toggleSideMenu}
              title={t(`sections.${appContext.page}`)}
              worlds={worlds}
              selectWorld={selectWorld}
              games={games}
              selectGame={selectGame}
              {...props}
            />
          } />
          <div className={clsx(classes.container)}>
            <Switch>
              {routed}
              <Route component={NotFound} />
            </Switch>
          </div>
        </div>
      </div>
    </MultiProvider>
  );
}

export default withRouter(withTranslation()(App));
