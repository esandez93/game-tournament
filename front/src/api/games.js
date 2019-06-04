import { url } from './config';
import { get, post } from '@/utils';

const endpoint = 'games';

function getGames() {
  return get(`${url}/${endpoint}`);
}

function getGameById(id) {
  return get(`${url}/${endpoint}/${id}`);
}

function createGame(game) {
  return post(`${url}/${endpoint}`, game);
}


// CHARACTERS
function getCharacters(game, params) {
  return get(`${url}/${endpoint}/${game}/characters`, params);
}

function getCharacterById(game, id) {
  return get(`${url}/${endpoint}/${game}/characters/${id}`);
}

export {
  getGames,
  getGameById,
  createGame,

  getCharacters,
  getCharacterById
};
