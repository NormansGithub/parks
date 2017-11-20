const sqlite3 = require('sqlite3').verbose();
const Promise = require('bluebird');

retrieve = (columns, table, done, where=false, removeTags=false) => {
	let query = 'select ' + columns + ' from ' + table;

	if (where) {
		query = query + " where " + where;
	}

	console.log(query);
	select(query, columns, removeTags, done);
}

const select = (query, columns, removeTags, done) => 
	new Promise((resolve, reject) => {
		const db = new sqlite3.Database('parks.db');
		db.all(query, [], (err, rows) => {
			db.close();
			
			err
				? reject(err)
				: resolve(rows);
		});
	})
	.then(rows => {
		const output = removeTags
			? columns.map(column => removeTag(rows, column))
			: rows;
		
		done(null, output);
	})
	.catch((err) => {
		console.error(err.message);
		done(err, null);
	});

const removeTag = (rows, column) =>
	rows.map(row => row[column]);

exports.retrieve = retrieve;