import React, { Fragment, useState, useEffect } from 'react';
import styles from './Ranking.styles';

import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Typography
} from '@material-ui/core';

import { getRanking } from '@/api/worlds';
import {
  LocaleContext,
  LoginContext
} from '@/context';

const useStyles = makeStyles(styles);

function Trophy (props) {
  return (
    <div className={clsx(props.className)}>
      { props.position >= 1 && props.position <= 3 ? props.position : null }
    </div>
  )
}

function Ranking (props) {
  const {
    world,
    game
  } = props;

  const classes = useStyles();
  const [ ranking, setRanking ] = useState([]);

  useEffect(() => {
    getRanking(world, game)
      .then(setRanking)
      .catch(error => {
        setRanking([]);
        console.error(error);
      });
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
                    <Typography>
                      {user.name} - {user.group}
                    </Typography>
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

export default React.forwardRef((props, ref) => (
  <LoginContext.Consumer>
    {(login) =>
      <LocaleContext.Consumer>
        {(locale) => <Ranking {...props} translate={locale.translate} world={login.world} game={login.game} ref={ref} />}
      </LocaleContext.Consumer>
    }
  </LoginContext.Consumer>
));
