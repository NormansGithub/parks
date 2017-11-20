formatURLs = rows =>
	rows.map(row => {
		const formattedName = row['Name'].replace(new RegExp(' ', 'g'), '+');
		const url = 'https://www.google.com/maps/search/?api=1&query=' + formattedName;
		const anchorTag = '<a href="' + url;
		return row['Name'] + '</b><br>' + row['StreetNumber'] + ' ' + row['StreetName'] + '<br>' + anchorTag;
	});

exports.formatURLs = formatURLs;