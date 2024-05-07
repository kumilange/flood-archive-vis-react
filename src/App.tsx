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

export const colorRange: Color[] = [
	[1, 152, 189],
	[73, 227, 206],
	[216, 254, 181],
	[254, 237, 177],
	[254, 173, 84],
	[209, 55, 78],
];

const MAP_STYLE =
	'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json';
// const MAP_STYLE =
//   'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json';

const MS_PER_DAY = 8.64e7;

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
				// stroked: true,
				filled: true,
				// pointType: 'circle+text',
				pickable: true,
				// getFillColor: [160, 160, 180, 200],
				getFillColor: (f: Feature<Geometry, PropertiesType>) => {
					const r = Math.sqrt(f.properties.Dead);
					return [255 - r * 15, r * 5, r * 10];
				},
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
				// initialViewState={{
				//   longitude: -1.415727,
				//   latitude: 52.232395,
				//   zoom: 6.6,
				//   // minZoom: 5,
				//   // maxZoom: 15,
				//   pitch: 40.5,
				//   bearing: -27
				// }}
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
					animationSpeed={MS_PER_DAY * 10}
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

	// const data = (await load(DATA_URL, GeoJSONLoader)).features;

	// const floods = data.map((feature: any) => ({
	//   ...feature,
	//   // geometry: {
	//   //   ...feature.geometry,
	//   //   coordinates: [feature.geometry.coordinates[0], feature.geometry.coordinates[1], 400]
	//   // },
	//   properties: {
	//     ...feature.properties,
	//     timestamp: new Date(`${ feature.properties.Began } UTC`).getTime(),
	//     elevation: Math.sqrt(feature.properties.Dead) * 10
	//   }
	// }));

	const features = (await load(DATA_URL, GeoJSONLoader)).features;
	// const points: DataPoint[] = data.map(d => [d.long, d.lat]);
	const floods = features.map((feature: any) => {
		return {
			...feature,
			properties: {
				...feature.properties,
				timestamp: new Date(`${feature.properties.Began} UTC`).getTime(),
			},
		};
	});

	root.render(
		<App
			data={{
				type: 'FeatureCollection',
				features: floods,
			}}
		/>,
	);
}
