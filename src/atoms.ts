import { atom } from 'jotai';
import { AREAS, INITIAL_VIEW_STATE } from './constants';

type ViewStateType = {
	longitude: number;
	latitude: number;
	zoom: number;
	transitionInterpolator?: any;
	transitionDuration?: string;
};

export const initialViewAtom = atom<ViewStateType>(INITIAL_VIEW_STATE);
export const initialBoundsAtom = atom(AREAS.all.boundary);
