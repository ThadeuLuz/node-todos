const path = require('path');
const flash = require('connect-flash');
const logger = require('morgan');
const dotenv = require('dotenv');
const session = require('express-session');
const express = require('express');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const auth = require('./routes/auth');
const pages = require('./routes/pages');
const errors = require('./routes/errors');

dotenv.load();

const app = express();

app.set('port', process.env.PORT || 8080);
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

app.use(auth);
app.use(pages);
app.use(errors);

app.listen(8080, () => {
  console.log(`Example app listening on port 8080!`);
});
