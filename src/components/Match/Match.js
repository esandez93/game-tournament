import React, { Fragment, useState, useEffect } from 'react';
import './Match.scss';
import styles from './styles.js';
// import versus from '@/assets/img/vs.png'

import PropTypes from 'prop-types';
import clsx from 'clsx';
import Moment from 'react-moment';

import { useTheme } from '@material-ui/styles';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';

import { LocaleContext } from '@/context';
import {
  Avatar,
  CharacterAvatar,
  ContextMenu
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

function DownPlayerSide (props) {
  const {
    className,
    classes,
    player,
    team,
    availableCharacters,
    isCreating,
    clickCharacter,
    ...other
  } = props;

  const [ characterMenu, setCharacterMenu ] = useState({
    open: false,
    x: -100,
    y: -100
  });

  const theme = useTheme();
  const characterAvatarSize = theme.spacing(4);

  function selectCharacterMenu (event, player) {
    if (!isCreating) return;

    event.preventDefault();

    setCharacterMenu({
      open: true,
      x: event.clientX,
      y: event.clientY
    });
  }

  function closeCharacterMenu() {
    setCharacterMenu({
      open: false,
      x: -100,
      y: -100
    })
  }

  return (
    <div className={clsx(className)} {...other}>
      {team.map((character) =>
        <CharacterAvatar
          className={clsx(classes.characterAvatar)}
          height={characterAvatarSize}
          width={characterAvatarSize}
          key={character.id}
          username={player.username}
          character={character}
          onClick={() => isCreating ? clickCharacter(character) : null}
        />
      )}
      {isCreating && team.length < 8 && (<Fragment>
        <IconButton
          className={classes.newCharacterButton}
          onContextMenu={(e) => selectCharacterMenu(e, 1)}
          onClick={(e) => selectCharacterMenu(e, 1)}
        >
          <AddIcon className={classes.newCharacterIcon} />
        </IconButton>
        <ContextMenu
          className={classes.contextMenu}
          open={characterMenu.open}
          x={characterMenu.x}
          y={characterMenu.y}
          closeMenu={closeCharacterMenu}
        >
          {availableCharacters.map((character, index) => {
            return (<Fragment key={character.id}>
              <CharacterAvatar
                className={clsx(classes.characterAvatar, classes.selectableCharacterAvatar)}
                onClick={() => clickCharacter(character)}
                height={characterAvatarSize * 1.5}
                width={characterAvatarSize * 1.5}
                username={player.username}
                character={character}
                shadow={classes.selectableCharacterAvatarShadow}
              />
              {(index+1) % 5 === 0 ? <br /> : null}
            </Fragment>)
          })}
        </ContextMenu>
      </Fragment>)}
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
    characters,
    ...other
  } = props;

  const [ state, setState ] = useState({
    player1,
    player2,
    date,
    result,
    isNew: newMatch
  });
  const [ isNew, setNew ] = useState(newMatch);
  const [ isCreating, setCreating ] = useState(false);
  const [ availableCharacters, setAvailableCharacters ] = useState(characters);

  useEffect(() => {
    setAvailableCharacters(characters);
  }, [ characters]);

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
      player1: { ...playerModel },
      player2: { ...playerModel },
      date: new Date(),
      result: null
    });
    setNew(false);
    setCreating(true);
  }

  function selectUserMenu (event, player) {
    if (!isCreating) return;

    event.preventDefault();


  }

  function clickCharacter (character, player) {
    let found = false;
    const teamCopy = [ ...state['player'+player].team ];

    console.log(player, character)

    teamCopy.forEach((char) => {
      if (char.id === character.id) {
        found = true;

        if (char.alive === undefined)
          char.alive = false;
        else
          char.alive = !char.alive;
      }
    });

    let prevState = { ...state };

    if (!found) {
      setState({
        ...prevState,
        ['player'+player]: {
          ...prevState['player'+player],
          team: [ ...prevState['player'+player].team, { ...character } ]
        }
      });
    } else {
      setState({
        ...prevState,
        ['player'+player]: {
          ...prevState['player'+player],
          team: [ ...teamCopy ]
        }
      });
    }
  }

  return (
    <Wrapper className={clsx(className)} {...other}>
      {isNew && <Button className={classes.newMatch} variant="contained" color="primary" onClick={handleNew}>{props.translate('matches.newMatch')}</Button>}
      {!isNew && (
        <Fragment>
          <div className={clsx(classes.upperSide)}>
            <PlayerInfo
              className={clsx(classes.leftSide)}
              onContextMenu={(e) => selectUserMenu(e, 1)}
              onClick={(e) => selectUserMenu(e, 1)}
              player={state.player1.user}
              classes={classes}
              win={state.result === 1}
            />
            <div className={clsx(classes.center)}>
              <Typography className={classes.secondaryColor} variant="body2">
                <Moment parse="ddd MMM DD YYYY HH:mm:ss zzZZ (zzZ)" format="DD/MM/YY HH:mm">{state.date}</Moment>
              </Typography>
              {/* <img alt="versus" className={classes.versus} src={versus} /> */}
              <div className={classes.versus}>VS</div>
            </div>
            <PlayerInfo
              className={clsx(classes.leftSide)}
              onContextMenu={(e) => selectUserMenu(e, 2)}
              onClick={(e) => selectUserMenu(e, 2)}
              player={state.player2.user}
              classes={classes}
              dir="rtl"
              win={state.result === 2}
            />
          </div>
          <Divider className={clsx(classes.divider)} variant="fullWidth" component="div" />
          <div className={clsx(classes.downSide)}>
            <DownPlayerSide
              className={clsx(classes.leftSide)}
              classes={classes}
              player={state.player1.user}
              team={state.player1.team}
              availableCharacters={availableCharacters}
              isCreating={isCreating}
              clickCharacter={(character) => clickCharacter(character, 1)}
            />
            <DownPlayerSide
              className={clsx(classes.rightSide)}
              classes={classes}
              player={state.player2.user}
              team={state.player2.team}
              availableCharacters={availableCharacters}
              isCreating={isCreating}
              clickCharacter={(character) => clickCharacter(character, 2)}
            />
          </div>
        </Fragment>
      )}
    </Wrapper>
  );
}

Match.propTypes = {
  characters: PropTypes.array
};

Match.defaultProps = {
  characters: []
};

export default React.forwardRef((props, ref) => (
  <LocaleContext.Consumer>
    {(locale) => <Match {...props} translate={locale.translate} ref={ref} />}
  </LocaleContext.Consumer>
));
