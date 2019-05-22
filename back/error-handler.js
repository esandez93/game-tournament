module.exports = (app) => {
  if (app.get('env') === 'development') {
    app.use((err, req, res, next) =>
      res.status(err.status || 500)
        .send({
          message: err.message,
          error: err
        })
    );
  }

  app.use((err, req, res, next) =>
    res.status(err.status || 500)
      .send({
        message: err.message
      })
  );
};
