import DeckGL from '@deck.gl/react';
import { load } from '@loaders.gl/core';
import { _GeoJSONLoader as GeoJSONLoader } from '@loaders.gl/json';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { useAtomValue } from 'jotai';
import { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import Map, { AttributionControl } from 'react-map-gl/maplibre';

import styles from './App.module.scss';
import { initialViewStateAtom } from './atoms';
import AreaSelect from './components/AreaSelect';
import Legend from './components/Legend';
import RangeSlider from './components/RangeSlider';
import { DATA_URL, MAP_STYLE, MAP_VIEW } from './constants';
import {
	createFloodLayer,
	formatLabel,
	getCursor,
	getTimeRange,
	getTooltip,
} from './utils';

import 'maplibre-gl/dist/maplibre-gl.css';
import './styles/reset.css';
import './styles/index.css';
import './styles/maplibregl.css';

type AppProps = {
	data: FeatureCollection<Geometry, GeoJsonProperties>;
};

/**
 * Main application component for flood visualization
 */
export default function App({ data }: AppProps) {
	const viewState = useAtomValue(initialViewStateAtom);
	const [filter, setFilter] = useState<[start: number, end: number]>();
	const timeRange = useMemo(() => getTimeRange(data.features), [data]);
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
				<AreaSelect />
			</div>
			<DeckGL
				views={MAP_VIEW}
				layers={layers}
				initialViewState={viewState}
				controller={true}
				getTooltip={getTooltip}
				getCursor={getCursor}
			>
				<Map reuseMaps mapStyle={MAP_STYLE} attributionControl={false}>
					<AttributionControl customAttribution="G.R. Brakenridge. Global Active Archive of Large Flood Events. Dartmouth Flood Observatory, University of Colorado, USA." />
				</Map>
			</DeckGL>

			<Legend />

			<div className={styles.slider}>
				<RangeSlider
					min={timeRange[0]}
					max={timeRange[1]}
					value={filterValue}
					formatLabel={formatLabel}
					onChange={setFilter}
				/>
			</div>
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
			<div className={styles.error} role="alert" aria-live="assertive">
				Error loading flood data. Please try again later.
			</div>,
		);
	}
}
