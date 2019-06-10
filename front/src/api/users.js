import { url } from './config';
import { get, put, post } from '@/utils';

const endpoint = 'users';

/* function getUsers() {
  return get(`${url}/${endpoint}`);
} */

function getUserById(id) {
  return get(`${url}/${endpoint}/${id}`);
}

function getUserRelationships(id) {
  return get(`${url}/${endpoint}/${id}/relationships`);
}

// TODO: Change to PUT
function updateUser(id, user) {
  return post(`${url}/${endpoint}/${id}`, user);
}

function register(user) {
  return post(`${url}/${endpoint}`, user);
}

function checkPassword(id, password) {
  return post(`${url}/${endpoint}/${id}/checkPassword`, {
    password
  });
}

export {
  checkPassword,
  // getUsers,
  getUserById,
  getUserRelationships,
  updateUser,
  register
};
