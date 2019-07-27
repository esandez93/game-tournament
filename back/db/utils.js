const moment = require('moment');

const MAX_ITEMS = 50;

module.exports = {
  prepareMongooseReq: (model, queryType = 'find', options = {}) => {
    let error = null;

    // TODO: Check here all errors
    // TODO: translate
    if (!model) {
      error = 'No model provided';
    }

    if (error) {
      return new Promise((resolve, reject) => reject(new Error(error)));
    }

    const op = {
      items: options.items ? options.items : MAX_ITEMS,
      sort: options.sort
    };

    delete options.items;
    delete options.sort;

    if (options.or) {
      options.$or = options.or;

      delete options.or;
    }

    let populate = options.populate || [];
    if (options.populate) {
      if (!Array.isArray(options.populate)) {
        populate = [ populate ];
      } else {
        populate = [ ...populate ];
      }
    }
    delete options.populate;

    if (queryType === 'findById' && (options.id || options._id)) {
      options = options.id || options._id;
    } else if (queryType === 'create') {
      options.creationDate = moment.now().utc();
      options.lastUpdate = moment.now().utc();
    } else if (queryType === 'update') {
      options.lastUpdate = moment.now().utc();
    }

    let req = model[queryType](options);

    if (queryType === 'find') {
      req = req
        .limit(op.items)
        .sort(op.sort);
    }

    populate.forEach((pop) => {
      req = req.populate(pop);
    });

    return req.exec();
  }
}
