import React, { useCallback } from 'react';
import { Select } from 'antd';
import { FlyToInterpolator } from '@deck.gl/core';
import { WebMercatorViewport } from 'viewport-mercator-project';
import { useAtom, useSetAtom } from 'jotai';
import { initialBoundsAtom, initialViewAtom } from '../../atoms';
import { AREAS } from '../../constants';
import { AREA_SELECT_OPTIONS } from './constants';
import './ant-select.css';

export default function AreaSelect() {
	const [viewAtom, setViewAtom] = useAtom(initialViewAtom);
	const setBoundsAtom = useSetAtom(initialBoundsAtom);

	const fitBoundsToViewport = useCallback(
		(bounds: [[number, number], [number, number]]) => {
			const { innerWidth, innerHeight } = window;
			const viewport = new WebMercatorViewport({
				width: innerWidth,
				height: innerHeight,
				...viewAtom,
			});

			return viewport.fitBounds(bounds, { padding: 20 });
		},
		[viewAtom],
	);

	const handleFlyToArea = useCallback(
		(value: string) => {
			const boundbox = AREAS[value].boundary;
			const newViewState = fitBoundsToViewport(boundbox);

			setViewAtom({
				...newViewState,
				transitionInterpolator: new FlyToInterpolator({ speed: 10 }),
				transitionDuration: 'auto',
			});

			setBoundsAtom(boundbox);
		},
		[setViewAtom, setBoundsAtom, fitBoundsToViewport],
	);

	return (
		<Select
			defaultValue="all"
			style={{ width: 150 }}
			onChange={handleFlyToArea}
			options={AREA_SELECT_OPTIONS}
		/>
	);
}
