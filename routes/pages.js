const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
})

router.get('/signup', (req, res) => {
  res.render('signup', { messages: req.flash('messages') });
});

router.get('/login', (req, res) => {
  res.render('login', { messages: req.flash('messages') });
});

module.exports = router;
