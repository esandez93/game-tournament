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
    history
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
  }, []);

  function clickCreateWorld () {
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
    });
  }

  // TODO: On Worlds list
  // * Number of users
  // * Number of games
  // * Number of played games
  return (
    <div className={clsx('Worlds', className, classes.root)}>
      <Switch>
        <Route exact path={'/worlds'} render={(props) => (
          <Fragment>
            <Card className={clsx(classes.card, classes.newWorldCard)}>
              <Button color="primary" onClick={() => history.push('/worlds/new')}>{translate('worlds.newWorld')}</Button>
            </Card>

            <div className={clsx(classes.worlds)}>
              {worlds.map((world) => (
                <Card key={world.id} className={clsx(classes.card, classes.worldCard)}>
                  <Avatar src={world.avatar} name={world.name} />
                  <Typography>{world.name}</Typography>
                  <Button color="primary" onClick={() => history.push(`/worlds/${world.id}`)}>{translate('details')}</Button>
                </Card>
              ))}
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
