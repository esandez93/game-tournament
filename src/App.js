import React, { Component } from 'react';
import './App.scss';
import {
  Switch,
  Route
} from 'react-router-dom';
import { withTranslation } from 'react-i18next';

import {
  Home,
  Login,
  NotFound
} from './pages';
import {
  ThemeContext,
  LocaleContext,
  LoginContext
} from './context';
import * as languages from './locale';
import * as themes from './themes';

const MultiProvider = (props) => {
  return (
    <ThemeContext.Provider value={props.themeContext}>
      <LocaleContext.Provider value={props.localeContext}>
        <LoginContext.Provider value={props.loginContext}>
          {props.children}
        </LoginContext.Provider>
      </LocaleContext.Provider>
    </ThemeContext.Provider>
  );
};

const localeExists = (locale) => languages[locale] ? true : false;
const themeExists = (theme) => themes[theme] ? true : false;

class App extends Component {
  // Helper function to deep merge the context values
  mergeState = (key, value) => {
    this.setState({ [key]: Object.assign({}, this.state[key], value) });
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
      name: 'light',
      theme: themes.light,
      changeTheme: this.changeTheme
    },
    localeContext: {
      locale: 'en',
      changeLocale: this.changeLocale,
      translate: this.props.t
    },
    loginContext: {
      logged: false,
      login: this.login
    }
  }

  componentDidMount() {
    
  }

  render() {
    const {
      themeContext,
      localeContext,
      loginContext
    } = this.state;

    return (
      <MultiProvider
        themeContext={themeContext}
        localeContext={localeContext}
        loginContext={loginContext}
      >
        <div className="App" style={themeContext.theme}>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/login" component={Login}/>
            <Route component={NotFound}/>
          </Switch>
        </div>
      </MultiProvider>
    );
  }
}

export default withTranslation()(App);
