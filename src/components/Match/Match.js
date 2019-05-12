import React, { Fragment, useState } from 'react';
import './Match.scss';
import styles from './styles.js';
import avatars from '@/assets/img/characters/avatars';
// import versus from '@/assets/img/vs.png'

import clsx from 'clsx';
import Moment from 'react-moment';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import { LocaleContext } from '@/context';
import {
  Avatar,
  CharacterAvatar
} from '@/components';

const useStyles = makeStyles(styles);

function PlayerInfo (props) {
  const {
    classes,
    className,
    player,
    win,
    ...other
  } = props;

  return (
    <div className={clsx(className, classes.spaceBetween)} {...other}>
      <div className={clsx(classes.flex)}>
        <Avatar className={classes.avatar} src={player.avatar} name={player.name} />
        <span className={classes.userInfo}>
          <Typography variant="body1">{player.username}</Typography>
          <Typography className={classes.secondaryColor} variant="body2">{player.name}</Typography>
        </span>
      </div>
      {win && <div className={clsx(classes.centerVertical)}>
        <Typography className={clsx(classes.win)} variant="h5">WIN</Typography>
      </div>}
    </div>
  );
}

function Match (props) {
  const {
    className,
    component,
    player1,
    player2,
    date,
    result,
    translate,
    newMatch,
    ...other
  } = props;

  const [state, setState] = useState({
    player1,
    player2,
    date,
    result,
    isNew: newMatch
  });
  const [isNew, setNew] = useState(newMatch);
  const [isCreating, setCreating] = useState(false);

  const Wrapper = component || 'div';

  const classes = useStyles();

  function handleNew () {
    const playerModel = {
      user: {
        avatar: null,
        name: null,
        username: null
      },
      team: []
    };

    setState({
      player1: playerModel,
      player2: playerModel,
      date: new Date(),
      result: null
    });
    setNew(false);
    setCreating(true);
  }

  return (
    <Wrapper className={clsx(className)} {...other}>
      {isNew && <Button className={classes.newMatch} variant="contained" color="primary" onClick={handleNew}>{props.translate('matches.newMatch')}</Button>}
      {!isNew && (
        <Fragment>
          <div className={clsx(classes.upperSide)}>
            <PlayerInfo className={clsx(classes.leftSide)} player={state.player1.user} classes={classes} win={state.result === 1} />
            <div className={clsx(classes.center)}>
              <Typography className={classes.secondaryColor} variant="body2">
                <Moment parse="ddd MMM DD YYYY HH:mm:ss zzZZ (zzZ)" format="DD/MM/YY HH:mm">{state.date}</Moment>
              </Typography>
              {/* <img alt="versus" className={classes.versus} src={versus} /> */}
              <div className={classes.versus}>VS</div>
            </div>
            <PlayerInfo className={clsx(classes.rightSide)} dir="rtl" player={state.player2.user} classes={classes} win={state.result === 2} />
          </div>
          <Divider className={clsx(classes.divider)} variant="fullWidth" component="div" />
          <div className={clsx(classes.downSide)}>
            <div className={clsx(classes.leftSide)}>
              {state.player1.team.map((character) =>
                <CharacterAvatar key={character.id} username={state.player1.user.username} character={character} />
              )}
              {isCreating && state.player1.team.length < 8 && <div></div>}
            </div>
            <div className={clsx(classes.rightSide)}>
              {state.player2.team.map((character) =>
                <CharacterAvatar key={character.id} username={state.player2.user.username} character={character} />
              )}
            </div>
          </div>
        </Fragment>
      )}
    </Wrapper>
  );
}

export default React.forwardRef((props, ref) => (
  <LocaleContext.Consumer>
    {(locale) => <Match {...props} translate={locale.translate} ref={ref} />}
  </LocaleContext.Consumer>
));
