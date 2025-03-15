import { atom } from 'jotai';
import { AREAS, INITIAL_VIEW_STATE } from './constants';
import { FlyToInterpolator } from '@deck.gl/core';

// Updated ViewStateType to match deck.gl v9 requirements
type ViewStateType = {
	longitude: number;
	latitude: number;
	zoom: number;
	pitch?: number;
	bearing?: number;
	minZoom?: number;
	maxZoom?: number;
	minPitch?: number;
	maxPitch?: number;
	transitionInterpolator?: FlyToInterpolator;
	transitionDuration?: number | 'auto';
};

export type BoundsType = [[number, number], [number, number]];

export const initialViewAtom = atom<ViewStateType>(INITIAL_VIEW_STATE);
export const initialBoundsAtom = atom<BoundsType>(AREAS.all.boundary);
