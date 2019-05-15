import { url } from './config';
import {
  get,
  post
} from '@/utils';

const endpoint = 'matches';

function getMatches(params) {
  return get(`${url}/${endpoint}`, params);
}

function getMatchById(id) {
  return get(`${url}/${endpoint}/${id}`);
}

function createMatch(match) {
  return post(`${url}/${endpoint}`, match);
}

export {
  getMatches,
  getMatchById,
  createMatch
};
