const express = require('express');

const router = express.Router();
const env = process.env.NODE_ENV || 'development';

router.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// eslint-disable-next-line no-unused-vars
router.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    status: err.status,
    message: err.message,
    stack: (env === 'development') ? err.stack : '',
  });
});

module.exports = router;
