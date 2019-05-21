import React from 'react';
import Loadable from 'react-loadable';
import { Redirect } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { Loading } from '@/components';
import { LoginContext, LocaleContext } from '@/context';
import { cleanString } from '@/utils';

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

const useStyles = makeStyles(theme => ({
  root: {
    flex: 1,
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingBottom: theme.spacing(1)
  },
  header: {
  },
  page: {
    paddingTop: theme.spacing(2)
  }
}));

function Header (props) {
  return (
    <div className={clsx('Header', props.className)}>
      <Typography variant="h4">{props.title}</Typography>
    </div>
  );
}

function Page (props) {
  const classes = useStyles();
  const {
    component: Component,
    name,
    ...other
  } = props;

  return (
    <LoginContext.Consumer>
      {(login) => (
        <LocaleContext.Consumer>
          {(locale) => {
            if (login.logged && name === 'Login') {
              return <Redirect to='/' />
            } else if (login.logged || name === 'Login') {
              return (
                <div className={classes.root}>
                  <Header className={clsx(classes.header)} title={locale.translate(`sections.${cleanString(props.name.toLowerCase())}`)} />
                  <Component className={clsx('Page', classes.page)} {...other} />
                </div>
              );
            } else {
              return <Redirect to='/login' />
            }
          }}
        </LocaleContext.Consumer>
      )}
    </LoginContext.Consumer>
  );
}

function getLoadable(name, loader) {
  return Loadable({
    loader,
    loading: Loading,
    modules: [ name ],
    render(loaded, props) {
      const Component = loaded.namedExport ? loaded.namedExport : loaded.default;
      return <Page component={Component} name={name} {...props} />
    }
  });
}

const Matches = getLoadable('Matches', () => import(/* webpackChunkName: "Matches" */ './Matches'));
const Home = getLoadable('Home', () => import(/* webpackChunkName: "Home" */ './Home'));
const Login = getLoadable('Login', () => import(/* webpackChunkName: "Login" */ './Login'));
const ThemeTest = getLoadable('ThemeTest', () => import(/* webpackChunkName: "ThemeTest" */ './ThemeTest'));
const NotFound = getLoadable('NotFound', () => import(/* webpackChunkName: "NotFound" */ './NotFound'));
const Ranking = getLoadable('Ranking', () => import(/* webpackChunkName: "Ranking" */ './Ranking'));

export {
  Home,
  Login,
  NotFound,
  Matches,
  ThemeTest,
  Ranking
};
