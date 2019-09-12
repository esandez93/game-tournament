import React, { Fragment, useState, useEffect } from 'react';
import styles from './Games.styles';

import clsx from 'clsx';
import {
  Switch,
  Route
} from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import {
  Chip,
  Typography
} from '@material-ui/core';
import {
  Person as PersonIcon,
  Face as FaceIcon,
  VideogameAsset as VGAssetIcon
} from '@material-ui/icons';

import {
  Avatar,
  Button,
  Card,
  Form,
  Loading,
  Stat,
  Switch as SwitchControl
} from '@/components';
import {
  LocaleContext,
  LoginContext
} from '@/context';
import {
  getWorldById,
  getGames as getWorldGames,
  createGame,
  enableGame,
  disableGame
} from '@/api/worlds';

const useStyles = makeStyles(styles);

function GameCard (props) {
  const {
    game,
    enabled,
    toggleEnabled,
    history,
    location,
    translate,
    isAdmin
  } = props;

  const classes = useStyles();

  return (
    <Card key={game.id} className={clsx(classes.card, classes.gameCard)} contentClass={clsx(classes.cardContent)}>
      <div className={clsx(classes.cardHeader)}>
        <Avatar className={clsx(classes.cardAvatar)} src={game.logos ? game.logos.favicon : null} name={game.name} />
        <Typography variant="h6">{game.name}</Typography>
      </div>

      <div className={clsx(classes.cardStats)}>
        <Stat
          title="GAMES PLAYED"
          label={Math.floor(Math.random() * 100)}
          Icon={VGAssetIcon}
        />

        <Stat
          title="PLAYERS"
          label={Math.floor(Math.random() * 100)}
          Icon={PersonIcon}
        />

        <Stat
          title="CHARACTERS"
          label={game.characters ? game.characters.length : 0}
          Icon={FaceIcon}
        />
      </div>

      <div className={clsx(classes.cardFooter)}>
        {isAdmin
          ? <SwitchControl checked={enabled} onChange={() => toggleEnabled(game)}></SwitchControl>
          : <div></div>
        }
        <Button color="primary" onClick={() => history.push(`${location.pathname}/${game.id}`)}>{translate('details')}</Button>
      </div>
    </Card>
  );
}

function Games (props) {
  const {
    className,
    translate,
    history,
    location,
    user,
    currentWorld,
    selectedWorld,
    changeUser
  } = props;

  const classes = useStyles();
  const [ init, setInit ] = useState(false);
  const [ newGame, setNewGame ] = useState({
    name: '',
    avatar: '',
    characters: []
  });
  const [ charactersItems, setCharactersItems ] = useState([]);
  const [ newGameCharacters, setNewGameCharacters ] = useState([]);
  const [ world, setWorld ] = useState(null);
  const [ isAdmin, setIsAdmin ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(true);

  const chipRenderValue = (selected) => (
    <div className={classes.chips}>
      {selected.map(value => (
        <Chip
          key={value.id}
          className={classes.chip}
          label={value.name}
          avatar={<Avatar className={classes.chipAvatar} src={value.avatar} name={value.name} />}
        />
      ))}
    </div>
  );

  const handleGameChange = field => event => {
    setNewGame({ ...newGame, [field]: event.target.value });
  };

  const gameForm = [{
    type: 'input',
    inputType: 'text',
    label: translate('game.name'),
    value: newGame.name,
    onChange: handleGameChange('name'),
    required: true
  }, {
    type: 'input',
    inputType: 'text',
    label: translate('game.avatar'),
    value: newGame.avatar,
    onChange: handleGameChange('avatar')
  }, {
    type: 'select',
    multiple: true,
    dividers: true,
    label: translate('games.characters'),
    items: charactersItems,
    value: newGameCharacters,
    renderValue: chipRenderValue,
    onChange: event => {
      setNewGameCharacters(event.target.value);
    }
  }];

  useEffect(() => {
    setIsAdmin(false);

    const id = selectedWorld || currentWorld;

    getWorldById(id)
    .then((wrld) => {
      setWorld(wrld);

      wrld.admins.forEach((admin) => {
        if (admin.id === user.id) {
          setIsAdmin(true);
        }
      });
    }).catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setInit(true);
      setIsLoading(false);
    });
  }, [ currentWorld, selectedWorld ]);

  function clickCreateGame () {
    setIsLoading(true);

    createGame(world.id, newGame)
      .then((updated) => {
        setWorld(updated);

        let worlds = [];

        user.worlds.forEach(wrld => {
          if (wrld.id === updated.id) {
            worlds.push({
              ...wrld,
              games: [
                ...wrld.games,
                updated
              ]
            });
          } else {
            worlds.push(wrld);
          }
        });

        changeUser({
          ...user,
          worlds
        });

        history.push(`${location.pathname.replace('/new', '')}`);
      }).catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function isEnabled (id) {
    if (isAdmin) {
      return world.enabledGames.find((game) => game.id === id) !== undefined;
    } else {
      return world.games.find((game) => game.id === id) !== undefined;
    }
  }

  function toggleEnabled (game) {
    let call = null;

    if (isEnabled(game.id)) {
      call = disableGame;
    } else {
      call = enableGame;
    }

    call(world.id, game.id)
      .then(setWorld)
      .catch(console.log);
  }

  // TODO: Create filters
  // TODO: Create and add real stats
  return (
    <div className={clsx('Games', className, classes.root)}>
      <Switch>
        <Route exact path={'*/games'} render={(props) => (
          <Fragment>
            <Card className={clsx(classes.card, classes.newGameCard)}>
              <Button color="primary" onClick={() => history.push(`${location.pathname}/new`)}>{translate('games.newGame')}</Button>
            </Card>

            <div className={clsx(classes.games)}>
              <Loading className={clsx(classes.loading)} isLoading={isLoading} />
              {world && world.games.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  enabled={isEnabled(game.id)}
                  toggleEnabled={toggleEnabled}
                  history={history}
                  location={location}
                  translate={translate}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          </Fragment>
        )} />
        <Route exact path={'*/games/new'} render={(props) => (
          <div className={clsx(classes.forms)}>
            {init && <Form
              className={clsx(classes.form)}
              title={translate('games.newGame')}
              fields={gameForm}
              onSubmit={clickCreateGame}
              submitText={translate('forms.create')}
              isLoading={isLoading}
            />}
          </div>
        )} />
      </Switch>
    </div>
  );
}

export default React.forwardRef((props, ref) => (
  <LoginContext.Consumer>
    {(login) =>
      <LocaleContext.Consumer>
        {(locale) =>
          <Games
            {...props}
            translate={locale.translate}
            user={login.user}
            currentWorld={login.world}
            changeWorld={login.selectWorld}
            ref={ref}
            changeUser={login.changeUser}
          />
        }
      </LocaleContext.Consumer>
    }
  </LoginContext.Consumer>
));
