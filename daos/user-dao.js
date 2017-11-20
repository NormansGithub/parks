const sqlite3 = require('sqlite3').verbose();
const Promise = require('bluebird');
const bcrypt = require('bcrypt-nodejs');
const genericDao = require('../daos/generic-dao');

create = (data, success, fail) => {
	const adminPassword = 'admin';
	const SALT_FACTOR = 5;
	
	data.$admin = data.$admin === adminPassword
		? 1
		: 0;

	bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
		if (err) fail(err);

		bcrypt.hash(data.$password, salt, null, (err, hash) => {
			if (err) fail(err);

			data.$password = hash;
			
			return insert(data, success, fail);
		});
	});
}

retrieve = (columns, callback, where=false, removeTags=false) =>
	genericDao.retrieve(columns, 'user', callback, where, removeTags)

update = (req, done) => {
	const user = JSON.parse(req.user);
	const SALT_FACTOR = 5;
	let error = "";
	
	//check to see if the password is correct
	if (!bcrypt.compareSync(req.body.oldPassword, user.password)) {
		error = "Old password is invalid";
	}
	if ((req.body.password || req.body.confirm) && !(req.body.password && req.body.confirm)) {
		if (error) error.concat("<br>");

		error.concat("A field is missing");
	}
	
	//check for errors, otherwise build the query to update
	if (error) {
		handleError(error);
		done(error);
	}
	else {
		const adminPassword = 'admin';
		const updateData = {};

		if (req.body.email) {
			updateData.email = req.body.email;
		}
		if (req.body.password) {
			updateData.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(SALT_FACTOR));
		}
		if ((req.body.adminPw == adminPassword) && !user.admin) {
			updateData.admin = 1;
		}
		
		const queryParams = Object.keys(updateData).map(field => field + " = ?").toString();
		const query = "UPDATE user SET " + queryParams + " WHERE username = ?";
		const params = Object.values(updateData);
		
		if (params.length) {
			params.push(user.username);
			executeUpdate(query, params, done);
		}
		else {
			error = "There is nothing to update";
			done(error);
		}
	}
}

const insert = (data, success, fail) => {
	const fieldsList = Object.keys(data).map(field => field.replace("$", "")).toString();
	const valuesList = Object.keys(data).toString();
	const query = "INSERT INTO 'user' (" + fieldsList + ") VALUES (" + valuesList + ")";
	console.log(query);
	
	return new Promise((resolve, reject) => {
		const db = new sqlite3.Database('parks.db');

		db.all(query, data, err => {
			db.close();
			err
				? reject(err)
				: resolve();
		});
	})
	.then(success)
	.catch(fail);
};

const executeUpdate = (query, data, done) => 
	new Promise((resolve, reject) => {
		const db = new sqlite3.Database('parks.db');

		db.run(query, data, err => {
			db.close();
			err
				? reject(err)
				: resolve();
		});
	})
	.then(_ => done("Profile successfully updated"))
	.catch(err => {
		handleError(err);
		done("Unknown error");
	});

const handleError = (err, db) => {
	console.error(err.message);
	if (db) db.close();
};

exports.create = create;
exports.retrieve = retrieve;
exports.update = update;