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

    case 'setHeader': {
      return {
        ...state,
        header: action.header
      }
    }

    case 'setTitle': {
      return {
        ...state,
        title: action.title
      }
    }

    default: {
      break;
    }
  }
}

export default appReducer;
