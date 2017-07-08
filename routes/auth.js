const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt-nodejs');

const router = express.Router();

const saveSession = (req, { email, name, id }) => {
  req.session.user = { email, name, id };
};

router.post('/login', (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    req.flash('messages', 'All fields are required');
    return res.redirect('/login');
  }

  User.findOne({ email }, (err, user) => {
    if (err) return next(err);

    if (!user) {
      req.flash('messages', `No user found with email ${email}`);
      return res.redirect('/login');
    }

    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      req.flash('messages', 'Oops! Wrong password.');
      return res.redirect('/login');
    }

    saveSession(req, user);
    return res.redirect('/todos');
  });
});

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
      saveSession(req, savedUser);
      return res.redirect('/signup');
    });
  });
});

router.post('/profile', (req, res, next) => {
  const { id } = req.session.user || {};
  const { name } = req.body;

  if (!id) return res.redirect('/logout');
  if (!name) {
    req.flash('messages', 'All fields are required');
    return res.redirect('/profile');
  }

  User.findById(id, (err, user) => {
    if (err) return next(err);
    if (!user) return next(new Error(`User not found with id ${id}`));

    user.name = name;

    user.save((saveErr, savedUser) => {
      if (saveErr) return next(saveErr);
      saveSession(req, savedUser);
      res.redirect('/profile');
    });
  });
});

router.get('/logout', (req, res) => {
  req.session.user = null;
  res.redirect('/');
});

module.exports = router;
