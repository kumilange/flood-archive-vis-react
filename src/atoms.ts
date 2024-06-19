import { atom } from 'jotai';
import { AREA_OPTIONS, INITIAL_VIEW_STATE } from './constants';

type ViewStateType = {
	longitude: number;
	latitude: number;
	zoom: number;
	transitionInterpolator?: any;
	transitionDuration?: string;
};

export const initialViewAtom = atom<ViewStateType>(INITIAL_VIEW_STATE);
export const initialBoundsAtom = atom(AREA_OPTIONS.all.boundary);
