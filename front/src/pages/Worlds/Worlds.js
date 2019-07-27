import React, { useState, useEffect } from 'react';
import styles from './Worlds.styles';

import clsx from 'clsx';
import {
  Switch,
  Route
} from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import {
  Typography
} from '@material-ui/core';

import {
  Button,
  Card,
  Form
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

const useStyles = makeStyles(styles);

function Worlds (props) {
  const {
    user,
    createWorldItems,
    changeUser,
    translate
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

  const handleWorldChange = field => event => {
    setNewWorld({ ...newWorld, [field]: event.target.value });
  };
  // TODO: Change renderValue to use Chips. Update Select component to allow it.
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
    renderValue: (selected) => selected.join(', '),
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
    renderValue: (selected) => selected.join(', '),
    onChange: event => {
      setNewWorldAdmins(event.target.value);
    }
  }];

  useEffect(() => {
    getWorlds({
      users: user.id
    }).then((wrlds) => {
      setWorlds(wrlds);
      createWorldItems(wrlds);
    }).catch((err) => {
      console.log(err);
    });

    getUserRelationships(user.id)
      .then((rels) => {
        const items = [];
        rels.forEach((rel) => {
          items.push({
            avatar: rel.avatar || true,
            avatarName: rel.name,
            value: rel.id,
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
  }, []);

  function clickCreateWorld () {
    createWorld({
      ...newWorld,
      users: [ user.id, ...newWorldUsers ],
      admins: [ user.id, ...newWorldAdmins ]
    }).then((world) => {
      changeUser({
        ...user,
        worlds: [
          ...user,
          world
        ]
      });

       // TODO: Select new world and redirect to /worlds
    }).catch((err) => {
      console.log(err);
    });
  }

  // TODO: On Worlds list
  // * Number of users
  // * Number of games
  // * Number of played games
  return (
    <div className={clsx('Worlds', props.className, classes.root)}>
      <Switch>
        <Route exact path={'/worlds'} render={(props) => (
          <div className={clsx(classes.worlds)}>
            <Card className={clsx(classes.world)}>
              <Button color="primary" onClick={() => props.history.push('/worlds/new')}>{translate('worlds.newWorld')}</Button>
            </Card>
            {worlds.map((world) => (
              <Card key={world.id} className={clsx(classes.world)}>
                <img src={world.avatar} alt={`${world.name} avatar`} />
                <Typography>{world.name}</Typography>
              </Card>
            ))}
          </div>
        )} />
        <Route exact path={'/worlds/new'} render={(props) => (
          <div className={clsx(classes.forms)}>
            {init && <Form
              className={clsx(classes.form)}
              title={translate('worlds.newWorld')}
              fields={worldForm}
              onSubmit={clickCreateWorld}
              submitText={translate('forms.create')}
            />}
          </div>
        )} />
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
