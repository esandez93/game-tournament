import { url } from './config';
import { get, post } from '@/utils';

const endpoint = 'auth';

function checkToken() {
  return get(`${url}/${endpoint}/checkToken`);
}

function login(username, password) {
  return post(`${url}/${endpoint}/login`, {
    username,
    password
   });
}

function logout() {
  return get(`${url}/${endpoint}/logout`);
}

export {
  checkToken,
  login,
  logout
};
