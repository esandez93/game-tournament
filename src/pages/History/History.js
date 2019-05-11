import React, { Fragment, useState, useEffect } from 'react';
import './History.scss';
import styles from './styles.js';
import avatars from '@/assets/img/characters/avatars';

import clsx from 'clsx';
import Moment from 'react-moment';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';

import { Avatar } from '@/components';
import { getMatches } from '@/api/matches';

const useStyles = makeStyles(styles);

function CharacterAvatar (props) {
  const classes = makeStyles((theme) => ({
    root: {
      position: 'relative'
    },
    shadow: {
      position: 'absolute',
      width: theme.spacing(4),
      height: theme.spacing(4),
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backgroundImage: `
        linear-gradient(
          to top left,
          transparent 0%,
          transparent calc(50% - 4px),
          ${theme.palette.error.main} 50%,
          transparent calc(50% + 4px),
          transparent 100%
        )`
    },
    characterAvatar: {
      width: theme.spacing(4),
      height: theme.spacing(4),
    }
  }))();

  const {
    character,
    username
  } = props;

  return (
    <div className={clsx(classes.root)}>
      <div className={clsx({
        [classes.shadow]: character.alive
      })}></div>
      <img
        className={clsx(classes.characterAvatar)}
        src={avatars[character.name.toLowerCase()]}
        alt={`${username} - ${character.name}`}
      />
    </div>
  )
}

function History (props) {
  const classes = useStyles();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getMatches({
      _sort: 'date',
      _order: 'desc'
    }).then(
      (data) => setHistory(data),
      (error) => console.error(error)
    );
  }, []);

  return (
    <div className={clsx('History', props.className)}>
      <List className={classes.list}>
        {history.map((match, index) => (
          <Fragment key={match.id}>
            <div className={clsx(classes.listFragment)} >
              <ListItem className={classes.listItem} alignItems="flex-start">
                <div className={clsx(classes.upperSide)}>
                  <div className={clsx(classes.leftSide)}>
                    <Avatar className={classes.avatar} src={match.player1.user.avatar} name={match.player1.user.name} />
                    <span>
                      <div>{match.player1.user.username}</div>
                      <div>{match.player1.user.name}</div>
                    </span>
                  </div>
                  <div className={clsx(classes.center)}>
                    <Moment parse="ddd MMM DD YYYY HH:mm:ss zzZZ (zzZ)" format="DD/MM/YY HH:mm">{match.date}</Moment>
                    <div className={classes.versus}>VS</div>
                  </div>
                  <div className={clsx(classes.rightSide)}>
                    <span>
                      <div>{match.player2.user.username}</div>
                      <div>{match.player2.user.name}</div>
                    </span>
                    <Avatar className={classes.avatar} src={match.player2.user.avatar} name={match.player2.user.name} />
                  </div>
                </div>
                <Divider className={clsx(classes.divider)} variant="fullWidth" component="div" />
                <div className={clsx(classes.downSide)}>
                  <div className={clsx(classes.leftSide)}>
                    {match.player1.team.map((character) =>
                      <CharacterAvatar key={character.id} username={match.player1.user.username} character={character} />
                    )}
                  </div>
                  <div className={clsx(classes.rightSide)}>
                    {match.player2.team.map((character) =>
                      <CharacterAvatar key={character.id} username={match.player2.user.username} character={character} />
                    )}
                  </div>
                </div>
              </ListItem>
            </div>
            {index < history.length - 1 && <div className={clsx(classes.customDivider)}></div>}
          </Fragment>
        ))}
      </List>
    </div>
  );
}

export default History;
