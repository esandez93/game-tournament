import { url } from './config';
import { get, post } from '@/utils';

const endpoint = 'users';

function getUsers() {
  return get(`${url}/${endpoint}`);
}

function getUserById(id) {
  return get(`${url}/${endpoint}/${id}`);
}

function getRanking() {
  // TODO: Add Ranking endpoint
  return get(`${url}/${endpoint}`);
}

function register(user) {
  return post(`${url}/${endpoint}`, user);
}

export {
  getUsers,
  getUserById,
  getRanking,
  register
};
