import React, { Fragment, useState, useEffect } from 'react';
import './Matches.scss';
import styles from './Matches.styles';

import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import { LocaleContext, LoginContext } from '@/context';
import { getMatches } from '@/api/worlds';
import { getCharacters } from '@/api/games';
import { getUsers } from '@/api/users';
import { Match } from '@/components';

const useStyles = makeStyles(styles);

function Matches (props) {
  const {
    world,
    game,
    group
  } = props;

  const classes = useStyles();
  const [ matches, setMatches ] = useState([]);
  const [ availableCharacters, setAvailableCharacters ] = useState([]);
  const [ availableUsers, setAvailableUsers ] = useState([]);

  useEffect(() => {
    getMatches(world, game, {
      sort: '-date'
    }).then(
      (data) => setMatches(data),
      (error) => {
        setMatches([]);
        console.error(error);
      }
    );

    getCharacters(game).then(
      (data) => setAvailableCharacters(data),
      console.error
    );

    getUsers(world, { group: group }).then(
      (data) => setAvailableUsers(data),
      console.error
    );
  }, []);

  function matchCreated (match) {
    setMatches([ match, ...matches]);
  }

  return (
    <div className={clsx('Matches', props.className)}>
      <List className={classes.list}>
        <Match
          className={classes.listItem}
          characters={availableCharacters}
          users={availableUsers}
          newMatch
          matchCreated={matchCreated}
          component={ListItem}
        />
        {matches.map((match) => (
          <Fragment key={match.id}>
            <div className={clsx(classes.customDivider)}></div>
            <Match
              className={classes.listItem}
              player1={match.player1}
              player2={match.player2}
              date={match.date}
              result={match.result}
              component={ListItem}
            />
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
        {(locale) => <Matches {...props} translate={locale.translate} world={login.world} game={login.game} group={login.group} ref={ref} />}
      </LocaleContext.Consumer>
    }
  </LoginContext.Consumer>
));
