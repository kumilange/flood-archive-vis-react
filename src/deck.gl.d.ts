// deck.gl.d.ts
declare module '@deck.gl/react' {
	import { DeckProps } from '@deck.gl/core';
	import { CompositeLayerProps } from '@deck.gl/core/lib/composite-layer';
	import { FC } from 'react';

	export interface DeckGLProps extends DeckProps, CompositeLayerProps<any> {
		id?: string;
	}

	const DeckGL: FC<DeckGLProps>;

	export default DeckGL;
}

declare module '@deck.gl/core' {
	import { CompositeLayerProps } from '@deck.gl/core/lib/composite-layer';
	import { FC } from 'react';

	export interface DeckProps extends CompositeLayerProps<any> {
		id?: string;
	}

	const Deck: FC<DeckProps>;

	export default Deck;
}

declare module '@deck.gl/layers' {
	export class GeoJsonLayer<T> extends Layer<T> {
		constructor(props: T);
	}
}

declare module '@deck.gl/extensions' {
	export class DataFilterExtension {
		constructor(opts: { filterSize: number });
	}
}
