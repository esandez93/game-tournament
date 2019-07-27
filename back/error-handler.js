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

  app.use((err, req, res, next) => {
    console.log('Unexpected error:', err);

    return res.status(err.status || 500)
      .send({
        message: err.message
      })
    }
  );
};
