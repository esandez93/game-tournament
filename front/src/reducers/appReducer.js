function appReducer (state, action) {
  switch(action.type) {
    case 'toggleSideMenu': {
      return {
        ...state,
        sideMenu: {
          ...state.sideMenu,
          isOpen: !state.sideMenu.isOpen
        }
      };
    }

    case 'setSideMenu': {
      return {
        ...state,
        sideMenu: {
          ...state.sideMenu,
          isOpen: action.isOpen
        }
      };
    }

    case 'setIsOffline': {
      return {
        ...state,
        offline: action.offline
      }
    }

    default: {
      break;
    }
  }
}

export default appReducer;
