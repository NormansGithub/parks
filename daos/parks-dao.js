const genericDao = require('../daos/generic-dao');

retrieve = (columns, callback, where=false) =>
	genericDao.retrieve(columns, 'parks', callback, where, false)

exports.retrieve = retrieve;