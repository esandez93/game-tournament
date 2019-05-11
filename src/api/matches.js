import { url } from './config';
import { doRequest } from '@/utils';

const endpoint = 'matches';

function getMatches(params) {
  return doRequest(`${url}/${endpoint}`, params);
}

function getMatchById(id) {
  return doRequest(`${url}/${endpoint}/${id}`);
}

export {
  getMatches,
  getMatchById
};
