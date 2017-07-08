const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
})

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/profile', (req, res) => {
  res.render('profile');
});

module.exports = router;
