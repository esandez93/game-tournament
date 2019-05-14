import React, { Fragment, useState, useEffect } from 'react';
import './Matches.scss';
import styles from './styles.js';

import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import { LocaleContext } from '@/context';
import { getMatches } from '@/api/matches';
import { getCharacters } from '@/api/characters';
import { getUsers } from '@/api/users';
import { Match } from '@/components';

const useStyles = makeStyles(styles);

function Matches (props) {
  const classes = useStyles();
  const [ matches, setMatches ] = useState([]);
  const [ availableCharacters, setAvailableCharacters ] = useState([]);
  const [ availableUsers, setAvailableUsers ] = useState([]);

  useEffect(() => {
    getMatches({
      _sort: 'date',
      _order: 'desc'
    }).then(
      (data) => setMatches(data),
      console.error
    );

    getCharacters().then(
      (data) => setAvailableCharacters(data),
      console.error
    );

    getUsers().then(
      (data) => setAvailableUsers(data),
      console.error
    );
  }, []);

  return (
    <div className={clsx('Matches', props.className)}>
      <List className={classes.list}>
        <Match className={classes.listItem} characters={availableCharacters} users={availableUsers} newMatch component={ListItem} />
        {matches.map((match, index) => (
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
  <LocaleContext.Consumer>
    {(locale) => <Matches {...props} translate={locale.translate} ref={ref} />}
  </LocaleContext.Consumer>
));
