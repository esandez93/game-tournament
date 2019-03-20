import React, { Component } from 'react';
import './App.scss';

import {
  Switch,
  Route
} from 'react-router-dom';

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
import {
  light as lightTheme
} from './themes';

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

class App extends Component {
  changeLocale = (locale) => {
    this.setState({ localeContext: { locale: locale } });
  }
  translate = (key) => {
    const split = key.split('.');
    let temp = languages[this.state.localeContext.locale];

    for (let i = 0; i < split.length; i++) {
      temp = temp[split[i]];
    }

    return temp;
  }

  changeTheme = (theme) => {
    this.setState({ themeContext: { theme: theme } });
  }

  login = () => {
    this.setState({ loginContext: { logged: true } });
  }

  state = {
    themeContext: {
      theme: lightTheme,
      changeTheme: this.changeTheme
    },
    localeContext: {
      locale: 'en',
      changeLocale: this.changeLocale,
      translate: this.translate
    },
    loginContext: {
      logged: false,
      login: this.login
    }
  }

  componentDidMount() {
    this.translate('a');
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
        <div className="App">
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

export default App;
