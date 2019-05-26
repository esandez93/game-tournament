import './ReactotronConfig';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.scss';

import * as serviceWorker from './serviceWorker';
import './i18n';

import App from './App';

const root = document.getElementById('root');

const render = (Component) => ReactDOM.render(
  <BrowserRouter>
    <Component />
  </BrowserRouter>,
  root
);

render(App);

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    render(NextApp);
  });
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.register();
