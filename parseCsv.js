const sqlite3 = require('sqlite3').verbose();
const csv = require('fast-csv');
const db = new sqlite3.Database('parks.db');

const handleError = err => { if (err) console.error(err.message) };

db.serialize(_ =>
	db.run('CREATE TABLE parks ' +
		'(' +
		'Name text primary key, ' +
		'StreetNumber text, ' +
		'StreetName text, ' +
		'lat real, ' +
		'lng real, ' +
		'Hectare text, ' +
		'Neighborhood text, ' +
		'NeighborhoodURL text, ' +
		'Official bit, ' +
		'Facilities bit, ' +
		'SpecialFeatures bit, ' +
		'Washrooms bit' +
		')',
		handleError)
);

csv.fromPath("parks.csv", {
    renameHeaders : true,
    headers : [
        , 
	    'Name',
        'Official',
        'Street Number',
        'Street Name', , ,
        'LatLon',
        'Size',
        'Neighborhood',
        'NeighborhoodURL', ,
        'Facilities',
        'Special Features',
        'Washrooms'
    ]
})
.on("data", data => {
 	const query = "INSERT INTO parks (Name, StreetNumber, StreetName, " + 
 	    "lat, lng, Hectare, Neighborhood, NeighborhoodURL, Official, " + 
 	    "Facilities, SpecialFeatures, Washrooms) VALUES (" +
 	    '"' + data['Name'] + '"' + ', ' + 
 	    data['Street Number'] + ', ' +
	    '"' + data['Street Name'] + '"' + ', ' +
	    data['LatLon'].split(',')[0] + ', ' +
	    data['LatLon'].split(',')[1] + ', ' +
	    data['Size'] + ', ' +
	    '"' + data['Neighborhood'] + '"' + ', ' +
	    '"' + cleanURLData(data['NeighborhoodURL']) + '"' + ', ' +
        data['Official'] + ', ' +
	    letterToBit(data['Facilities']) + ', ' +
	    letterToBit(data['Special Features']) + ', ' +
	    letterToBit(data['Washrooms']) + 
	    ")";

	db.run(query, handleError);
})
.on("end", _ => {
    console.log("done");
    db.close();
});

const letterToBit = letter => (letter == 'Y') ? 1 : 0;

const cleanURLData = data => {
	data = data.substring(39, data.length - 9);
	if (data == '/') 'http://vancouver.ca/news-calendar/south-cambie.aspx';
	
	return data.replace('arbutus', 'arbutus-ridge')
        .replace('dunbar', 'dunbar-southlands')
        .replace('grandview', 'grandview-woodland')
        .replace('hastings', 'hastings-sunrise')
        .replace('kensington', 'kensington-cedar-cottage')
        .replace('fraserview', 'victoria-fraserview');
}