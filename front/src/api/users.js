import { url } from './config';
import { get, post } from '@/utils';

const endpoint = 'users';

function getUsers(world) {
  return get(`${url}/worlds/${world}/${endpoint}`);
}

function getUserById(world, id) {
  return get(`${url}/worlds/${world}/${endpoint}/${id}`);
}

function register(user) {
  return post(`${url}/${endpoint}`, user);
}

export {
  getUsers,
  getUserById,
  register
};
