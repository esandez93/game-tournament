import React, { Fragment, useState, useEffect } from 'react';
import styles from './Worlds.styles';

import clsx from 'clsx';
import {
  Switch,
  Route
} from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import {
  Chip,
  Typography
} from '@material-ui/core';

import {
  Avatar,
  Button,
  Card,
  Form,
  Loading
} from '@/components';
import {
  LocaleContext,
  LoginContext
} from '@/context';
import {
  getWorlds,
  createWorld
} from '@/api/worlds';
import {
  getUserRelationships
} from '@/api/users';
import {
  World as WorldPage
} from '@/pages';

const useStyles = makeStyles(styles);

function Worlds (props) {
  const {
    className,
    user,
    createWorldItems,
    changeUser,
    translate,
    selectWorld,
    history,
    location
  } = props;

  const classes = useStyles();
  const [ init, setInit ] = useState(false);
  const [ worlds, setWorlds ] = useState([]);
  const [ newWorld, setNewWorld ] = useState({
    avatar: '',
    name: ''
  });
  const [ newWorldUsers, setNewWorldUsers ] = useState([]);
  const [ newWorldAdmins, setNewWorldAdmins ] = useState([]);
  const [ usersItems, setUsersItems ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(true);

  const chipRenderValue = (selected) => (
    <div className={classes.chips}>
      {selected.map(value => (
        <Chip
          key={value.id}
          className={classes.chip}
          label={value.name}
          avatar={<Avatar className={classes.chipAvatar} src={value.avatar} name={value.name} />}
        />
      ))}
    </div>
  );

  const handleWorldChange = field => event => {
    setNewWorld({ ...newWorld, [field]: event.target.value });
  };

  const worldForm = [{
    type: 'input',
    inputType: 'text',
    label: translate('world.name'),
    value: newWorld.name,
    onChange: handleWorldChange('name'),
    required: true
  }, {
    type: 'input',
    inputType: 'text',
    label: translate('world.avatar'),
    value: newWorld.avatar,
    onChange: handleWorldChange('avatar')
  }, {
    type: 'select',
    multiple: true,
    dividers: true,
    label: translate('worlds.users'),
    items: usersItems,
    value: newWorldUsers,
    renderValue: chipRenderValue,
    onChange: event => {
      setNewWorldUsers(event.target.value);
    }
  }, {
    type: 'select',
    multiple: true,
    dividers: true,
    label: translate('worlds.admins'),
    items: usersItems,
    value: newWorldAdmins,
    renderValue: chipRenderValue,
    onChange: event => {
      setNewWorldAdmins(event.target.value);
    }
  }];

  useEffect(() => {
    if (Object.entries(user).length === 0) return;

    if (location.pathname === '/worlds/new') {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }

    getWorlds({
      users: user.id
    }).then((wrlds) => {
      setWorlds(wrlds);
      createWorldItems(wrlds);
    }).catch((err) => {
      console.log(err);
    }).finally(() => {
      setIsLoading(false);
    });

    getUserRelationships(user.id)
      .then((rels) => {
        const items = [];
        rels.forEach((rel) => {
          items.push({
            avatar: rel.avatar || true,
            avatarName: rel.name,
            value: rel,
            text: <span><strong>{rel.name}</strong>  -  <em>{rel.username}</em></span>
          });
        });

        setUsersItems([ ...items ]);

        if (items && items.length > 0) {
          worldForm[2].disabled = true;
          worldForm[3].disabled = true;
        }

        setInit(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [ user ]);

  function clickCreateWorld () {
    setIsLoading(true);
    const users = newWorldUsers.map(usr => usr.id);
    const admins = newWorldAdmins.map(admin => admin.id);

    createWorld({
      ...newWorld,
      users: [ user.id, ...users ],
      admins: [ user.id, ...admins ]
    }).then((world) => {
      setWorlds([
        ...worlds,
        world
      ]);

      changeUser({
        ...user,
        worlds: [
          ...user.worlds,
          world
        ]
      });

      selectWorld(world.id);
      history.push('/worlds');
    }).catch((err) => {
      console.log(err);
    }).finally(() => {
      setIsLoading(false);
    });
  }

  function goNewWorld () {
    setIsLoading(false);
    history.push(`/worlds/new`);
  }

  function goDetail (id) {
    setIsLoading(false);
    selectWorld(id);
    history.push(`/worlds/${id}/users`);
  }

  // TODO: On Worlds list
  // * Number of users (world.users.length)
  // * Number of games (enabledGames)
  // * Number of played games (Matches count)
  return (
    <div className={clsx('Worlds', className, classes.root)}>
      <Switch>
        <Route exact path={'/worlds'} render={(props) => (
          <Fragment>
            <Card className={clsx(classes.card, classes.newWorldCard)}>
              <Button color="primary" onClick={goNewWorld}>{translate('worlds.newWorld')}</Button>
            </Card>

            <div className={clsx(classes.worlds)}>
              {worlds.map((world) => (
                <Card key={world.id} className={clsx(classes.card, classes.worldCard)}>
                  <Avatar src={world.avatar} name={world.name} />
                  <Typography>{world.name}</Typography>
                  <Button color="primary" onClick={() => goDetail(world.id)}>{translate('details')}</Button>
                </Card>
              ))}
              <Loading className={clsx(classes.loading)} isLoading={isLoading} />
            </div>
          </Fragment>
        )} />
        <Route exact path={'/worlds/new'} render={(props) => (
          <div className={clsx(classes.forms)}>
            {init && <Form
              className={clsx(classes.form)}
              title={translate('worlds.newWorld')}
              fields={worldForm}
              onSubmit={clickCreateWorld}
              submitText={translate('forms.create')}
              isLoading={isLoading}
            />}
          </div>
        )} />
        <Route exact path={'/worlds/:id/:tab?'} component={WorldPage} />
      </Switch>
    </div>
  );
}

export default React.forwardRef((props, ref) => (
  <LoginContext.Consumer>
    {(login) =>
      <LocaleContext.Consumer>
        {(locale) => <Worlds {...props} translate={locale.translate} user={login.user} changeUser={login.changeUser} currentWorld={login.world} ref={ref} />}
      </LocaleContext.Consumer>
    }
  </LoginContext.Consumer>
));
