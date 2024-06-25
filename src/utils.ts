import { Color, PickingInfo } from '@deck.gl/core/typed';
import { TooltipContent } from '@deck.gl/core/typed/lib/tooltip';
import type { Feature, Geometry, GeoJsonProperties } from 'geojson';

export function formatLabel(timestamp: number) {
	return new Date(timestamp).toLocaleDateString('en-US', {
		timeZone: 'utc',
		year: 'numeric',
		month: '2-digit',
	});
}

const COLOR_RANGE = [
	[239, 243, 255],
	[198, 219, 239],
	[158, 202, 225],
	[107, 174, 214],
	[49, 130, 189],
	[8, 81, 156],
];
export function generateFillColor(f: Feature<Geometry, GeoJsonProperties>) {
	const deathToll = f.properties?.Dead;
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
	return COLOR_RANGE[index] as Color;
}

export function getTimeRange(
	features?: Feature<Geometry, GeoJsonProperties>[],
): [number, number] {
	if (!features) {
		return [0, 0];
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

export function getTooltip({ object }: PickingInfo) {
	if (!object) return null;
	const {
		properties: { Dead, Area, Country, timestamp },
	} = object;

	return {
		text: `\
	  Country: ${Country}
		Date: ${formatLabel(timestamp)}
    Death: ${Dead}
    Area: ${Area} sq km
    `,
		style: {
			zIndex: '2',
			backgroundColor: 'white',
			color: '#08519c',
			border: '2px solid #08519c',
			borderRadius: '4px',
		},
	};
}

export function getCursor({ isHovering }: { isHovering: boolean }) {
	return isHovering ? 'pointer' : 'default';
}
