import { url } from './config';
import { get } from '@/utils';

const endpoint = 'characters';

function getCharacters(game, query) {
  return get(`${url}/games/${game}/${endpoint}?${query}`);
}

function getCharacterById(game, id) {
  return get(`${url}/games/${game}/${endpoint}/${id}`);
}

export {
  getCharacters,
  getCharacterById
};
