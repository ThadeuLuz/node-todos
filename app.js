const path = require('path');
const flash = require('connect-flash');
const logger = require('morgan');
const dotenv = require('dotenv');
const session = require('express-session');
const express = require('express');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

dotenv.load();

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'shhhsecret',
  resave: true,
  saveUninitialized: true,
}));
app.use(flash());

app.get('/', (req, res) => {
  res.render('index');
})

app.get('/signup', (req, res) => {
  res.render('signup', { messages: req.flash('messages') });
});

app.post('/signup', (req, res, next) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    req.flash('messages', 'All fields are required');
  }

  return res.redirect('/signup');
});

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err,
  });
});

app.listen(8080, () => {
  console.log(`Example app listening on port 8080!`);
});
