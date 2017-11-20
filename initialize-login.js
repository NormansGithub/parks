const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('parks.db');

db.serialize(_ => db.run('CREATE TABLE user ' +
	'(' +
		'email text primary key, ' +
		'username text unique, ' +
		'password text not null,' +
		'admin bit not null, ' +
		'resetPasswordToken text, ' +
		'resetPasswordExpires text' +
	')',
	_ => db.close()
));