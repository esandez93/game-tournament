import React, { Component } from 'react';
import './Ranking.scss';

import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles(theme => ({
  list: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    paddingTop: 0
  },
  listFragment: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(2)
  },
  listItem: {
    paddingLeft: theme.spacing(2)
  },
  gold: {
    border: `${theme.spacing(1) / 2}px solid #FFDF00`
  },
  silver: {
    border: `${theme.spacing(1) / 2}px solid #D3D3D3`
  },
  bronze: {
    border: `${theme.spacing(1) / 2}px solid #CD7F32`
  },
}));

const MOCK_LIST = [{
  id: 0,
  username: 'NOT VICTOR FOR SURE',
  name: 'Eric Sández',
  email: 'esandez93@gmail.com',
  company: 'Scytl',
  group: 'frontend'
}, {
  id: 1,
  username: 'esandez2',
  name: 'Eric Sández2',
  email: 'esandez93@gmail.com2',
  company: 'Scytl2',
  group: 'frontend2'
}, {
  id: 2,
  username: 'esandez3',
  name: 'Eric Sández3',
  email: 'esandez93@gmail.com3',
  company: 'Scytl3',
  group: 'frontend3'
}, {
  id: 3,
  username: 'esandez4',
  name: 'Eric Sández4',
  email: 'esandez94@gmail.com4',
  company: 'Scytl4',
  group: 'frontend4'
}, {
  id: 4,
  username: 'esandez5',
  name: 'Eric Sández5',
  email: 'esandez95@gmail.com5',
  company: 'Scytl5',
  group: 'frontend5'
}];

function Trophy (props) {
  return props.position >= 1 && props.position <= 3 ? (
    <div className={clsx(props.className)}>
      {props.position}
    </div>
  ) : null;
}

function Ranking (props) {
  const classes = useStyles();

  return (
    <div className={clsx('Ranking', props.className)}>
      Ranking Page

      <List className={classes.list}>
        {MOCK_LIST.map((user, index) => (
          <React.Fragment key={user.id}>
            <div
              className={clsx(classes.listFragment, {
                [classes.gold]: index === 0,
                [classes.silver]: index === 1,
                [classes.bronze]: index === 2
              })}
            >
              <Trophy position={index+1} />
              <ListItem className={classes.listItem} alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt={user.username} src={user.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={user.username}
                  secondary={
                    <span>
                      {user.name} - {user.group}
                    </span>
                  }
                />
              </ListItem>
            </div>
            {index > 1 && index < MOCK_LIST.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>

    </div>
  );
}

export default Ranking;
