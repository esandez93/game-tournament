import { url } from './config';
import { doRequest } from '@/utils';

const endpoint = 'users';

function getUsers() {
  return doRequest(`${url}/${endpoint}`);
}

function getUserById(id) {
  return doRequest(`${url}/${endpoint}/${id}`);
}

function getRanking() {
  return doRequest(`${url}/${endpoint}`);
}

function login(user, password) {
  return doRequest(`${url}/${endpoint}`, { _limit: 1 });
}

export {
  getUsers,
  getUserById,
  getRanking,
  login
};
