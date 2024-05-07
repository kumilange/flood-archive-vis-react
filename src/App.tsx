import React, { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { Map } from 'react-map-gl/maplibre';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import { _GeoJSONLoader as GeoJSONLoader } from '@loaders.gl/json';
import { load } from '@loaders.gl/core';
import type {
	Feature,
	Geometry,
	FeatureCollection,
	GeoJsonProperties,
} from 'geojson';
import { formatLabel, generateFillColor, getTimeRange, getTooltip } from './utils';
import { DATA_URL, INITIAL_VIEW_STATE, MAP_STYLE, MAP_VIEW, DATA_FILTER } from './constants';
import RangeSlider from './RangeSlider/RangeSlider';
import './index.css';
import "maplibre-gl/dist/maplibre-gl.css";
import styles from "./App.module.scss";


export type PropertiesType = {
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
			extensions: [DATA_FILTER],
		}),
	];

	return (
		<main>
			<h1 className={styles.heading1}>Global Active Archive of Large Flood Events, 1985-2021</h1>
			<DeckGL
				views={MAP_VIEW}
				layers={layers}
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
		</main>
	);
}

export async function renderToDOM(container: HTMLDivElement) {
	const root = createRoot(container);
	root.render(<App />);

	const featureCollection = await load(DATA_URL, GeoJSONLoader);
	root.render(<App data={featureCollection} />);
}
