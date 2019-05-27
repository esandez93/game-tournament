import React, { Component } from 'react';
import './App.scss';
import {
  Switch,
  Route
} from 'react-router-dom';
import { withRouter } from "react-router";
import { withTranslation } from 'react-i18next';
import deepmerge from 'deepmerge';
import { ThemeProvider } from '@material-ui/styles';
import { makeStyles } from '@material-ui/core/styles';

import routes from '@/routes';
import {
  ThemeContext,
  LocaleContext,
  LoginContext,
  AppContext
} from '@/context';
import * as languages from '@/locale';
import * as themes from '@/themes';
import { NotFound } from '@/pages';
import { withAuth } from '@/hoc';
import {
  OfflineBadge,
  SideMenu
} from '@/components';
import { login } from '@/api/users';

const DEV_MODE = false; // process.env.NODE_ENV === 'development';

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

const MultiProvider = (props) => {
  return (
    <ThemeContext.Provider value={props.themeContext}>
      <ThemeProvider theme={props.themeContext.theme}>
        <LocaleContext.Provider value={props.localeContext}>
          <LoginContext.Provider value={props.loginContext}>
            <AppContext.Provider value={props.appContext}>
              {props.children}
            </AppContext.Provider>
          </LoginContext.Provider>
        </LocaleContext.Provider>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

const localeExists = (locale) => languages[locale] ? true : false;
const themeExists = (theme) => themes[theme] ? true : false;

class App extends Component {
  // Helper function to deep merge the context values
  mergeState = (key, value) => {
    this.setState({ [key]: deepmerge(this.state[key], value) });
  }

  changeLocale = (locale) => {
    if (localeExists(locale)) {
      this.props.i18n.changeLanguage(locale)
      this.mergeState('localeContext', { locale: locale });
    }
  }

  changeTheme = (theme) => {
    if (themeExists(theme)) {
      this.mergeState('themeContext', {
        name: theme,
        theme: themes[theme]
      });
    }
  }

  doLogin = ({ username, password }) => {
    login(username, password)
    .then((user) => {
      this.mergeState('loginContext', {
        logged: true,
        user
      });
      this.changeLocale(user.settings.locale);
      this.changeTheme(user.settings.theme);
      this.props.history.push('/');
    })
    .catch(console.error);
  }

  toggleSideMenu = () => {
    this.mergeState('appContext', { sideMenu : { isOpen: !this.state.appContext.sideMenu.isOpen }});
  }

  state = {
    themeContext: {
      name: 'defaultDark',
      theme: themes.defaultDark,
      changeTheme: this.changeTheme
    },
    localeContext: {
      locale: 'es',
      changeLocale: this.changeLocale,
      translate: this.props.t
    },
    loginContext: {
      logged: DEV_MODE ? true : false,
      login: this.doLogin,
      user: {}
    },
    appContext: {
      offline: false,
      sideMenu: {
        isOpen: window.innerWidth > 960,
        toggle: this.toggleSideMenu
      }
    }
  }

  constructor(props) {
    super(props);
    console.log(props)

    window.addEventListener('online', this.setOfflineStatus);
    window.addEventListener('offline', this.setOfflineStatus);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.setOfflineStatus);
    window.removeEventListener('offline', this.setOfflineStatus);
  }

  setOfflineStatus = () => {
    this.mergeState('appContext', { offline: !navigator.onLine });
  }

  componentDidMount() {
    const routed = routes.map((route, index) =>
    <Route key={index} exact path={route.path} render={(props) => {
      const Routed = route.auth ? withAuth(route.component) : route.component;

      return <Routed {...props} />
    }} />);

    this.setState({ routes: routed });
  }

  render() {
    const {
      themeContext,
      localeContext,
      loginContext,
      appContext
    } = this.state;

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
          {DEV_MODE && <DevConfig themeContext={themeContext} localeContext={localeContext} />}
          {loginContext.logged && <Route render={(props) => <SideMenu {...props} />}/>}
          <Switch>
            {this.state.routes}
            <Route component={NotFound}/>
          </Switch>
        </div>
      </MultiProvider>
    );
  }
}

export default withRouter(withTranslation()(App));
