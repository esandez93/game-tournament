import React, { useState, useEffect } from 'react';
import './Users.scss';
import styles from './styles.js';

import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Fab,
  IconButton
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddIcon from '@material-ui/icons/Add';

import {
  Avatar,
  Card
} from '@/components';
import { getUsers } from '@/api/users';


const useStyles = makeStyles(styles);

function Users (props) {
  const classes = useStyles();
  const [ users, setUsers ] = useState([]);

  useEffect(() => {
    getUsers().then(
      (data) => setUsers(data),
      (error) => console.error(error)
    );
  }, []);

  function clickAddUser () {

  }

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

      <Fab className={clsx(classes.fab)} color="primary" aria-label="Add" onClick={clickAddUser}>
        <AddIcon />
      </Fab>
    </div>
  );
}

export default Users;
