export default {
  sections: {
    login: 'Login',
    signup: 'Sign Up',
    home: 'Home',
    profile: 'Profile',
    ranking: 'Ranking',
    matches: 'Matches',
    users: 'Users',
    settings: 'Settings',
    notfound: 'Not found',
    worlds: 'Worlds'
  },
  entities: {
    user: 'User',
    world: 'World',
    game: 'Game'
  },
  login: {
    signup: 'You don\'t have an account? <1>REGISTER HERE</1>'
  },
  signup: {
    userInfo: 'User info',
    signup: 'Sign Up'
  },
  matches: {
    newMatch: 'New match'
  },
  match: {
    errors: {
      player1: 'Player 1 has not been selected',
      player2: 'Player 2 has not been selected',
      player1Team: 'Player 1 has not any characters',
      player2Team: 'Player 2 has not any characters',
      noResult: 'Both Players have characters alive'
    }
  },
  user: {
    name: 'Name',
    username: 'Username',
    password: 'Password',
    repeatPassword: 'Repeat Password',
    email: 'Email'
  },
  card: {
    expand: 'Expand',
    collapse: 'Collapse'
  },
  alive: 'Alive',
  dead: 'Dead',
  delete: 'Delete',
  settings: {
    theme: 'Theme',
    locale: 'Locale',

    errors: {
      noPassword: 'You must enter the password to confirm the changes',
      checkPassword: 'The password is wrong',
      updateUser: 'Unexpected error updating the data'
    }
  },
  app: {
    createNewWorld: 'Create World',
    selectWorld: 'Select World',
    createNewGame: 'Create Game',
    selectGame: 'Select Game',

    errors: {
      noWorld: 'No World selected',
      currentWorldHasNoGames: 'The selected World has not any Games assigned',
      noGame: 'No Game selected'
    }
  },
  forms: {
    save: 'Save',
    create: 'Create'
  },
  worlds: {
    newWorld: 'New World',
    users: 'Users',
    admins: 'Administrators'
  },
  world: {
    name: 'Nombre',
    avatar: 'Avatar'
  }
};
