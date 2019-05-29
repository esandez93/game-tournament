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

export {
  getGames,
  getGameById,
  createGame
};
