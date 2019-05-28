function ResError ({ code = 500, error = 'Unexpected error' }) {
  this.code = code;
  this.message = error;
  this.stack = (new Error()).stack;
}
ResError.prototype = Object.create(Error.prototype);
ResError.prototype.constructor = ResError;

function hasError (code) {
  return code >= 400 && code <= 599;
}

function resolveRequest (promise) {
  return new Promise((resolve, reject) => {
    promise
      .then(res => {
        if(hasError(res.status)) {
          res.json().then(({ error }) => {
            reject({
              code: res.status,
              message: `${res.status} ${res.statusText}: ${error}`
            });
          });
        } else {
          resolve(res.json());
        }
      })
      .catch(reject);
  });
}

function get (url, params = {}, options = { method: 'GET' }) {
  const _options = {
    ...options,
    method: 'GET',
    headers: { ...options.headers },
    credentials: 'include'
  };

  let query = '';
  const keys = Object.keys(params);

  keys.forEach((key, index) => {
    if (index === 0) query = '?';

    query += `${key}=${params[key]}`;

    if (index < keys.length-1) query += '&';
  });

  return resolveRequest(fetch(url + query, _options));
}

function post (url, body = {}, options = {}) {
  const _options = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    credentials: 'include',
    method: 'POST',
    body: JSON.stringify(body)
  };

  return resolveRequest(fetch(url, _options));
}

function put (url, body = {}, options = {}) {
  const _options = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    credentials: 'include',
    method: 'PUT',
    body
  };

  return resolveRequest(fetch(url, _options));
}

export {
  get,
  post,
  put
};
