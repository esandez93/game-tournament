import Loadable from 'react-loadable';
import { Loading } from '@/components';

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

const Home = Loadable({
  loader: () => import(/* webpackChunkName: "Home" */ './Home'),
  loading: Loading,
  modules: [ 'Home' ]
});
const Login = Loadable({
  loader: () => import(/* webpackChunkName: "Login" */ './Login'),
  loading: Loading,
  modules: [ 'Login' ]
});
const ThemeTest = Loadable({
  loader: () => import(/* webpackChunkName: "ThemeTest" */ './ThemeTest'),
  loading: Loading,
  modules: [ 'ThemeTest' ]
});
const NotFound = Loadable({
  loader: () => import(/* webpackChunkName: "NotFound" */ './NotFound'),
  loading: Loading,
  modules: [ 'NotFound' ]
});

export {
  Home,
  Login,
  ThemeTest,
  NotFound
};