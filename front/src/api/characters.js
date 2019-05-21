import { url } from './config';
import { get } from '@/utils';

const endpoint = 'characters';

function getCharacters(query) {
  return get(`${url}/${endpoint}?${query}`);
}

function getCharacterById(id) {
  return get(`${url}/${endpoint}/${id}`);
}

export {
  getCharacters,
  getCharacterById
};
