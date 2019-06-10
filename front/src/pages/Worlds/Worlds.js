import React, { Fragment, useState, useEffect } from 'react';
import styles from './Worlds.styles';

import clsx from 'clsx';

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
  getWorlds
} from '@/api/worlds';
import {
  getUserRelationships
} from '@/api/users';

const useStyles = makeStyles(styles);

let usersItems = [];

function Worlds (props) {
  const {
    user,
    translate
  } = props;

  const classes = useStyles();
  const [ worlds, setWorlds ] = useState([]);
  const [ createWorld, setCreateWorld ] = useState(false);
  const [ newWorld, setNewWorld ] = useState({
    avatar: '',
    name: ''
  });
  const [ newWorldUsers, setNewWorldUsers ] = useState([]);
  const [ newWorldAdmins, setNewWorldAdmins ] = useState([]);

  const handleWorldChange = name => event => {
    setNewWorld({ ...newWorld, [name]: event.target.value });
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
    label: translate('worlds.users'),
    items: usersItems,
    value: newWorldUsers,
    renderValue: (selected) => selected.join(', '),
    onChange: event => {
      setNewWorldUsers(event.target.value);
    }
  }];

  useEffect(() => {
    getWorlds({
      users: user
    }).then((wrlds) => {
      setWorlds(wrlds);
    }).catch((err) => {

    });

    getUserRelationships(user)
      .then((rels) => {
        console.log(rels);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function clickCreateWorld (...args) {
    console.log(args);
  }

  // TODO:
  // * Number of users
  // * Number of games
  // * Number of played games
  return (
    <div className={clsx('Worlds', props.className, classes.root)}>
      {!createWorld && <div className={clsx(classes.worlds)}>
        <Card className={clsx(classes.world)}>
          <Button color="primary" onClick={() => setCreateWorld(true)}>{translate('worlds.newWorld')}</Button>
        </Card>
        {worlds.map((world) => (
          <Card key={world.id} className={clsx(classes.world)}>
            <img src={world.avatar} alt={`${world.name} avatar`} />
            <Typography>{world.name}</Typography>
          </Card>
        ))}
      </div>}
      {createWorld && <Fragment>
        <Form
          title={translate('worlds.newWorld')}
          fields={worldForm}
          onSubmit={clickCreateWorld}
          submitText={translate('forms.create')}
        />
      </Fragment>}
    </div>
  );
}

export default React.forwardRef((props, ref) => (
  <LoginContext.Consumer>
    {(login) =>
      <LocaleContext.Consumer>
        {(locale) => <Worlds {...props} translate={locale.translate} user={login.user.id} currentWorld={login.world} ref={ref} />}
      </LocaleContext.Consumer>
    }
  </LoginContext.Consumer>
));
