import React, { Fragment, useState, useEffect } from 'react';
import './History.scss';
import styles from './styles.js';

import clsx from 'clsx';
import Moment from 'react-moment';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

import { getMatches } from '@/api/matches';

const useStyles = makeStyles(styles);

function History (props) {
  const classes = useStyles();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getMatches().then(
      (data) => setHistory(data),
      (error) => console.error(error)
    );
  }, []);

  return (
    <div className={clsx('History', props.className)}>
      History Page

      <List className={classes.list}>
        {history.map((match, index) => (
          <Fragment key={match.id}>
            <div className={clsx(classes.listFragment)} >
              <ListItem className={classes.listItem} alignItems="flex-start">
                <div className={clsx(classes.leftSide)}>
                  <Avatar className={classes.avatar} src={match.player1.user.avatar}></Avatar>
                  <span>
                    <div>{match.player1.user.username}</div>
                    <div>{match.player1.user.name}</div>
                  </span>
                </div>
                <div className={clsx(classes.center)}>
                  <Moment parse="DD-MM-YYYY HH:mm">{match.date}</Moment>
                  <div className={classes.versus}>VS</div>
                </div>
                <div className={clsx(classes.rightSide)}>
                  <span>
                    <div>{match.player2.user.username}</div>
                    <div>{match.player2.user.name}</div>
                  </span>
                  <Avatar className={classes.avatar} src={match.player2.user.avatar}></Avatar>
                </div>
              </ListItem>
            </div>
            {index < history.length - 1 && <Divider component="li" />}
          </Fragment>
        ))}
      </List>
    </div>
  );
}

export default History;
