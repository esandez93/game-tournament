module.exports = (app) => {
  if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
      console.log('ERROR HANDLER')
      console.log(JSON.stringify(err));
      res.status(err.status || 500)
        .json({
          message: err.message,
          error: err
        })
      });
  } else {
    app.use((err, req, res, next) => {
      console.log('Unexpected error:', err);

      return res.status(err.status || 500)
        .send({
          b: 'bbbb',
          message: err.message
        });
      }
    );
  }
};
