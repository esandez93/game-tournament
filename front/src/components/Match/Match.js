import React, { Fragment, useState, useEffect } from 'react';
import styles from './Match.styles';
import xsStyles from './Match.xsStyles';

import PropTypes from 'prop-types';
import clsx from 'clsx';
import Moment from 'react-moment';

import {
  Button,
  Divider,
  IconButton,
  Slide,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

import PlayerInfo from './PlayerInfo';
import DownPlayerSide from './DownPlayerSide';
import { Snackbar } from '@/components';
import { createMatch } from '@/api/matches';
import { LoginContext, LocaleContext } from '@/context';
import { useWindowSize } from '@/hooks';
import { breakpoints } from '@/constants';


const useStyles = makeStyles(styles);
const useXsStyles = makeStyles(xsStyles);

// TODO: On new Match creation, prevent errors doing some checks:
//        - There are 2 or more players available
//        - There are 1 or more characters available
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
    user,
    users,
    game,
    world,
    group,
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
  const [ snackbar, setSnackbar ] = useState({
    open: false,
    message: null
  });
  const [ isNew, setNew ] = useState(newMatch);
  const [ isCreating, setCreating ] = useState(false);
  const [ availableCharacters, setAvailableCharacters ] = useState(characters);
  const [ selectedUsers, setSelectedUsers ] = useState([]);;

  useEffect(() => {
    setAvailableCharacters(characters);
  }, [ characters]);

  const Wrapper = component || 'div';

  const size = useWindowSize();
  const classes = useStyles();
  const xsClasses = useXsStyles();

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

  // TODO: Show alert to dismiss changes
  function clickCancel () {
    setNew(true);
    setCreating(false);
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

  function deleteCharacter (index, player) {
    const teamCopy = [ ...state['player'+player].team ];
    const newTeam = [ ...teamCopy.slice(0, index), ...teamCopy.slice(index+1, teamCopy.length) ];

    const prevState = { ...state };

    setState({
      ...prevState,
      ['player'+player]: {
        ...prevState['player'+player],
        team: [ ...newTeam ]
      }
    });
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

  function getError () {
    let message = '';
    const result = getResult();

    if (!state.player1.user.id) {
      message = translate('Player 1 has not been selected');
    } else if (!state.player2.user.id) {
      message = translate('Player 2 has not been selected');
    } else if (state.player1.team.length === 0) {
      message = translate('Player 1 has not any characters');
    } else if (state.player2.team.length === 0) {
      message = translate('Player 2 has not any characters');
    } else if (result === -1) {
      message = translate('Both Players have characters alive');
    }

    return message;
  }

  function getResult () {
    if (!state.player1 || !state.player2)
      return null;

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
    const error = getError();
    if (error !== '') {
      setSnackbar({
        open: true,
        message: error
      });
      setTimeout(() => {
        setSnackbar({
          open: false,
          message: null
        });
      }, 2000);
      return;
    }

    const finalResult = getResult();

    createMatch({
      player1: {
        user: state.player1.user.id,
        team: state.player1.team
      },
      player2: {
        user: state.player2.user.id,
        team: state.player2.team
      },
      world: world,
      game: game,
      group: group,
      result: finalResult
    }).then((result) => {
      // show alert
      matchCreated(result);
      reset();
    }).catch(console.error);
  }

  function isBigScreen() {
    return size.width > breakpoints.m;
  }
  function isMediumScreen() {
    return size.width > breakpoints.s && size.width <= breakpoints.m;
  }
  function isSmallScreen() {
    return size.width <= breakpoints.s;
  }

  return (<Fragment>
    {isCreating && (
      <div className={clsx(classes.newHeader)}>
        <Typography className={clsx(classes.newHeaderText)}>{translate('New Match')}</Typography>
        <IconButton className={clsx(classes.newHeaderIcon)} aria-label={translate('Cancel match creation')} onClick={clickCancel} >
          <CloseIcon />
        </IconButton>
      </div>
    )}
    <Wrapper className={clsx(className)} {...other}>
      {isNew && <Button className={classes.newMatch} variant="contained" color="primary" onClick={handleNew}>{props.translate('New Match')}</Button>}
      {!isNew && isBigScreen() && (
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
              deleteCharacter={(index) => deleteCharacter(index, 1)}
              clickCharacter={(character) => clickCharacter(character, 1)}
            />

            <DownPlayerSide
              className={clsx(classes.rightSide)}
              classes={classes}
              player={state.player2.user}
              team={state.player2.team}
              availableCharacters={availableCharacters}
              isCreating={isCreating}
              deleteCharacter={(index) => deleteCharacter(index, 2)}
              clickCharacter={(character) => clickCharacter(character, 2)}
            />
          </div>
        </Fragment>
      )}
      {!isNew && (isMediumScreen() || isSmallScreen()) && (
        <Fragment>
          <div className={clsx({ [xsClasses.inlinePlayer]: isMediumScreen() })}>
            <PlayerInfo
              className={clsx()}
              clickUser={(user) => clickUser(user, 1)}
              availableUsers={users}
              selectedUsers={selectedUsers}
              player={state.player1.user}
              classes={classes}
              isCreating={isCreating}
              win={state.result === 1}
            />
            {isMediumScreen() && (
              <DownPlayerSide
                className={clsx(xsClasses.team, xsClasses.alignRight)}
                classes={classes}
                player={state.player1.user}
                team={state.player1.team}
                availableCharacters={availableCharacters}
                isCreating={isCreating}
                deleteCharacter={(index) => deleteCharacter(index, 1)}
                clickCharacter={(character) => clickCharacter(character, 1)}
              />
            )}
            {isSmallScreen() && (<Fragment>
              <Divider className={clsx(xsClasses.divider)} variant="fullWidth" component="div" />
              <DownPlayerSide
                className={clsx(xsClasses.team, xsClasses.downTeam)}
                classes={classes}
                style={{ justifyContent: 'flex-start' }}
                player={state.player1.user}
                team={state.player1.team}
                availableCharacters={availableCharacters}
                isCreating={isCreating}
                deleteCharacter={(index) => deleteCharacter(index, 1)}
                clickCharacter={(character) => clickCharacter(character, 1)}
              />
            </Fragment>)}
          </div>
          <div className={clsx(xsClasses.center)}>
            {/* state.date &&
            <Typography className={classes.secondaryColor} variant="body2">
              <Moment parse="YYYY-MM-DDTHH:mm:ss.SSSZ" format="DD/MM/YY HH:mm">{state.date}</Moment>
            </Typography> */}
            {/* <img alt="versus" className={classes.versus} src={versus} /> */}
            <div className={clsx(classes.versus, xsClasses.versus)}>VS</div>
            <Divider className={clsx(classes.divider)} variant="fullWidth" component="div" />
          </div>
          <div className={clsx({ [xsClasses.inlinePlayer]: isMediumScreen() })} dir="rtl">
            <PlayerInfo
              className={clsx()}
              clickUser={(user) => clickUser(user, 2)}
              availableUsers={users}
              selectedUsers={selectedUsers}
              player={state.player2.user}
              classes={classes}
              rightSide
              isCreating={isCreating}
              win={state.result === 2}
            />
            {isMediumScreen() && (
              <DownPlayerSide
                className={clsx(xsClasses.team)}
                classes={classes}
                player={state.player2.user}
                team={state.player2.team}
                availableCharacters={availableCharacters}
                isCreating={isCreating}
                deleteCharacter={(index) => deleteCharacter(index, 2)}
                clickCharacter={(character) => clickCharacter(character, 2)}
              />
            )}
            {isSmallScreen() && (<Fragment>
              <Divider className={clsx(xsClasses.divider)} variant="fullWidth" component="div" />
              <DownPlayerSide
                className={clsx(xsClasses.team, xsClasses.downTeam)}
                classes={classes}
                style={{ justifyContent: 'flex-start' }}
                player={state.player2.user}
                team={state.player2.team}
                availableCharacters={availableCharacters}
                isCreating={isCreating}
                deleteCharacter={(index) => deleteCharacter(index, 2)}
                clickCharacter={(character) => clickCharacter(character, 2)}
              />
            </Fragment>)}
          </div>
        </Fragment>
      )}
      {/* isCreating &&
        <Tooltip classes={{
          tooltip: classes.tooltip,
          popper: classes.popper
        }} title={getError()} leaveDelay={200} disableTouchListener>
          <span>
            <Button
              size="small"
              variant="outlined"
              className={clsx(classes.createButton)}
              disabled={hasError()}
              onClick={clickCreateMatch}
            >{translate('Create')}</Button>
          </span>
        </Tooltip>
      */}
      {isCreating && <Fragment>
        <Button
          size="small"
          variant="outlined"
          className={clsx(classes.createButton)}
          onClick={clickCreateMatch}
        >{translate('Create')}</Button>
        <Snackbar
          variant="error"
          direction="up"
          message={snackbar.message}
          open={snackbar.open}
          TransitionComponent={Slide}
          anchorOrigin={{
            vertical: 'top',
            horizontal: isBigScreen() ? 'right' : 'center'
          }}
        ></Snackbar>
      </Fragment>}
    </Wrapper>
  </Fragment>);
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
  <LoginContext.Consumer>
    {(login) =>
      <LocaleContext.Consumer>
        {(locale) => <Match {...props} user={login.user} world={login.world} game={login.game} group={login.group} translate={locale.translate} ref={ref} />}
      </LocaleContext.Consumer>
    }
  </LoginContext.Consumer>
));
