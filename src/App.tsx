import React, { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import Map, { AttributionControl } from 'react-map-gl/maplibre';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import { _GeoJSONLoader as GeoJSONLoader } from '@loaders.gl/json';
import { load } from '@loaders.gl/core';
import type { Feature, Geometry } from 'geojson';
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
import { DataSet } from '@deck.gl/core/lib/layer';

export default function App({
	data,
}: {
	data?: Feature<Geometry, PropertiesType>[];
}) {
	const viewAtom = useAtomValue(initialViewAtom);
	const [filter, setFilter] = useState<[start: number, end: number]>();
	const timeRange = useMemo(() => getTimeRange(data), [data]);
	const filterValue = filter || timeRange;

	const layers = useMemo(
		() => [
			data &&
			filterValue &&
			new GeoJsonLayer<PropertiesType>({
				id: 'floods',
				data: data as DataSet<PropertiesType>,
				filled: true,
				pickable: true,
				// @ts-expect-error: deck.gl's type is incorrect
				getFillColor: (f: Feature<Geometry, PropertiesType>) =>
					generateFillColor(f),
				getPosition: (f: Feature<Geometry, PropertiesType>) =>
					// @ts-expect-error: deck.gl's type is incorrect
					f.geometry?.coordinates,
				// @ts-expect-error: deck.gl's type is incorrect
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
		],
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
				views={[MAP_VIEW]}
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

			{timeRange && (
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

export async function renderToDOM(container: HTMLDivElement) {
	const root = createRoot(container);
	const { features } = await load(DATA_URL, GeoJSONLoader);

	root.render(<App data={features} />);
}
