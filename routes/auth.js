const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const User = require('../models/User');

const router = express.Router();

router.post('/signup', (req, res, next) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    req.flash('messages', 'All fields are required');
    return res.redirect('/signup');
  }

  User.findOne({ email }, (err, user) => {
    if (err) return next(err);

    if (user) {
      req.flash('messages', 'There is a user with this email');
      return res.redirect('/signup');
    }

    const newUser = new User({ email, name });
    newUser.password = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

    newUser.save((saveErr, savedUser) => {
      if (saveErr) return next(saveErr);

      console.log('Usuário criado!', savedUser.id);

      return res.redirect('/signup');
    });
  });
});

router.post('/login', (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    req.flash('messages', 'All fields are required');
  }

  return res.redirect('/login');
});

module.exports = router;
