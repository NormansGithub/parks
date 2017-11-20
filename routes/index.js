const express = require('express');
const urlFormatter = require('../helpers/url-formatter');
const parksDao = require('../daos/parks-dao');

const router = express.Router();

router.get('/', (req, res, next) => {
	const user = req.user
		? JSON.parse(req.user)
		: {};
	const data = {
		alert: req.session.error,
		user: user,
		next: next
	}

	parksDao.retrieve(
		[
			'Name',
			'StreetNumber',
			'StreetName',
			'Hectare',
			'Neighborhood',
			'NeighborhoodURL',
			'Official',
			'Facilities',
			'SpecialFeatures',
			'Washrooms'
		],
		(err, rows) => handleTableEntries(err, rows, data, res)
	);
	
	req.session.error = undefined;
});

const handleTableEntries = (err, rows, data, res) => {
	if (err) data.next(err);

	data.tableEntries = rows;
	
	parksDao.retrieve(
		['Name', 'StreetNumber', 'StreetName'],
		(err, rows) => handleIncompleteLabels(err, rows, data, res)
	);
}

const handleIncompleteLabels = (err, rows, data, res) => {
	if (err) data.next(err);
	
	data.incompleteLabels = urlFormatter.formatURLs(rows);

	parksDao.retrieve(
		['lat', 'lng'],
		(err, rows) => renderTable(err, rows, data, res)
	);
};

const renderTable = (err, rows, data, res) => {
	if (err) {
		console.error(err);
		data.next(err);
	}

	res.render('index.html', {
		username: data.user.username,
		admin: data.user.admin,
		alert: data.alert,
		table: data.tableEntries,
		label: JSON.stringify(data.incompleteLabels),
		latLon: JSON.stringify(rows)
	});
};

getImage = value => value == 1
	? "images/checkmark.png"
	: "images/crossmark.png";


module.exports = router;