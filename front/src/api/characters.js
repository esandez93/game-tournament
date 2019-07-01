import { url } from './config';
import { get } from '@/utils';

const endpoint = 'characters';

function getCharacters(params) {
  return get(`${url}/${endpoint}`, params);
}

function getCharacterById(id) {
  return get(`${url}/${endpoint}/${id}`);
}

export {
  getCharacters,
  getCharacterById
};
