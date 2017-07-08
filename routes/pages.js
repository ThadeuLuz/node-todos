const express = require('express');

const redirectIfAuth = (req, res, next) => {
  if (req.session.user) return res.redirect('/todos');
  next();
};


const redirectIfUnauth = (req, res, next) => {
  if (!req.session.user) return res.redirect('/login');
  next();
};


const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/login', redirectIfAuth, (req, res) => {
  res.render('login');
});

router.get('/signup', redirectIfAuth, (req, res) => {
  res.render('signup');
});

router.get('/profile', redirectIfUnauth, (req, res) => {
  res.render('profile');
});

router.get('/todos', redirectIfUnauth, (req, res) => {
  res.render('todos');
});

module.exports = router;
