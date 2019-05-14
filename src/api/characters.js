import { url } from './config';
import { doRequest } from '@/utils';

const endpoint = 'characters';

function getCharacters(query) {
  return doRequest(`${url}/${endpoint}?${query}`);
}

function getCharacterById(id) {
  return doRequest(`${url}/${endpoint}/${id}`);
}

export {
  getCharacters,
  getCharacterById
};
