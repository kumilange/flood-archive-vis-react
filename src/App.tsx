import React, { useCallback, useEffect, useRef, useState } from 'react';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import { DataFilterExtension } from '@deck.gl/extensions';
// @ts-ignore
import type { PickingInfo } from '@deck.gl/core';
import type { Feature, Geometry } from 'geojson';
// import {
// 	CompassWidget,
// 	ZoomWidget,
// 	FullscreenWidget,
// 	DarkGlassTheme,
// 	LightGlassTheme
// } from '@deck.gl/widgets';
// import '@deck.gl/widgets/stylesheet.css';
import MapLibre from 'react-map-gl/maplibre';
// import Map, { NavigationControl } from 'react-map-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import data from './output.json';

// Convert dates to timestamps

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
};

const FILL_COLORS = [
	[230, 250, 250],
	[193, 229, 230],
	[157, 208, 212],
	[117, 187, 193],
	[75, 167, 175],
	[0, 147, 156],
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
	return FILL_COLORS[index];
};

function App() {
	const counterRef = useRef(1985);
	const [selectedYear, setSelectedYear] = useState(1985);
	const [hoveredObject, setHoveredObject] =
		useState<PickingInfo<PropertiesType>>(null);

	const onHover = useCallback(({ object }: PickingInfo<PropertiesType>) => {
		setHoveredObject(object);
	}, []);

	const layer = new GeoJsonLayer<PropertiesType>({
		id: 'GeoJsonLayerLayer',
		data: data,
		// stroked: true,
		filled: true,
		getFillColor: (f: Feature<Geometry, PropertiesType>) =>
			f.properties.ID === hoveredObject?.properties?.ID
				? [255, 255, 255]
				: generateFillColor(f),
		getPointRadius: (f: Feature<Geometry, PropertiesType>) =>
			Math.sqrt(f.properties.Area) * 100,
		// getLineColor: [255, 255, 255],
		// getText: (f: Feature<Geometry, PropertiesType>) => f.properties.MainCause,
		// getTextSize: 12,
		// getLineWidth: 20,
		pickable: true,
		// onHover: onHover,
		extensions: [new DataFilterExtension({ filterSize: 1 })],
		getFilterValue: (f: Feature<Geometry, PropertiesType>) => [
			f.properties.Date,
		],
		filterRange: [Date.UTC(selectedYear, 0, 1), Date.UTC(selectedYear, 11, 31)],
		filterTransformColor: true,
	});

	const getTooltip = useCallback(({ object }: PickingInfo<PropertiesType>) => {
		return object && object.properties && `Death : ${object.properties.Dead}`;
	}, []);

	return (
		<>
			<DeckGL
				initialViewState={{
					longitude: 63.74,
					latitude: 32.65,
					zoom: 2,
				}}
				controller
				getTooltip={getTooltip}
				layers={[layer]}
			>
				<MapLibre mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json" />
				{/* <MapLibre mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json" /> */}
			</DeckGL>
			<div style={{ position: 'fixed' }}>
				{/* <h2 style={{ color: "white" }}>{selectedYear}</h2> */}
				<h2>{selectedYear}</h2>
				<select
					value={selectedYear}
					onChange={(e) => setSelectedYear(parseInt(e.target.value))}
				>
					{Array.from({ length: 37 }, (_, i) => (
						<option key={i} value={1985 + i}>
							{1985 + i}
						</option>
					))}
				</select>
			</div>
		</>
	);
}

export default App;
