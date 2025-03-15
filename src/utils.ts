import { Color, PickingInfo } from '@deck.gl/core';
import type { Feature, Geometry, GeoJsonProperties } from 'geojson';

/**
 * Format a timestamp into a human-readable date string
 * @param timestamp - The timestamp to format
 * @returns A formatted date string in the format MM/DD/YYYY
 */
export function formatLabel(timestamp: number): string {
	return new Date(timestamp).toLocaleDateString('en-US', {
		timeZone: 'utc',
		year: 'numeric',
		month: '2-digit',
	});
}

// Color constants for flood visualization based on death toll
const COLOR_RANGE: Color[] = [
	[239, 243, 255],
	[198, 219, 239],
	[158, 202, 225],
	[107, 174, 214],
	[49, 130, 189],
	[8, 81, 156],
];

/**
 * Generates a fill color for a flood feature based on the death toll
 * @param f - GeoJSON feature with flood data
 * @returns A color from the color range
 */
export function generateFillColor(
	f: Feature<Geometry, GeoJsonProperties>,
): Color {
	const deathToll: number = f.properties?.Dead || 0;
	let index = 0;

	if (deathToll > 0 && deathToll <= 10) {
		index = 1;
	} else if (deathToll > 10 && deathToll <= 50) {
		index = 2;
	} else if (deathToll > 50 && deathToll <= 100) {
		index = 3;
	} else if (deathToll > 100 && deathToll <= 1000) {
		index = 4;
	} else if (deathToll > 1000) {
		index = 5;
	}

	return COLOR_RANGE[index];
}

/**
 * Calculate the time range for a set of features
 * @param features - Array of GeoJSON features
 * @returns A tuple with the minimum and maximum timestamps
 */
export function getTimeRange(
	features?: Feature<Geometry, GeoJsonProperties>[],
): [number, number] {
	if (!features || features.length === 0) {
		return [0, 0];
	}

	return features.reduce(
		(range, f) => {
			const t = f?.properties?.timestamp;
			if (typeof t === 'number') {
				range[0] = Math.min(range[0], t);
				range[1] = Math.max(range[1], t);
			}
			return range;
		},
		[Infinity, -Infinity],
	);
}

// Interface for flood properties
interface FloodProperties {
	Dead: number;
	Area: number;
	Country: string;
	timestamp: number;
	[key: string]: number | string; // Specify the type for the index signature
}

/**
 * Generate tooltip content for a flood feature
 * @param info - Picking info from deck.gl
 * @returns Tooltip content or null if no object is hovered
 */
export function getTooltip({
	object,
}: PickingInfo): { text: string; style: object } | null {
	if (!object) return null;

	const properties = object.properties as FloodProperties;
	const { Dead, Area, Country, timestamp } = properties;

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

/**
 * Get the cursor style based on hover state
 * @param isHovering - Whether the cursor is hovering over a feature
 * @returns The cursor style
 */
export function getCursor({ isHovering }: { isHovering: boolean }): string {
	return isHovering ? 'pointer' : 'default';
}
