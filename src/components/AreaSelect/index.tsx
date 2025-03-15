import React, { useCallback } from 'react';
import { Select } from 'antd';
import { FlyToInterpolator } from '@deck.gl/core';
import { WebMercatorViewport } from 'viewport-mercator-project';
import { useAtom, useSetAtom } from 'jotai';
import { BoundsType, initialBoundsAtom, initialViewAtom } from '../../atoms';
import { AREAS } from '../../constants';
import { AREA_SELECT_OPTIONS } from './constants';
import './ant-select.css';

/**
 * AreaSelect component allows users to select and fly to predefined geographic areas
 */
export default function AreaSelect() {
	const [viewAtom, setViewAtom] = useAtom(initialViewAtom);
	const setBoundsAtom = useSetAtom(initialBoundsAtom);

	/**
	 * Calculate viewport settings to fit bounds
	 */
	const fitBoundsToViewport = useCallback(
		(bounds: BoundsType) => {
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

	/**
	 * Handle area selection change
	 */
	const handleFlyToArea = useCallback(
		(value: string) => {
			// Ensure the selected area exists in our config
			if (!AREAS[value]) {
				console.error(`Unknown area: ${value}`);
				return;
			}

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
			aria-label="Select geographic area"
		/>
	);
}
