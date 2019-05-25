import React, { Fragment, useState, useEffect } from 'react';
import './Match.scss';
import styles from './styles';
import xsStyles from './xsStyles';

import PropTypes from 'prop-types';
import clsx from 'clsx';
import Moment from 'react-moment';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';

import PlayerInfo from './PlayerInfo';
import DownPlayerSide from './DownPlayerSide';
import { Snackbar } from '@/components';
import { createMatch } from '@/api/matches';
import { LocaleContext } from '@/context';
import { useWindowSize } from '@/hooks';
import { breakpoints } from '@/constants';

const useStyles = makeStyles(styles);
const useXsStyles = makeStyles(xsStyles);

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

  /* function hasError() {
    return getError() !== '';
  } */

  function getError () {
    let message = '';
    const result = getResult();

    if (!state.player1.user.id) {
      message = translate('match.errors.player1');
    } else if (!state.player2.user.id) {
      message = translate('match.errors.player2');
    } else if (state.player1.team.length === 0) {
      message = translate('match.errors.player1Team');
    } else if (state.player2.team.length === 0) {
      message = translate('match.errors.player1Team');
    } else if (result === -1) {
      message = translate('match.errors.noResult');
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
      // date: state.date,
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

  return (
    <Wrapper className={clsx(className)} {...other}>
      {isNew && <Button className={classes.newMatch} variant="contained" color="primary" onClick={handleNew}>{props.translate('matches.newMatch')}</Button>}
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
            >{translate('create')}</Button>
          </span>
        </Tooltip>
      */}
      {isCreating && <Fragment>
        <Button
          size="small"
          variant="outlined"
          className={clsx(classes.createButton)}
          onClick={clickCreateMatch}
        >{translate('create')}</Button>
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
