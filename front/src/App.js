import React, { useEffect, useState } from 'react';
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
  Person as ProfileIcon,
  Home as HomeIcon,
  ShowChart as RankingIcon,
  Storage as MatchesIcon,
  Group as UsersIcon,
  Settings as SettingsIcon,
  Public as WorldsIcon
} from '@material-ui/icons';

import routes from '@/routes';
import {
  ThemeContext,
  LocaleContext,
  LoginContext,
  AppContext,
  WorkaroundContext
} from '@/context';
import { useWindowSize } from '@/hooks';
import { breakpoints } from '@/constants';
import * as languages from '@/locale';
import * as themes from '@/themes';
import { NotFound } from '@/pages';
import { withAuth } from '@/hoc';
import {
  OfflineBadge,
  SideMenu,
  Select,
  Snackbar
} from '@/components';
import { login, logout } from '@/api/auth';
import { setInvalidTokenCallback } from '@/utils';

// const DEV_MODE = process.env.NODE_ENV === 'development';

const useStyles = makeStyles(styles);

const initialLoginContext = {
  logged: false,
  user: {},
  worlds: [],
  world: localStorage.getItem('world') || 'null',
  game: localStorage.getItem('game') || 'null',
};

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

function App (props) {
  const {
    i18n,
    t,
    history
  } = props;

  const storageUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null;
  const storageTheme = storageUser ? storageUser.settings.theme : 'defaultDark';
  const storageLocale = storageUser ? storageUser.settings.locale : 'en';

  const size = useWindowSize();
  const classes = useStyles();
  const [ routed, setRouted ] = useState([]);
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

  const [ loginContext, setLoginContext ] = useState({
    ...initialLoginContext,
    changeUser,
    login: doLogin,
    logout: doLogout
  });
  const [ appContext, setAppContext ] = useState({
    offline: false,
    sideMenu: {
      isOpen: window.innerWidth > 960
    }
  });
  // TODO: It has to be another solution. The issue is with closure-related if it's put in appContext.sideMenu
  //       It seems the destructuring holds the initial values
  const [ workaroundContext/*, setWorkaroundContext*/ ] = useState({
    toggleSideMenu
  });

  const [ snackbar, setSnackbar ] = useState({
    open: false,
    message: null
  });
  const [ games, setGames ] = useState([]);
  const [ worlds, setWorlds ] = useState([]);

  // TODO: Add the error checks also on each view and redirect to home with error alert
  const menuItems = [{
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
    hasError: () => !isWorldSelected() || !worldHasGames(),
    onClick: () => {
      let nav = true;

      if (!isWorldSelected()) {
        setSnackbar({
          open: true,
          message: t('app.errors.noWorld')
        });
        nav = false;
      } else if (!worldHasGames()) {
        setSnackbar({
          open: true,
          message: t('app.errors.currentWorldHasNoGames')
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
  }];

  function changeUser (user) {
    setLoginContext((state) => ({
      ...state,
      user: {
        ...state.user,
        ...user,
        settings: {
          ...state.user.settings,
          ...user.settings
        }
      }
    }));
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
    if (world === 'new') {
      localStorage.removeItem('world');
      history.push('/worlds/new');
    } else if (world === 'null') {
      localStorage.removeItem('world');
    } else {
      localStorage.setItem('world', world);
    }

    if (world !== 'new') {
      setLoginContext({
        ...loginContext,
        world
      });
    }
  }

  function selectGame (game) {
    if (game === 'new') {
      localStorage.removeItem('game');
      // history.push('/games/new');
    } else if (game === 'null') {
      localStorage.removeItem('game');
    } else {
      localStorage.setItem('game', game);
    }

    if (game !== 'new') {
      setLoginContext({
        ...loginContext,
        game
      });
    }
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
      // console.log(loginContext.world)
      user.worlds.forEach((world) => {
        if (world.id === loginContext.world) {
          createGameItems(world);
          found = true;
        }
      });

      if (!found) {
        selectDefaults();
      }
    } else {
      selectDefaults();
    }
  }

  function createGameItems (world) {
    let items = [{
      value: 'null',
      text: <em>{t('app.selectGame')}</em>
    }];

    world.games.forEach((game) => {
      items.push({
        value: game.id,
        text: game.name,
        image: game.logos.favicon
      });
    });

    items.push({
      value: 'new',
      text: <strong>{t('app.createNewGame')}</strong>
    });

    setGames([ ...items ]);
  }

  function doLogin ({ username, password }) {
    login(username, password)
      .then((user) => {
        const _user = {
          ...user
        };

        initUserValues(user);

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
        /* localStorage.removeItem('world');
        localStorage.removeItem('game'); */

        history.push('/login');
        setLoginContext({
          ...loginContext,
          user: {},
          logged: false
        });
      })
      .catch(console.error);
  }

  function isWorldSelected () {
    return loginContext.world && loginContext.world !== 'null' && loginContext.world !== 'new';
  }

  function worldHasGames () {
    let hasGames = false;

    if (loginContext.world && loginContext.user.worlds) {
      const world = loginContext.user.worlds.find((item) => {
        return item.id === loginContext.world;
      });

      if (world && world.games && world.games.length > 0) {
        hasGames = true;
      }
    };

    return hasGames;
  }

  useEffect(() => {
    if (!loginContext.user.worlds) return;

    let items = [{
      value: 'null',
      text: <em>{t('app.selectWorld')}</em>
    }];

    loginContext.user.worlds.forEach((world) => {
      items.push({
        value: world.id,
        text: world.name,
        image: world.avatar
      });
    });

    items.push({
      value: 'new',
      text: <strong>{t('app.createNewWorld')}</strong>
    });

    setWorlds([ ...items ]);
  }, [ loginContext.user.worlds ]);

  useEffect(() => {
    if (!loginContext.user.worlds
      || !loginContext.world
      || loginContext.world === 'null'
      || loginContext.world === 'new'
    ) { return; }

    loginContext.user.worlds.forEach((world) => {
      if (world.id === loginContext.world) {
        createGameItems(world);
      }
    });
  }, [ loginContext.world, loginContext.user.worlds ]);

  useEffect(() => {
    window.addEventListener('online', setOfflineStatus);
    window.addEventListener('offline', setOfflineStatus);

    const user = localStorage.getItem('user');
    if (user && user[0] === '{') {
      const usr = JSON.parse(localStorage.getItem('user'));
      initUserValues(usr);
      i18n.changeLanguage(usr.settings.locale);
    }

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

    setInvalidTokenCallback(doLogout);

    return () => {
      window.removeEventListener('online', setOfflineStatus);
      window.removeEventListener('offline', setOfflineStatus);
    }
  }, []);

  useEffect(() => {
    if (JSON.stringify(loginContext.user) === '{}') {
      const user = localStorage.getItem('user');

      if (user && user[0] === '{') {
        setLoginContext({
          ...loginContext,
          logged: true,
          user: JSON.parse(user)
        });
      } else if (loginContext.logged) {
        doLogout();
      }
    }
  }, [ loginContext.user, localStorage.getItem('user') ]);

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
        {loginContext.logged && <Route render={(props) => <SideMenu toggleOpen={toggleSideMenu} items={menuItems} {...props} />}/>}

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
        <div className={clsx(classes.container)}>
          {loginContext.logged && <div className={clsx(classes.selectors)}>
            {worlds && worlds.length > 0 && <Select
              className={clsx(classes.selector)}
              label={localeContext.translate('entities.world')}
              items={worlds}
              value={loginContext.world}
              onChange={(e) => selectWorld(e.target.value)}
              inputProps={{ className: classes.selectorInput }}
            />}
            {games && games.length > 0 && <Select
              className={clsx(classes.selector)}
              label={localeContext.translate('entities.game')}
              items={games}
              value={loginContext.game}
              onChange={(e) => selectGame(e.target.value)}
              inputProps={{ className: classes.selectorInput }}
            />}
          </div>}
          <Switch>
            {routed}
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    </MultiProvider>
  );
}

export default withRouter(withTranslation()(App));
