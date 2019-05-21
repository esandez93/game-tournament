function get (url, params = {}, options = { method: 'GET' }) {
  let query = '';
  const keys = Object.keys(params);

  keys.forEach((key, index) => {
    if (index === 0) query = '?';

    query += `${key}=${params[key]}`;

    if (index < keys.length-1) query += '&';
  });

  return fetch(url + query, options).then(res => res.json()).catch((e) => { throw e });
}

function post (url, body = {}, options = {}) {
  const _options = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    method: 'POST',
    body: JSON.stringify(body)
  };

  return fetch(url, _options).then(res => res.json()).catch((e) => { throw e });
}

function put (url, body = {}, options = {}) {
  const _options = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    method: 'PUT',
    body
  };

  return fetch(url, _options).then(res => res.json()).catch((e) => { throw e });
}

export {
  get,
  post,
  put
};
