# Flood Archive Vis 🗺️

This app visualizes global flood events from 1985 to 2021, using time series
data from Dartmouth Flood Observatory, University of Colorado, USA.

[![Flood Archive Vis](https://github.com/kumilange/flood-archive-vis/assets/28984604/d8265cf0-8556-433f-a387-4ae649910687)](https://github.com/kumilange/flood-archive-vis/assets/28984604/d8265cf0-8556-433f-a387-4ae649910687)

<br>**Citation:** G.R. Brakenridge. Global Active Archive of Large Flood Events.
Dartmouth Flood Observatory, University of Colorado, USA.
http://floodobservatory.colorado.edu/Archives/ (Accessed 1 October 2016).

## Getting Started

### Prerequisites

- node > 14.18.0

### 1. Installing

```
git clone git@github.com:kumilange/flood-archive-vis.git
cd flood-archive-vis
npm install
```

### 2. Running dev server

```
npm run dev
```

👉 You'll see the visualization map on http://localhost:5173! 🗺

## Built With

- [React](https://facebook.github.io/react/) - UI Library
- [Ant Design](https://ant.design/) - Rich UI Component
- [Jotai](https://jotai.org/) - State Management
- [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) - Interactive Map
- [React Map GL](https://visgl.github.io/react-map-gl/) - React Wrapper for
  Mapbox GL JS
- [deck.gl](https://deck.gl/) - GPU-powered Advanced Data Visualization
- [Vercel](https://vercel.com/) - CI/CD
