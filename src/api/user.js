import url from './config';
import { doRequest } from '@utils';

const endpoint = 'users';

function getUsers() {
  return doRequest(`${url}/${endpoint}`)
}

function getUserById(id) {
  return doRequest(`${url}/${endpoint}/${id}`)
}

export {
  getUsers,
  getUserById
}
