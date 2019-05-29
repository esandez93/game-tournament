import { url } from './config';
import {
  get,
  post
} from '@/utils';

const endpoint = 'matches';

function getMatches(world, params) {
  return get(`${url}/worlds/${world}/${endpoint}`, params);
}

function getMatchById(world, id) {
  return get(`${url}/worlds/${world}/${endpoint}/${id}`);
}

function createMatch(world, match) {
  return post(`${url}/worlds/${world}/${endpoint}`, match);
}

export {
  getMatches,
  getMatchById,
  createMatch
};
