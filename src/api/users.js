import { url } from './config';
import { get } from '@/utils';

const endpoint = 'users';

function getUsers() {
  return get(`${url}/${endpoint}`);
}

function getUserById(id) {
  return get(`${url}/${endpoint}/${id}`);
}

function getRanking() {
  return get(`${url}/${endpoint}`);
}

function login(user, password) {
  return get(`${url}/${endpoint}`, { _limit: 1 });
}

export {
  getUsers,
  getUserById,
  getRanking,
  login
};
