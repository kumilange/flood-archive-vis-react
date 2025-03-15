import React, { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import Map, { AttributionControl } from 'react-map-gl/maplibre';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import { _GeoJSONLoader as GeoJSONLoader } from '@loaders.gl/json';
import { load } from '@loaders.gl/core';
import type {
	Feature,
	FeatureCollection,
	Geometry,
	GeoJsonProperties,
} from 'geojson';
import {
	formatLabel,
	generateFillColor,
	getCursor,
	getTimeRange,
	getTooltip,
} from './utils';
import { DATA_URL, MAP_STYLE, MAP_VIEW, DATA_FILTER } from './constants';
import RangeSlider from './components/RangeSlider';
import Legend from './components/Legend';
import AreaDropDown from './components/AreaSelect';
import { useAtomValue } from 'jotai';
import { initialViewAtom } from './atoms';
import 'maplibre-gl/dist/maplibre-gl.css';
import './styles/reset.css';
import './styles/index.css';
import './styles/maplibregl.css';
import styles from './App.module.scss';

/**
 * Type definition for flood properties
 */
interface FloodProperties {
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
}

interface AppProps {
	data?: FeatureCollection<Geometry, GeoJsonProperties>;
}

/**
 * Create a GeoJson layer for flood data visualization
 */
const createFloodLayer = (
	data: FeatureCollection<Geometry, GeoJsonProperties> | undefined,
	filterValue: [number, number],
) => {
	if (!data) return null;

	return new GeoJsonLayer({
		id: 'floods',
		data: data,
		filled: true,
		pickable: true,
		getFillColor: (f: Feature<Geometry, GeoJsonProperties>) => {
			// Safe type assertion since we know our data structure
			return generateFillColor(f);
		},
		getPointRadius: (f: Feature<Geometry, GeoJsonProperties>) => {
			const area = (f.properties?.Area as number) || 0;
			return Math.sqrt(area) * 100;
		},
		getFilterValue: (f: Feature<Geometry, GeoJsonProperties>) => {
			return f.properties?.timestamp as number;
		},
		filterRange: [filterValue[0], filterValue[1]],
		filterSoftRange: [
			filterValue[0] * 0.9 + filterValue[1] * 0.1,
			filterValue[0] * 0.1 + filterValue[1] * 0.9,
		],
		extensions: [DATA_FILTER],
	});
};

/**
 * Main application component for flood visualization
 */
export default function App({ data }: AppProps) {
	const viewAtom = useAtomValue(initialViewAtom);
	const [filter, setFilter] = useState<[start: number, end: number]>();
	const timeRange = useMemo(() => getTimeRange(data?.features), [data]);
	const filterValue = filter || timeRange;

	const layers = useMemo(
		() => [createFloodLayer(data, filterValue)],
		[data, filterValue],
	);

	return (
		<main>
			<div className={styles.wrapper}>
				<h1 className={styles.heading}>
					Global Active Archive of Large Flood Events, 1985-2021
				</h1>
				<AreaDropDown />
			</div>
			<DeckGL
				views={MAP_VIEW}
				layers={layers}
				initialViewState={viewAtom}
				controller={true}
				getTooltip={getTooltip}
				getCursor={getCursor}
			>
				<Map reuseMaps mapStyle={MAP_STYLE} attributionControl={false}>
					<AttributionControl customAttribution="G.R. Brakenridge. Global Active Archive of Large Flood Events. Dartmouth Flood Observatory, University of Colorado, USA." />
				</Map>
			</DeckGL>

			<Legend />

			{timeRange && timeRange[0] !== timeRange[1] && (
				<div className={styles.slider}>
					<RangeSlider
						min={timeRange[0]}
						max={timeRange[1]}
						value={filterValue}
						formatLabel={formatLabel}
						onChange={setFilter}
					/>
				</div>
			)}
		</main>
	);
}

/**
 * Render the application to the DOM
 */
export async function renderToDOM(container: HTMLDivElement) {
	const root = createRoot(container);
	try {
		const geojson = await load(DATA_URL, GeoJSONLoader, {
			json: {
				tableFormat: 'geojson',
			},
		});
		root.render(<App data={geojson} />);
	} catch (error) {
		console.error('Error loading data:', error);
		root.render(
			<div className={styles.error}>
				Error loading flood data. Please try again later.
			</div>,
		);
	}
}
