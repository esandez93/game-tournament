import React, { useState, useEffect } from 'react';
import styles from './World.styles';

import clsx from 'clsx';
import {
  Switch,
  Route
} from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import {
  Tabs
} from '@/components';
import {
  AppContext,
  LocaleContext,
  LoginContext
} from '@/context';
import {
  getWorldById
} from '@/api/worlds';
import {
  Games,
  Users
} from '@/pages';
import { useWindowSize } from '@/hooks';
import { breakpoints } from '@/constants';

const useStyles = makeStyles(styles);

const tabs = [{
  label: 'Users'
}, {
  label: 'Games'
}, {
  label: 'Settings'
}];
const paths = {
  users: 0,
  games: 1,
  settings: 2
};

function World (props) {
  const {
    setHeader,
    history,
    match
  } = props;

  const size = useWindowSize();
  const classes = useStyles();
  const moreClasses = makeStyles((theme) => ({
    root: {
      paddingTop: size.width > breakpoints.m ? theme.spacing(8) : theme.spacing(15)
    },
    tabs: {
      // The hardcoded 600 is because MUI AppBar has a breakpoint at 600px
      // where it has 8px more of height
      top: size.width > breakpoints.m ? theme.spacing(0) :
        size.width < 600 ? theme.spacing(7) : theme.spacing(8),
      left: 0
    }
  }))();

  const [ world, setWorld ] = useState({});
  const [ tab, setTab ] = useState(match.params && match.params.tab ? paths[match.params.tab] : 0);

  useEffect(() => {
    getWorldById(match.params.id)
      .then((world) => {
        setWorld(world);
      })
      .catch((error) => {
        console.error('world not found', error);
        history.push('/worlds');
      })
  }, [ match.params.id ]);

  // TODO: Review Header. It's not working
  useEffect(() => {
    if (!match.params.tab) {
      history.push(`/worlds/${match.params.id}/users`);
    }

    // TODO: Create Header (avatar + name ???)
    /* setHeader((props) => (
      <div className={clsx(props.className)}>FAKE {props.title}</div>
    )); */

    return () => {
      setTimeout(() => setHeader(null), 100);
    }
  }, []);

  const handleTabChange = (event, selected) => {
    setTab(selected);

    let page = null;
    switch (selected) {
      default:
      case 0:
        page = 'users';
        break;
      case 1:
        page = 'games';
        break;
      case 2:
        page = 'settings';
        break;
    }

    history.push(`/worlds/${match.params.id}/${page}`);
  };

  return (
    <div className={clsx('World', classes.root, moreClasses.root)}>
      <Tabs
        className={clsx(classes.tabs, moreClasses.tabs)}
        tabs={tabs}
        current={tab}
        onChange={handleTabChange}
        color={'secondary'}
      />

      <Switch>
        <Route exact path={'/worlds/:id/users'} render={(props) => (
          <Users className={clsx(classes.users)} users={world.users} {...props} />
        )} />

        <Route exact path={'/worlds/:id/games'} render={(props) => (
          <Games className={clsx(classes.games)} selectedWorld={world.id} {...props} />
        )} />

        <Route exact path={'/worlds/:id/settings'} render={(props) => (
          <div>settings</div>
        )} />
      </Switch>
    </div>
  );
}

export default React.forwardRef((props, ref) => (
  <LoginContext.Consumer>
    {(login) =>
      <LocaleContext.Consumer>
        {(locale) => (
          <AppContext.Consumer>
            {(app) => (
              <World {...props} setHeader={app.setHeader} translate={locale.translate} user={login.user} ref={ref} />
            )}
          </AppContext.Consumer>
        )}
      </LocaleContext.Consumer>
    }
  </LoginContext.Consumer>
));
