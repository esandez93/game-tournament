function ResError ({ code = 500, error = 'Unexpected error' }) {
  this.code = code;
  this.message = error;
  this.stack = (new Error()).stack;
}
ResError.prototype = Object.create(Error.prototype);
ResError.prototype.constructor = ResError;

let invalidTokenCallback = null;
function setInvalidTokenCallback (callback) {
  invalidTokenCallback = callback;
}

function hasError (code) {
  return code >= 400 && code <= 599;
}

function getOptions (options) {
  return {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    credentials: 'include',
  }
}

function resolveRequest (promise) {
  return new Promise((resolve, reject) => {
    promise
      .then(res => {
        if(hasError(res.status)) {
          res.json().then((error) => {
            if (res.status === 401 && error.error.includes('token') && invalidTokenCallback) {
              invalidTokenCallback();
            }

            reject({
              code: res.status,
              ...error
            });
          });
        } else {
          resolve(res.json());
        }
      })
      .catch(reject);
  });
}

function get (url, params = {}, options = {}) {
  const _options = {
    ...getOptions(options),
    method: 'GET'
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
    ...getOptions(options),
    method: 'POST',
    body: JSON.stringify(body)
  };

  return resolveRequest(fetch(url, _options));
}

function put (url, body = {}, options = {}) {
  const _options = {
    ...getOptions(options),
    method: 'PUT',
    body: JSON.stringify(body)
  };

  return resolveRequest(fetch(url, _options));
}

function remove (url, body = {}, options = {}) {
  const _options = {
    ...getOptions(options),
    method: 'DELETE',
    body: JSON.stringify(body)
  };

  return resolveRequest(fetch(url, _options));
}

export {
  setInvalidTokenCallback,
  get,
  post,
  put,
  remove
};
