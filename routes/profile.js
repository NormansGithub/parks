const express = require('express');
const router = express.Router();
const userDao = require('../daos/user-dao');

router.get('/', (req, res, next) => {
	let user = req.user;
	user = user
		? JSON.parse(user)
		: res.redirect('/login');
	
	userDao.retrieve(
		['email'],
		(err, data) => err
			? console.error(err)
			: res.render('profile.html', {
				admin: user ? user.admin : false,
				error: req.session.error,
				emails: JSON.stringify(data.map(i => i.email))
			})
	);
});

router.post('/', (req, res, next) => 
	userDao.update(req, response => {
		req.session.error = response;
		switch (response) {
			case "There is nothing to update":
				res.redirect('/profile');
			case "Profile successfully updated":
				res.redirect('/');
			default:
				res.redirect('/profile');
		}
	})
);

module.exports = router;