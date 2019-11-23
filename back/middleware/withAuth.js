const jwt = require('jsonwebtoken');

const withAuth = (req, res, next) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers['x-access-token'] ||
    req.cookies.token;

  if (!token) {
    res.status(401).send({ error: 'Unauthorized: No token provided' });
  } else {
    jwt.verify(token, process.env.AUTH_SECRET, (err, decoded) => {
      if (err) {
        const options = {
          httpOnly: true,
          expires: new Date(),
          overwrite: true,
        };

        res.cookie('token', '', options);
        res.status(401).send({ error: 'Unauthorized: Invalid token' });
      } else {
        // req.email = decoded.email;
        next();
      }
    });
  }
}
module.exports = withAuth;
