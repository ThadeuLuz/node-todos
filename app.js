const path = require('path');
const flash = require('connect-flash');
const logger = require('morgan');
const dotenv = require('dotenv');
const session = require('express-session');
const express = require('express');
const favicon = require('serve-favicon');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');

const auth = require('./routes/auth');
const pages = require('./routes/pages');
const todo = require('./routes/todo');
const errors = require('./routes/errors');

dotenv.load();
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true })
  .then(() => { console.info('MongoDB Connected'); });

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
  store: new MongoStore({
    url: process.env.MONGODB_URI,
    autoReconnect: true,
  }),
}));
app.use(flash());

app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.session.user;
  res.locals.messages = req.flash('messages');
  next();
});

app.use(auth);
app.use(pages);
app.use('/api', todo);
app.use(errors);


app.listen(app.get('port'), () => {
  console.log(`Example app listening on port ${app.get('port')}!`);
});
