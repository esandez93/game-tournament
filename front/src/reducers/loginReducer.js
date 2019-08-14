const initialLoginContext = {
  logged: false,
  user: {},
  world: localStorage.getItem('world') || 'null',
  game: localStorage.getItem('game') || 'null',
};

function loginReducer (state = initialLoginContext, action) {
  switch(action.type) {
    case 'login': {
      return {
        ...state,
        logged: true,
        user: action.user
      };
    }

    case 'logout': {
      return {
        ...state,
        user: {},
        logged: false
      };
    }

    case 'setLogged': {
      return {
        ...state,
        logged: action.logged
      };
    }

    case 'setWorld': {
      return {
        ...state,
        world: action.world
      };
    }

    case 'changeWorld': {
      const {
        world,
        history
       } = action;

      if (world === 'new') {
        localStorage.removeItem('world');
        history.push('/worlds/new');
      } else if (world === 'null') {
        localStorage.removeItem('world');
      } else {
        localStorage.setItem('world', world);

        if (history.location.pathname.includes('worlds')) {
          let url = history.location.pathname.split('/');
          url[2] = world;

          history.push(url.join('/'));
        }
      }

      return {
        ...state,
        world: world !== 'new' ? world : state.world
      };
    }

    case 'changeGame': {
      const game = action.game;

      if (game === 'new') {
        localStorage.removeItem('game');
        // action.history.push('/games/new');
      } else if (game === 'null') {
        localStorage.removeItem('game');
      } else {
        localStorage.setItem('game', game);
      }

      return {
        ...state,
        game: game !== 'new' ? game : state.game
      };
    }

    case 'changeUser': {
      const newUser = {
        ...state,
        user: {
          ...state.user,
          ...action.user
        }
      };

      localStorage.setItem('user', JSON.stringify({
        ...state.user,
        ...action.user
      }));
      return {
        ...newUser
      };
    }

    default: {
      break;
    }
  }
}

export default loginReducer;
