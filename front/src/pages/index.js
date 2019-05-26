import React from 'react';
import Loadable from 'react-loadable';

import { Loading } from '@/components';
import BasePage from './BasePage';

/*
Loadable important things [ https://github.com/jamiebuilds/react-loadable ]

- timeout property to define when Loadable will change its prop to true (handled at Loading component) (is disabled by default)
- delay property to define when Loadable will actually show the component to avoid flashing the Loading component for just a few ms. (default is 200ms)
- loader prop can be anything as long as it returns a Promise with the content to render.
- preload function that will start preloading if called (ex: Home.preload())
- Multiload using Loadable.Map. Requires a render function.
  Example:
  Loadable.Map({
    loader: {
      Profile: () => import('./Profile'),
      info: () => fetch('./user/:userId').then(res => res.json()),
    },
    render(loaded, props) {
      let Profile = loaded.Profile.default;
      let info = loaded.info;

      return <Profile {...props} info={info}/>;
    },
  });
*/

function getLoadable(name, loader) {
  return Loadable({
    loader,
    loading: Loading,
    modules: [ name ],
    render(loaded, props) {
      const Component = loaded.namedExport ? loaded.namedExport : loaded.default;
      return <BasePage component={Component} name={name} {...props} />
    }
  });
}

const Home = getLoadable('Home', () => import(/* webpackChunkName: "Home" */ './Home'));
const Login = getLoadable('Login', () => import(/* webpackChunkName: "Login" */ './Login'));
const NotFound = getLoadable('NotFound', () => import(/* webpackChunkName: "NotFound" */ './NotFound'));
const Matches = getLoadable('Matches', () => import(/* webpackChunkName: "Matches" */ './Matches'));
const Ranking = getLoadable('Ranking', () => import(/* webpackChunkName: "Ranking" */ './Ranking'));
const ThemeTest = getLoadable('ThemeTest', () => import(/* webpackChunkName: "ThemeTest" */ './ThemeTest'));
const Users = getLoadable('Users', () => import(/* webpackChunkName: "Users" */ './Users'));

export {
  Home,
  Login,
  NotFound,
  Matches,
  Ranking,
  ThemeTest,
  Users
};
