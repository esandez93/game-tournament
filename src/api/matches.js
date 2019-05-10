import { url } from './config';
import { doRequest } from '@/utils';

const endpoint = 'matches';

function getMatches(query) {
  return doRequest(`${url}/${endpoint}?${query}`);
}

function getMatchById(id) {
  return doRequest(`${url}/${endpoint}/${id}`);
}

export {
  getMatches,
  getMatchById
};
