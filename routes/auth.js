const express = require('express');

const router = express.Router();

router.post('/signup', (req, res, next) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    req.flash('messages', 'All fields are required');
  }

  return res.redirect('/signup');
});

router.post('/login', (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    req.flash('messages', 'All fields are required');
  }

  return res.redirect('/login');
});

module.exports = router;
