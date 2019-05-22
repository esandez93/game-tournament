import React, { Fragment, useState, useEffect } from 'react';
import './Match.scss';
import styles from './styles.js';

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

import { createMatch } from '@/api/matches';
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
    clickUser,
    isCreating,
    availableUsers,
    selectedUsers,
    rightSide,
    ...other
  } = props;

  const [ userMenu, setUserMenu ] = useState({
    open: false,
    x: -1000,
    y: -1000
  });

  function selectUserMenu (event) {
    if (!isCreating) return;

    setUserMenu({
      open: true,
      x: event.clientX,
      y: event.clientY
    });

    event.preventDefault();
  }

  function closeUserMenu() {
    setUserMenu({
      open: false,
      x: -1000,
      y: -1000
    })
  }

  const moreClasses = makeStyles(theme => ({
    rightSide: {
      textAlign: 'right'
    }
  }))();

  return (
    <div className={clsx(className, classes.spaceBetween)} dir={rightSide ? 'rtl' : 'ltr'} {...other}>
      <div className={clsx(classes.flex)}>
        <Avatar className={clsx(classes.avatar, {
          [classes.selectableUserAvatar]: isCreating
        })} onClick={(event) => selectUserMenu(event)} src={player.avatar} name={player.name} />
        <span className={clsx(classes.userInfo, { [moreClasses.rightSide]: rightSide })}>
          <Typography variant="body1">{player.username}</Typography>
          <Typography className={classes.secondaryColor} variant="body2">{player.name}</Typography>
        </span>

        <ContextMenu
          className={classes.contextMenu}
          open={userMenu.open}
          x={userMenu.x}
          y={userMenu.y}
          closeMenu={closeUserMenu}
        >
          {availableUsers.map((user, index) => {
            return (<div className={clsx(classes.selectableUser, {
              [classes.selectedUser]: selectedUsers.includes(user.id)
            })} key={index} onClick={() => selectedUsers.includes(user.id) ? null : clickUser(user)}>
              <Avatar className={classes.avatar} src={user.avatar} name={user.name} />
              <span className={classes.userInfo}>
                <Typography variant="body1">{user.username}</Typography>
                <Typography className={classes.secondaryColor} variant="body2">{user.name}</Typography>
              </span>
            </div>)
          })}
        </ContextMenu>
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
    x: -1000,
    y: -1000
  });

  const theme = useTheme();
  const characterAvatarSize = theme.spacing(4);

  function selectCharacterMenu (event) {
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
      x: -1000,
      y: -1000
    })
  }

  return (
    <div className={clsx(className)} {...other}>
      {team.map((character, index) =>
        <CharacterAvatar
          key={character.id}
          className={clsx(classes.characterAvatar, {
            // [classes.selectableCharacterAvatar]: isCreating
          })}
          height={characterAvatarSize}
          width={characterAvatarSize}
          username={player.username}
          character={character}
          shadow={clsx({
            [classes.selectableCharacterAvatarShadow]: isCreating && character.alive,
            [classes.selectableDeadCharacterAvatarShadow]: isCreating && !character.alive,
          })}
          onClick={() => isCreating ? clickCharacter(character) : null}
        />
      )}
      {isCreating && team.length < 8 && (<Fragment>
        <IconButton
          className={classes.newCharacterButton}
          onContextMenu={(e) => selectCharacterMenu(e)}
          onClick={(e) => selectCharacterMenu(e)}
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
            return (<Fragment>
              <CharacterAvatar
                key={character.id}
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
    users,
    matchCreated,
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
  const [ selectedUsers, setSelectedUsers ] = useState([]);

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
      // date: new Date(),
      result: null
    });
    setNew(false);
    setCreating(true);
  }

  function reset () {
    setNew(true);
    setCreating(false);
  }

  function clickCharacter (character, player) {
    let found = false;
    const teamCopy = [ ...state['player'+player].team ];

    teamCopy.forEach((char) => {
      if (char.id === character.id) {
        found = true;

        char.alive = !char.alive;
      }
    });

    const prevState = { ...state };

    if (!found) {
      const char = { ...character };
      if (char.alive === undefined)
        char.alive = true;

      setState({
        ...prevState,
        ['player'+player]: {
          ...prevState['player'+player],
          team: [ ...prevState['player'+player].team, char ]
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

  function clickUser (user, player) {
    const prevState = { ...state };
    const userCopy = { ...user };

    setState({
      ...prevState,
      ['player'+player]: {
        ...prevState['player'+player],
        user: userCopy
      }
    });

    let selectedCopy = [ ...selectedUsers ];
    selectedCopy[player-1] = userCopy.id;

    setSelectedUsers(selectedCopy);
  }

  function hasErrors () {
    let message = null;
    const result = getResult();
    console.log('result =', result)

    // TODO: Set error messages
    if (!state.player1.user.id) {
      message = '1';
    } else if (!state.player2.user.id) {
      message = '2';
    } else if (state.player1.team.length === 0) {
      message = '3';
    } else if (state.player2.team.length === 0) {
      message = '4';
    } else if (result === -1) {
      message = '5';
    }

    if (message) {
      // show alert
      console.error(message);
    }

    return message !== null;
  }

  function getResult () {
    const p1Alive = state.player1.team.filter((character) => character.alive).length;
    const p2Alive = state.player2.team.filter((character) => character.alive).length;

    if (p1Alive > 0 && p2Alive > 0)
      return -1;
    if (p1Alive === 0 && p2Alive === 0)
      return 0;
    else if (p1Alive > 0)
      return 1;
    else if (p2Alive > 0)
      return 2;
  }

  function clickCreateMatch () {
    if (hasErrors()) {
      return;
    }

    const finalResult = getResult();

    createMatch({
      player1: state.player1,
      player2: state.player2,
      // date: state.date,
      result: finalResult
    }).then((result) => {
      // show alert
      matchCreated(result);
      reset();
    }).catch(console.error);
  }

  return (
    <Wrapper className={clsx(className)} {...other}>
      {isNew && <Button className={classes.newMatch} variant="contained" color="primary" onClick={handleNew}>{props.translate('matches.newMatch')}</Button>}
      {!isNew && (
        <Fragment>
          <div className={clsx(classes.upperSide)}>
            <PlayerInfo
              className={clsx(classes.leftSide)}
              clickUser={(user) => clickUser(user, 1)}
              availableUsers={users}
              selectedUsers={selectedUsers}
              player={state.player1.user}
              classes={classes}
              isCreating={isCreating}
              win={state.result === 1}
            />
            <div className={clsx(classes.center)}>
              {state.date &&
              <Typography className={classes.secondaryColor} variant="body2">
                <Moment parse="YYYY-MM-DDTHH:mm:ss.SSSZ" format="DD/MM/YY HH:mm">{state.date}</Moment>
              </Typography>}
              {/* <img alt="versus" className={classes.versus} src={versus} /> */}
              <div className={classes.versus}>VS</div>
            </div>
            <PlayerInfo
              className={clsx(classes.leftSide)}
              clickUser={(user) => clickUser(user, 2)}
              availableUsers={users}
              selectedUsers={selectedUsers}
              player={state.player2.user}
              classes={classes}
              isCreating={isCreating}
              rightSide
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

            <Button size="small" variant="outlined" onClick={clickCreateMatch}>Create</Button>

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
  characters: PropTypes.array,
  users: PropTypes.array
};

Match.defaultProps = {
  characters: [],
  users: []
};

export default React.forwardRef((props, ref) => (
  <LocaleContext.Consumer>
    {(locale) => <Match {...props} translate={locale.translate} ref={ref} />}
  </LocaleContext.Consumer>
));
