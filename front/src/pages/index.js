import React from 'react';
import Loadable from 'react-loadable';

import { LoadableLoading } from '@/components';
import BasePage from './BasePage';
import _NotFound from './NotFound';

/*
Loadable important things [ https://github.com/jamiebuilds/react-loadable ]

- timeout property to define when Loadable will change its prop to true (handled at LoadableLoading component) (is disabled by default)
- delay property to define when Loadable will actually show the component to avoid flashing the LoadableLoading component for just a few ms. (default is 200ms)
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

function getLoadable(name, loader, isBasePage = true) {
  const Component = Loadable({
    loader,
    loading: LoadableLoading,
    modules: [ name ],
    render(loaded, props) {
      const Component = loaded.namedExport ? loaded.namedExport : loaded.default;
      if (isBasePage) {
        return <BasePage component={Component} name={name} {...props} />
      } else {
        return <Component {...props} />
      }
    }
  });
  Component.showName = `Loadable(${name})`

  return Component;
}

const Home = getLoadable('Home', () => import(/* webpackChunkName: "Home" */ './Home'));
const Login = getLoadable('Login', () => import(/* webpackChunkName: "Login" */ './Login'));
const Matches = getLoadable('Matches', () => import(/* webpackChunkName: "Matches" */ './Matches'));
const Ranking = getLoadable('Ranking', () => import(/* webpackChunkName: "Ranking" */ './Ranking'));
const Settings = getLoadable('Settings', () => import(/* webpackChunkName: "Settings" */ './Settings'));
const Signup = getLoadable('Signup', () => import(/* webpackChunkName: "Signup" */ './Signup'));
const ThemeTest = getLoadable('ThemeTest', () => import(/* webpackChunkName: "ThemeTest" */ './ThemeTest'));
const Users = getLoadable('Users', () => import(/* webpackChunkName: "Users" */ './Users'));
const Games = getLoadable('Games', () => import(/* webpackChunkName: "Games" */ './Games'));
const Worlds = getLoadable('Worlds', () => import(/* webpackChunkName: "Worlds" */ './Worlds'));

const World = getLoadable('World', () => import(/* webpackChunkName: "World" */ './Worlds/World'), false);

const NotFound = (props) => <BasePage component={_NotFound} name={'NotFound'} {...props} />;
//const NotFound = getLoadable('NotFound', () => import(/* webpackChunkName: "NotFound" */ './NotFound'));

export {
  Games,
  Home,
  Login,
  NotFound,
  Matches,
  Ranking,
  Settings,
  Signup,
  ThemeTest,
  Users,
  Worlds,
  World
};
