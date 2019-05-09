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
  return doRequest(`${url}/${endpoint}/b60aa4ef-13ef-4eae-85d3-43e817039283`);
}

export {
  getUsers,
  getUserById,
  getRanking,
  login
};
