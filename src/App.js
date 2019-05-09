import React, { Component } from 'react';
import './App.scss';
import {
  Switch,
  Route
} from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import deepmerge from 'deepmerge';
import { ThemeProvider } from '@material-ui/styles';

import {
  ThemeContext,
  LocaleContext,
  LoginContext,
  NetworkContext
} from '@/context';
import * as languages from '@/locale';
import * as themes from '@/themes';
import {
  Home,
  Login,
  NotFound,
  Ranking,
  ThemeTest
} from '@/pages';
import {
  OfflineBadge,
  SideMenu
} from '@/components';

const DEV_MODE = process.env.NODE_ENV === 'development';

const MOCK_USER = {
  id: 0,
  username: 'esandez',
  name: 'Eric Sández',
  email: 'esandez93@gmail.com',
  company: 'Scytl',
  group: 'frontend',
  preferences: {
    theme: 'defaultDark'
  }
}

const MultiProvider = (props) => {
  return (
    <ThemeContext.Provider value={props.themeContext}>
      <ThemeProvider theme={props.themeContext.theme}>
        <LocaleContext.Provider value={props.localeContext}>
          <LoginContext.Provider value={props.loginContext}>
            <NetworkContext.Provider value={props.networkContext}>
              {props.children}
            </NetworkContext.Provider>
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

  login = () => {
    this.mergeState('loginContext', { logged: true });
  }

  state = {
    themeContext: {
      name: 'defaultDark',
      theme: themes.defaultDark,
      changeTheme: this.changeTheme
    },
    localeContext: {
      locale: 'en',
      changeLocale: this.changeLocale,
      translate: this.props.t
    },
    loginContext: {
      logged: DEV_MODE ? true : false,
      login: DEV_MODE ? MOCK_USER : this.login
    },
    networkContext: {
      offline: false
    }
  }

  constructor(props) {
    super(props);

    window.addEventListener('online', this.setOfflineStatus);
    window.addEventListener('offline', this.setOfflineStatus);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.setOfflineStatus);
    window.removeEventListener('offline', this.setOfflineStatus);
  }

  setOfflineStatus = () => {
    this.mergeState('networkContext', { offline: !navigator.onLine });
  }

  componentDidMount() {

  }

  render() {
    const {
      themeContext,
      localeContext,
      loginContext,
      networkContext
    } = this.state;

    return (
      <MultiProvider
        themeContext={themeContext}
        localeContext={localeContext}
        loginContext={loginContext}
        networkContext={networkContext}
      >
        <div className="App" style={{
          backgroundColor: themeContext.theme.palette.background.default,
          color: themeContext.theme.palette.text.primary
        }}>
          {networkContext.offline && <OfflineBadge />}
          <Route component={SideMenu}/>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/login" component={Login}/>
            <Route exact path="/ranking" component={Ranking}/>
            <Route exact path="/theme-test" component={ThemeTest}/>
            <Route component={NotFound}/>
          </Switch>
        </div>
      </MultiProvider>
    );
  }
}

export default withTranslation()(App);
