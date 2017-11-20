const express = require('express');
const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const expressSession = require('express-session');

const index = require('./routes/index');
const error = require('./routes/error');
const login = require('./routes/login');
const logout = require('./routes/logout');
const signup = require('./routes/signup');
const profile = require('./routes/profile');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());
app.use("/images", express.static(path.join(__dirname, 'public/images')));
app.use("/templates", express.static(path.join(__dirname, 'public/templates')));
app.use("/js", express.static(path.join(__dirname, 'public/js')));
app.use("/stylesheets", express.static(path.join(__dirname, 'public/stylesheets')));
app.use("/DataTables-1.10.16", express.static(path.join(__dirname, 'public/DataTables-1.10.16')));

app.use('/', index);
app.use('/error', error);
app.use('/login', login);
app.use('/logout', logout);
app.use('/signup', signup);
app.use('/profile', profile);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

app.listen(3000, _ => console.log('Example app listening on port 3000!'));