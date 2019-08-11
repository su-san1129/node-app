var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//expressでセッションを使うためのモジュール
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//boardsのルーティング設定
var boards = require('./routes/boards');
var register = require('./routes/register'); //registerのルーティング
var login = require('./routes/login');
var setUser = require('./setUser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

app.use('/',setUser, indexRouter);
app.use('/users', usersRouter);
//ミドルウェアの呼び出しを行っている。
app.use('/boards', setUser, boards); //boardsはrequire('./routes/boards')のこと
app.use('/register', register); //urlのregisterが使えるようになる。
app.use('/login', login);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
