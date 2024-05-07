import type {
	Feature,
	Geometry,
	FeatureCollection,
	GeoJsonProperties,
} from 'geojson';
import type { Color, PickingInfo, MapViewState } from '@deck.gl/core';
import type { DataFilterExtensionProps } from '@deck.gl/extensions';
import type { PropertiesType } from './App';

const COLOR_RANGE: Color[] = [
	[239, 243, 255],
	[198, 219, 239],
	[158, 202, 225],
	[107, 174, 214],
	[49, 130, 189],
	[8, 81, 156],
];

export function formatLabel(timestamp: number) {
	return new Date(timestamp).toLocaleDateString('en-US', {
		year: 'numeric',
		month: '2-digit',
	});
}




export function generateFillColor(f: Feature<Geometry, PropertiesType>) {
	const deathToll = f.properties.Dead;
	let index = 0;

	switch (true) {
		case deathToll > 0 && deathToll <= 10:
			index = 1;
			break;
		case deathToll > 10 && deathToll <= 50:
			index = 2;
			break;
		case deathToll > 50 && deathToll <= 100:
			index = 3;
			break;
		case deathToll > 100 && deathToll <= 1000:
			index = 4;
			break;
		case deathToll > 1000:
			index = 5;
			break;
	}
	return COLOR_RANGE[index];
};

export function getTimeRange(
	features?: Feature<Geometry, GeoJsonProperties>[],
): [minTime: number, maxTime: number] | null {
	if (!features) {
		return null;
	}
	return features.reduce(
		(range, f) => {
			const t = f?.properties?.timestamp;
			range[0] = Math.min(range[0], t);
			range[1] = Math.max(range[1], t);
			return range;
		},
		[Infinity, -Infinity],
	);
}

export function getTooltip({
	object,
}: PickingInfo<Feature<Geometry, GeoJsonProperties>>) {
	if (!object) return null;
	const {
		properties: { Dead, Area, timestamp },
	} = object;

	return `\
    Death: ${Dead}
    Area: ${Area}
    Date: ${formatLabel(timestamp)}
    `;
}