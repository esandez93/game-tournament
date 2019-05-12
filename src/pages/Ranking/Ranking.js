import React, { Fragment, useState, useEffect } from 'react';
import './Ranking.scss';
import styles from './styles.js';

import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

import { getRanking } from '@/api/users';

const useStyles = makeStyles(styles);

function Trophy (props) {
  return (
    <div className={clsx(props.className)}>
      { props.position >= 1 && props.position <= 3 ? props.position : null }
    </div>
  )
}

function Ranking (props) {
  const classes = useStyles();
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    getRanking().then(
      (data) => setRanking(data),
      (error) => console.error(error)
    );
  }, []);

  return (
    <div className={clsx('Ranking', props.className)}>
      <List className={classes.list}>
        {ranking.map((user, index) => (
          <Fragment key={user.id}>
            <div
              className={clsx(classes.listFragment, {
                [classes.gold]: index === 0,
                [classes.silver]: index === 1,
                [classes.bronze]: index === 2
              })}
            >
              <Trophy className={clsx(classes.trophy)} position={index+1} />
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
            {index > 2 && index < ranking.length - 1 && <Divider component="li" />}
          </Fragment>
        ))}
      </List>

    </div>
  );
}

export default Ranking;
