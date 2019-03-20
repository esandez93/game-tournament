import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Frontload } from 'react-frontload';
import Loadable from 'react-loadable';
import './index.scss';

import App from './App';
import * as serviceWorker from './serviceWorker';

const root = document.getElementById('root');

const render = (Component) => ReactDOM.render(
  <BrowserRouter>
    <Frontload noServerRender={true}>
      <Component />
    </Frontload>
  </BrowserRouter>,
  root
);

if (root.hasChildNodes() === true) {
  Loadable.preloadReady().then(() => {
    ReactDOM.hydrate(
      <BrowserRouter>
        <Frontload noServerRender={true}>
          <App />
        </Frontload>
      </BrowserRouter>,
      root
    );
  });
} else if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    render(NextApp);
  });
} else {
  render(App);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();