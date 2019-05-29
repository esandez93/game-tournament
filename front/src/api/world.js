import { url } from './config';
import { get } from '@/utils';

const endpoint = 'worlds';

function getWorlds(params) {
  return get(`${url}/${endpoint}`, params);
}

function getWorldById(id) {
  return get(`${url}/${endpoint}/${id}`);
}

function getRanking(id) {
  // TODO: Add Ranking endpoint
  return get(`${url}/${endpoint}/${id}/ranking`);
}

export {
  getWorlds,
  getWorldById,
  getRanking
};
