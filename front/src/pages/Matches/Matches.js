import React, { Fragment, useState, useEffect } from 'react';
import './Matches.scss';
import styles from './Matches.styles';

import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import { LocaleContext, LoginContext } from '@/context';
import { getMatches } from '@/api/matches';
import { getCharacters } from '@/api/characters';
import { getUsers } from '@/api/users';
import { Match } from '@/components';

const useStyles = makeStyles(styles);

function Matches (props) {
  const {
    user
  } = props;

  const classes = useStyles();
  const [ matches, setMatches ] = useState([]);
  const [ availableCharacters, setAvailableCharacters ] = useState([]);
  const [ availableUsers, setAvailableUsers ] = useState([]);

  useEffect(() => {
    getMatches(user.world, {
      sort: '-date'
    }).then(
      (data) => { setMatches(data) },
      (error) => {
        setMatches([]);
        console.error(error);
      }
    );

    // TODO: Create Game logic
    getCharacters().then(
      (data) => setAvailableCharacters(data),
      console.error
    );

    getUsers(user.world).then(
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
        {(locale) => <Matches {...props} translate={locale.translate} user={login.user} ref={ref} />}
      </LocaleContext.Consumer>
    }
  </LoginContext.Consumer>
));
