import React, { useState, useEffect } from 'react';
import styles from './World.styles';

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
  getWorldById
} from '@/api/worlds';

const useStyles = makeStyles(styles);

function World (props) {
  const {
    user,
    translate,
    match,
    ...other
  } = props;

  const classes = useStyles();

  const [ world, setWorld ] = useState({});

  useEffect(() => {
    getWorldById(match.params.id)
      .then((world) => {
        setWorld(world);
      })
      .catch((error) => {
        console.error('world not found', error);
      })
  }, [ match.params.id ]);

  return (
    <div className={clsx('World')}>
      {world.id}
      {world.name}
    </div>
  );
}

export default React.forwardRef((props, ref) => (
  <LoginContext.Consumer>
    {(login) =>
      <LocaleContext.Consumer>
        {(locale) => <World {...props} translate={locale.translate} user={login.user} ref={ref} />}
      </LocaleContext.Consumer>
    }
  </LoginContext.Consumer>
));
