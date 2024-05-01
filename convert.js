import fs from 'fs';
import geojson from './FloodArchive.json' assert { type: 'json' };

const convertDate = (dateString) => {
	const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
	// Replace the date string with the yyyy/mm/dd format
	return dateString.replace(regex, '$3/$1/$2');
};

const converted = geojson.features.map((feature) => {
	return {
		...feature,
		properties: {
			...feature.properties,
			Began: convertDate(feature.properties.Began),
			Ended: convertDate(feature.properties.Ended),
			Date: new Date(feature.properties.Began).getTime(),
		},
	};
});

const featureCollection = {
	type: 'FeatureCollection',
	features: converted,
};
console.log(featureCollection);

fs.writeFile('output.json', JSON.stringify(featureCollection), (err) => {
	if (err) {
		console.error('Error writing file:', err);
		return;
	}
	console.log('File saved successfully!');
});
