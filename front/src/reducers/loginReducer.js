function loginReducer (state, action) {
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
      const world = action.world;

      if (world === 'new') {
        localStorage.removeItem('world');
        action.history.push('/worlds/new');
      } else if (world === 'null') {
        localStorage.removeItem('world');
      } else {
        localStorage.setItem('world', world);
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
          ...action.user,
          settings: {
            ...state.user.settings,
            ...action.user.settings
          }
        }
      };

      localStorage.setItem('user', newUser);
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
