export default (url, params = {}) => {
  let query = '';
  const keys = Object.keys(params);

  keys.forEach((key, index) => {
    if (index === 0) query = '?';

    query += `${key}=${params[key]}`;

    if (index < keys.length-1) query += '&';
  });

  return fetch(url + query).then(res => res.json());
}
