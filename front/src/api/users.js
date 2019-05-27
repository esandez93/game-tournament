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

function checkToken() {
  return get(`${url}/${endpoint}/checkToken`);
}

function login(username, password) {
  return post(`${url}/${endpoint}/auth`, {
    username,
    password
   });
}

export {
  getUsers,
  getUserById,
  getRanking,
  checkToken,
  login,
  register
};
