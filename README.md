# 🌀 Flood Archive Visualization 🗺️

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

- **React** - UI framework
- **TypeScript** - Type-safe JavaScript
- **deck.gl** - WebGL-powered visualization framework
- **MapLibre GL** - Open-source map rendering
- **Jotai** - State management
- **Ant Design** - UI components

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/flood-archive-vis.git
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

```
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
http://floodobservatory.colorado.edu/Archives/ (Accessed 1 October 2016).

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run format` - Format code with Prettier
- `npm run lint` - Lint code with ESLint
- `npm run typecheck` - Type-check with TypeScript

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file
for details.
