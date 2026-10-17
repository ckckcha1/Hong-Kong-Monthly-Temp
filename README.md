# Hong Kong Temperature Heatmap

CSCE 679 Data Visualization: year/month heatmap of Hong Kong's daily temperature data, built with React and D3

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (includes npm)

### Install and run

```bash
npm install
npm start
```

## Project Structure

```
src/
├── App.js               # Top-level component: loads data, holds shared state, switches levels, shows the tooltip
├── Heatmap.js           # Year × month matrix: scales, axes, cells, and Level 2 mini line charts
├── Legend.js            # Color legend (color boxes and end labels)
├── TempTypeFilter.js    # Max/min radio filter shown under the legend
├── data.js              # Loads, parses, and groups the CSV into monthly records
├── config.js            # All shared settings: sizes, colors, temperature types, year count
├── App.css              # Styles, with shared colors defined as CSS variables
└── temperature_daily.csv
```

## Built With

- [React](https://react.dev/)
- [D3.js](https://d3js.org/) 
- [Create React App](https://create-react-app.dev/)