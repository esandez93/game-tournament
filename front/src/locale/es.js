export default {
  sections: {
    login: 'Login',
    signup: 'Registro',
    home: 'Home',
    profile: 'Perfil',
    ranking: 'Ranking',
    matches: 'Partidas',
    users: 'Usuarios',
    games: 'Juegos',
    settings: 'Configuración',
    notfound: 'No encontrada',
    worlds: 'Mundos',
    logout: 'Logout'
  },
  entities: {
    user: 'Usuario',
    world: 'Mundo',
    game: 'Juego'
  },
  login: {
    signup: 'No tienes una cuenta? <1>REGÍSTRATE AQUÍ</1>'
  },
  signup: {
    userInfo: 'Información de usuario',
    signup: 'Registro'
  },
  matches: {
    newMatch: 'Nueva partida'
  },
  match: {
    errors: {
      player1: 'No se ha seleccionado al Jugador 1',
      player2: 'No se ha seleccionado al Jugador 2',
      player1Team: 'No se han añadido personajes al Jugador 1',
      player2Team: 'No se han añadido personajes al Jugador 2',
      noResult: 'A los dos Jugadores les quedan personajes vivos'
    }
  },
  user: {
    name: 'Nombre',
    username: 'Nombre de usuario',
    password: 'Contraseña',
    repeatPassword: 'Repetir Contraseña',
    email: 'Email'
  },
  card: {
    expand: 'Expandir',
    collapse: 'Colapsar'
  },
  alive: 'Vivo',
  dead: 'Muerto',
  delete: 'Eliminar',
  settings: {
    theme: 'Tema',
    locale: 'Idioma',

    errors: {
      noPassword: 'Debe introducir la contraseña para confirmar los cambios',
      checkPassword: 'La contraseña es incorrecta',
      updateUser: 'Error inesperado actualizando la información'
    }
  },
  app: {
    errors: {
      noWorld: 'No hay ningún Mundo seleccionado',
      currentWorldHasNoGames: 'El Mundo seleccionado no tiene Juegos asignados',
      noGame: 'No hay ningún Juego seleccionado'
    }
  },
  forms: {
    save: 'Guardar',
    create: 'Crear'
  },
  worlds: {
    newWorld: 'Nuevo Mundo',
    users: 'Usuarios',
    admins: 'Administradores'
  },
  world: {
    name: 'Nombre',
    avatar: 'Avatar'
  },
  controls: {
    enabled: 'Activado',
    disabled: 'Desactivado'
  }
};
