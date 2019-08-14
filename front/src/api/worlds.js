import { url } from './config';
import { get, post, put, remove } from '@/utils';

const endpoint = 'worlds';

function getWorlds(params) {
  return get(`${url}/${endpoint}`, params);
}

function getWorldById(id) {
  return get(`${url}/${endpoint}/${id}`);
}

function createWorld(world) {
  return post(`${url}/${endpoint}`, world);
}

function updateWorld(id, world) {
  return put(`${url}/${endpoint}/${id}`, world);
}


// GAMES
function getGames(world, params) {
  return get(`${url}/${endpoint}/${world}/games`, params);
}

function getGameById(world, id) {
  return get(`${url}/${endpoint}/${world}/games/${id}`);
}

function createGame(world, body) {
  return post(`${url}/${endpoint}/${world}/games`, body);
}

function enableGame(world, game) {
  return post(`${url}/${endpoint}/${world}/games/${game}`);
}

function disableGame(world, game) {
  return remove(`${url}/${endpoint}/${world}/games/${game}`);
}

function getRanking(world, game) {
  return get(`${url}/${endpoint}/${world}/games/${game}/ranking`);
}


// MATCHES
function getMatches(world, game, params) {
  return get(`${url}/${endpoint}/${world}/games/${game}/matches`, params);
}

function getMatchById(world, game, id) {
  return get(`${url}/${endpoint}/${world}/games/${game}/matches/${id}`);
}

function createMatch(world, game, match) {
  return post(`${url}/${endpoint}/${world}/games/${game}/matches`, match);
}


// USERS
function getUsers(world) {
  return get(`${url}/${endpoint}/${world}/users`);
}

function getUserById(world, id) {
  return get(`${url}/${endpoint}/${world}/users/${id}`);
}


export {
  getWorlds,
  getWorldById,
  createWorld,
  updateWorld,

  getGames,
  getGameById,
  getRanking,
  createGame,
  enableGame,
  disableGame,

  getMatches,
  getMatchById,
  createMatch,

  getUsers,
  getUserById
};
