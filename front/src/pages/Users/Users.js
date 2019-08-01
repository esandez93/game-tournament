import React, { useState, useEffect } from 'react';
import './Users.scss';
import styles from './Users.styles';

import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import PersonIcon from '@material-ui/icons/Person';

import {
  Avatar,
  Card
} from '@/components';
import { getUsers } from '@/api/worlds';
import {
  LoginContext,
  LocaleContext
} from '@/context';

const useStyles = makeStyles(styles);

function Users (props) {
  const {
    world
  } = props;

  const classes = useStyles();
  const [ users, setUsers ] = useState([]);

  useEffect(() => {
    getUsers(world)
      .then(setUsers)
      .catch((error) => {
        setUsers([]);
        console.error(error)
      });
  }, [ world ]);

  function getCardHeader(user) {
    return {
      avatar:
        <Avatar className={classes.avatar} src={user.avatar} name={user.name}>
          <PersonIcon />
        </Avatar>,
      title: user.name,
      subtitle: user.username
    };
  }

  return (
    <div className={clsx('Users', props.className)}>
      {users.map((user) => (
        <Card
          className={clsx(classes.card)}
          key={user.id}
          header={getCardHeader(user)}
        ></Card>
      ))}
    </div>
  );
}

export default React.forwardRef((props, ref) => (
  <LoginContext.Consumer>
    {(login) =>
      <LocaleContext.Consumer>
        {(locale) => <Users {...props} translate={locale.translate} world={login.world} ref={ref} />}
      </LocaleContext.Consumer>
    }
  </LoginContext.Consumer>
));
