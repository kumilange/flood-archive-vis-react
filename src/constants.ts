import { DataFilterExtension } from '@deck.gl/extensions';
import {
	MapView,
} from '@deck.gl/core';
import type { MapViewState } from '@deck.gl/core';

// Source data GeoJSON
export const DATA_URL =
	'https://kumiko-haraguchi.github.io/data-store/flood/floodArchive.geojson';

// This is only needed for this particular dataset - the default view assumes
// that the furthest geometries are on the ground. Because we are drawing the
// circles at the depth of the Floods, i.e. below sea level, we need to
// push the far plane away to avoid clipping them.
export const MAP_VIEW = new MapView({
	repeat: true,
	// 1 is the distance between the camera and the ground
	farZMultiplier: 100,
});

export const INITIAL_VIEW_STATE: MapViewState = {
	longitude: 137.74,
	latitude: 35.65,
	zoom: 4,
	// minZoom: 5,
	// maxZoom: 15,
	// pitch: 60,
	// bearing: -27
};

export const MAP_STYLE =
	'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json';
// 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json';

export const DATA_FILTER = new DataFilterExtension({
	filterSize: 1,
	// Enable for higher precision, e.g. 1 second granularity
	// See DataFilterExtension documentation for how to pick precision
	fp64: false,
});