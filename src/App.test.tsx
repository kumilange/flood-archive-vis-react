import { render } from '@testing-library/react';
import App from './App';

describe('App', () => {
	// Renders a main element with a h1 child element
	it('should render a main element with a h1 child element', () => {
		// Arrange
		const { getByRole } = render(<App />);

		// Act
		const mainElement = getByRole('main');
		const h1Element = getByRole('heading', { level: 1 });

		// Assert
		expect(mainElement).toBeInTheDocument();
		expect(h1Element).toBeInTheDocument();
	});
});
