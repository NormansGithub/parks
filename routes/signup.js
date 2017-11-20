const express = require('express');
const router = express.Router();
const userDao = require('../daos/user-dao');

router.get('/', (req, res, next) =>
	userDao.retrieve(
		['email', 'username'],
		(err, data) => 
			err
				? next(err)
				: res.render('signup.html', {
					email: JSON.stringify(data[0]),
					username: JSON.stringify(data[1]),
					error: req.session.error
				}),
		null,
		true
	)
);

router.post('/', (req, res, next) => {
	const data = {
		$email: req.body.email,
		$username: req.body.username.toLowerCase(),
		$password: req.body.password,
		$admin: req.body.adminPw
	};
	const success = _ => {
		req.session.success = "Registration successful";
		res.redirect('/login');
	};
	const fail = err => {
		req.session.error = "Unknown error";
		console.error(err);
		res.redirect('/signup');
	};
	
	userDao.create(data, success, fail);
});

module.exports = router;