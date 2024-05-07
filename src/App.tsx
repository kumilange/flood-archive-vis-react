import React, { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { Map } from 'react-map-gl/maplibre';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer, GeoJsonLayer } from '@deck.gl/layers';
import { DataFilterExtension } from '@deck.gl/extensions';
import {
	MapView,
	AmbientLight,
	PointLight,
	LightingEffect,
} from '@deck.gl/core';
import { CSVLoader } from '@loaders.gl/csv';
import { _GeoJSONLoader as GeoJSONLoader } from '@loaders.gl/json';
import { load } from '@loaders.gl/core';
import type {
	Feature,
	Geometry,
	FeatureCollection,
	GeoJsonProperties,
} from 'geojson';
import type { Color, PickingInfo, MapViewState } from '@deck.gl/core';
import type { DataFilterExtensionProps } from '@deck.gl/extensions';
import RangeSlider from './RangeSlider/RangeSlider';
import './index.css';
// Source data GeoJSON
const DATA_URL =
	'https://kumiko-haraguchi.github.io/data-store/flood/floodArchive.geojson';

const ambientLight = new AmbientLight({
	color: [255, 255, 255],
	intensity: 1.0,
});
const pointLight1 = new PointLight({
	color: [255, 255, 255],
	intensity: 0.8,
	position: [-0.144528, 49.739968, 80000],
});
const pointLight2 = new PointLight({
	color: [255, 255, 255],
	intensity: 0.8,
	position: [-3.807751, 54.104682, 8000],
});
const lightingEffect = new LightingEffect({
	ambientLight,
	pointLight1,
	pointLight2,
});

// This is only needed for this particular dataset - the default view assumes
// that the furthest geometries are on the ground. Because we are drawing the
// circles at the depth of the Floods, i.e. below sea level, we need to
// push the far plane away to avoid clipping them.
const MAP_VIEW = new MapView({
	repeat: true,
	// 1 is the distance between the camera and the ground
	farZMultiplier: 100,
});

const INITIAL_VIEW_STATE: MapViewState = {
	longitude: 137.74,
	latitude: 35.65,
	zoom: 4,
	// minZoom: 5,
	// maxZoom: 15,
	// pitch: 60,
	// bearing: -27
};

const COLOR_RANGE: Color[] = [
	[239, 243, 255],
	[198, 219, 239],
	[158, 202, 225],
	[107, 174, 214],
	[49, 130, 189],
	[8, 81, 156],
];
const generateFillColor = (f: Feature<Geometry, PropertiesType>) => {
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

const MAP_STYLE =
	'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json';
// const MAP_STYLE =
//   'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json';

type PropertiesType = {
	ID: number;
	Country: string;
	Area: number;
	Began: string;
	Ended: string;
	Date: number;
	Dead: number;
	Displaced: number;
	MainCause: string;
	timestamp: number;
};

const dataFilter = new DataFilterExtension({
	filterSize: 1,
	// Enable for higher precision, e.g. 1 second granularity
	// See DataFilterExtension documentation for how to pick precision
	fp64: false,
});

function formatLabel(timestamp: number) {
	return new Date(timestamp).toLocaleDateString('en-US', {
		year: 'numeric',
		month: '2-digit',
	});
}

function getTimeRange(
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

function getTooltip({
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

export default function App({
	data,
	mapStyle = MAP_STYLE,
}: {
	data?: FeatureCollection<Geometry, GeoJsonProperties>;
	mapStyle?: string;
}) {
	const [filter, setFilter] = useState<[start: number, end: number] | null>(
		null,
	);

	const timeRange = useMemo(() => getTimeRange(data?.features), [data]);
	const filterValue = filter || timeRange;

	const layers = [
		filterValue &&
			new GeoJsonLayer<GeoJsonProperties>({
				id: 'floods',
				data,
				stroked: true,
				filled: true,
				pickable: true,
				getFillColor: (f: Feature<Geometry, PropertiesType>) =>
					generateFillColor(f),
				getPosition: (f: Feature<Geometry, PropertiesType>) =>
					f.geometry?.coordinates,
				getPointRadius: (f: Feature<Geometry, PropertiesType>) =>
					Math.sqrt(f.properties.Area) * 100,
				getFilterValue: (f: Feature<Geometry, PropertiesType>) =>
					f.properties.timestamp,
				filterRange: [filterValue[0], filterValue[1]],
				filterSoftRange: [
					filterValue[0] * 0.9 + filterValue[1] * 0.1,
					filterValue[0] * 0.1 + filterValue[1] * 0.9,
				],
				extensions: [dataFilter],
			}),
	];

	return (
		<>
			<DeckGL
				views={MAP_VIEW}
				layers={layers}
				effects={[lightingEffect]}
				initialViewState={INITIAL_VIEW_STATE}
				controller={true}
				getTooltip={getTooltip}
			>
				<Map reuseMaps mapStyle={mapStyle} />
			</DeckGL>
			{timeRange && (
				<RangeSlider
					min={timeRange[0]}
					max={timeRange[1]}
					// @ts-ignore
					value={filterValue}
					formatLabel={formatLabel}
					onChange={setFilter}
				/>
			)}
		</>
	);
}

export async function renderToDOM(container: HTMLDivElement) {
	const root = createRoot(container);
	root.render(<App />);

	const featureCollection = await load(DATA_URL, GeoJSONLoader);
	root.render(<App data={featureCollection} />);
}
