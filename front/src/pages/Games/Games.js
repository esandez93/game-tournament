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
  Stat,
  Switch as SwitchControl
} from '@/components';
import {
  LocaleContext,
  LoginContext
} from '@/context';
import {
  getGames as getAvailableGames
} from '@/api/games';
import {
  getWorldById,
  getGames as getWorldGames,
  updateWorld,
  createGame
} from '@/api/worlds';

const useStyles = makeStyles(styles);

function Games (props) {
  const {
    className,
    translate,
    history,
    location,
    user,
    currentWorld
  } = props;

  const classes = useStyles();
  const [ init, setInit ] = useState(false);
  const [ games, setGames ] = useState([]);
  const [ newGame, setNewGame ] = useState({
    name: '',
    avatar: '',
    characters: []
  });
  const [ charactersItems, setCharactersItems ] = useState([]);
  const [ newGameCharacters, setNewGameCharacters ] = useState([]);
  const [ world, setWorld ] = useState(null);
  const [ isAdmin, setIsAdmin ] = useState(false);

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
    let worldGames = [];

    getWorldById(currentWorld)
    .then((world) => {
      setWorld(world);

      world.admins.forEach((admin) => {
        if (admin.id === user) {
          setIsAdmin(true);
        }
      });
    }).catch((err) => {
      console.error(err);
    });

    getWorldGames(currentWorld)
    .then((gms) => {
      worldGames = gms;
      return getAvailableGames();
    }).then((gms) => {
      setGames([ ...worldGames, ...gms ]);
    }).catch((err) => {
      console.log(err);
    }).finally(() => {
      setInit(true);
    });
  }, [ currentWorld ]);

  function clickCreateGame () {
    createGame(newGame)
    .then((game) => {
      setGames([
        ...games,
        game
      ]);
      history.push(`${location.pathname.replace('\\new', '')}`);
    }).catch((err) => {
      console.log(err);
    });
  }

  function toggleEnabled (game) {
    updateWorld(world.id, {
      games: world.games.map((gm) => {
        if (gm.id !== game.id) {
          gm.enabled = !gm.enabled;
        }

        return gm
      })
    });
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
              {games.map((game) => (
                <Card key={game.id} className={clsx(classes.card, classes.gameCard)} contentClass={clsx(classes.cardContent)}>
                  <div className={clsx(classes.cardHeader)}>
                    <Avatar className={clsx(classes.cardAvatar)} src={game.logos.favicon} name={game.name} />
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
                      label={game.characters.length}
                      Icon={FaceIcon}
                    />
                  </div>

                  <div className={clsx(classes.cardFooter)}>
                    {isAdmin &&
                      <SwitchControl checked={game.enabled} onChange={() => toggleEnabled(game)}></SwitchControl>
                    }
                    <Button color="primary" onClick={() => history.push(`${location.pathname}/${game.id}`)}>{translate('details')}</Button>
                  </div>
                </Card>
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
        {(locale) => <Games {...props} translate={locale.translate} user={login.user.id} currentWorld={login.world} ref={ref} />}
      </LocaleContext.Consumer>
    }
  </LoginContext.Consumer>
));
