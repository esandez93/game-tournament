const MAX_ITEMS = 50;

module.exports = {
  prepareMongooseReq: (model, queryType = 'find', options = {}) => {
    console.log(queryType, options);

    let error = null;

    // TODO: Check here all errors
    // TODO: translate
    if (!model)
      error = 'No model provided';

    if (error)
      return new Promise((resolve, reject) => reject(new Error(error)));

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

    let req =
      model
        [queryType](options)
        .limit(op.items)
        .sort(op.sort);

    return req.exec();
  }
}
