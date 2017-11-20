const express = require('express');
const router = express.Router();
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');
const userDao = require('../daos/user-dao');

router.get('/', (req, res, next) => {
	const success = req.session.success;
	const error = req.session.error;
	req.session.success = undefined;
	req.session.error = undefined;

	res.render('login.html', {
		user: req.user,
		success: success,
		error: error
	});
});

router.post('/', (req, res, next) =>
	passport.authenticate(
		'login',
		(err, user) => tryLogin(err, user, req, res))
	(req, res, next));

const setupLogin = (req, username, password, done) => 
	userDao.retrieve(
		['username', 'password', 'admin'],
		(err, rows) => handleUsernameCheck(err, rows, req, done),
		'username = "' + username.toLowerCase() + '"')

const handleUsernameCheck = (err, rows, req, done) => {
	if (err) return done(null, false, { message: 'Username is invalid' });
	if (rows.length != 1) return done(null, false, { message: 'Username is wrong' });
	
	bcrypt.compare(
		req.body.password,
		rows[0]['password'],
		(err, res) => handlePasswordCheck(err, res, rows, done));
};

const handlePasswordCheck = (err, res, rows, done) => {
	if (err) done(err);
	else if (res) done(null, JSON.stringify(rows));
	else done(null, false, { message: 'Password is wrong' });
};

const tryLogin = (err, user, req, res) => {
	if (err) next(err);

	user = JSON.parse(user);
	if (!user) {
		req.session.error = "Username or password is invalid";
		return res.redirect('/login');
	}
	req.logIn(user, err => handleLoginResponse(err, req, res));
};

const handleLoginResponse = (err, req, res) => {
	if (err) next(err);
	req.session.error = undefined;
	return res.redirect('/');
};

passport.use('login', new localStrategy(
	{ passReqToCallback : true },
	setupLogin)
);

passport.serializeUser((user, done) =>
	userDao.retrieve(
		['rowid'],
		(err, rows) => done(err, JSON.stringify(rows[0])),
		'username = "' + user[0]['username'] + '"')
);

passport.deserializeUser((id, done) =>
	userDao.retrieve(
		['username', 'password', 'admin'],
		(err, rows) => done(err, JSON.stringify(rows[0])),
		'rowid = ' + JSON.parse(id)['rowid'])
);

module.exports = router;