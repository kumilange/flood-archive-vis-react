# 🌀 Flood Archive Visualization 🗺️

[![Flood Archive Vis](https://github.com/kumilange/flood-archive-vis/assets/28984604/d8265cf0-8556-433f-a387-4ae649910687)](https://github.com/kumilange/flood-archive-vis/assets/28984604/d8265cf0-8556-433f-a387-4ae649910687)

This project visualizes the Global Active Archive of Large Flood Events data
from 1985-2021, using interactive maps and time-based filtering to explore
historical flood events around the world.

## Features

- Interactive map visualization of global flood events
- Time-based filtering with animation capabilities
- Geographic area selection for focused exploration
- Color-coded visualization based on death toll
- Detailed tooltips with flood event information

## Technologies Used

- **React** - UI framework [React Documentation](https://reactjs.org/)
- **TypeScript** - Type-safe JavaScript
  [TypeScript Documentation](https://www.typescriptlang.org/)
- **deck.gl** - WebGL-powered visualization framework
  [deck.gl Documentation](https://deck.gl/)
- **MapLibre GL** - Open-source map rendering
  [MapLibre GL Documentation](https://maplibre.org/)
- **Jotai** - State management [Jotai Documentation](https://jotai.org/)
- **Ant Design** - UI components [Ant Design Documentation](https://ant.design/)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/kumilange/flood-archive-vis.git
   cd flood-archive-vis
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```text
flood-archive-vis/
├── src/                 # Source code
│   ├── assets/          # Image assets
│   │   └── icons/       # Icon assets
│   ├── components/      # React components
│   │   ├── AreaSelect/  # Geographic area selection
│   │   ├── Legend/      # Map legend component
│   │   └── RangeSlider/ # Time range slider
│   ├── styles/          # Global styles
│   ├── App.tsx          # Main application component
│   ├── atoms.ts         # Jotai state atoms
│   ├── constants.ts     # Application constants
│   └── utils.ts         # Utility functions
├── .eslintrc.cjs        # ESLint configuration
├── .prettierrc.json     # Prettier configuration
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## Data Source

This application uses data from the
[Dartmouth Flood Observatory](https://floodobservatory.colorado.edu/),
University of Colorado, maintained by G.R. Brakenridge. The Global Active
Archive of Large Flood Events documents major flood events worldwide from 1985
to the present.

**Citation:** G.R. Brakenridge. Global Active Archive of Large Flood Events.
Dartmouth Flood Observatory, University of Colorado, USA.
[http://floodobservatory.colorado.edu/Archives/](http://floodobservatory.colorado.edu/Archives/)

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run format` - Format code with Prettier
- `npm run lint` - Lint code with ESLint
- `npm run typecheck` - Type-check with TypeScript
