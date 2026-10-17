import * as d3 from "d3";

// Shared settings for the visualization


// Data
// Month names used for the y-axis labels (index 0 = January).
export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
export const DAY_DOMAIN = [1, 31];
export const LEVEL2_YEAR_COUNT = 10;

// Temperature types (max / min)
// Each id matches a field on the month records built by groupByMonth().
//   label: short text shown in the legend filter
//   longLabel: word used in the chart headings
export const TEMP_TYPES = [
  { id: "max", label: "Max temp", longLabel: "maximum" },
  { id: "min", label: "Min temp", longLabel: "minimum" },
];

export const DEFAULT_TEMP_TYPE = TEMP_TYPES[0].id;


// Color scale (shared by Heatmap and Legend)
// Temperature range covered by the color scale, and the unit shown in the legend.
export const TEMP_DOMAIN = [0, 40];
export const TEMP_UNIT = "Celsius";


const COLOR_STEP_COUNT = 11; // Number of colors in the scale
const SPECTRAL_COLD_TO_HOT = [...d3.schemeSpectral[COLOR_STEP_COUNT]].reverse();


export const colorScale = d3
  .scaleQuantize()
  .domain(TEMP_DOMAIN)
  .range(SPECTRAL_COLD_TO_HOT);


// Matrix layout (all sizes in px)
// Size of one matrix slot (cell + white gap) for each level.
export const LEVEL1_SLOT = { width: 40, height: 40 };
export const LEVEL2_SLOT = { width: 90, height: 70 };

// Space around the matrix, hard coded the value adjusting from what it's showing
export const MARGIN = { top: 30, right: 100, bottom: 30, left: 100 };
export const LEGEND_GAP = 30;
export const CELL_PADDING = 0.1;
export const LINE_PADDING = 10;


// Legend and max/min filter (sizes in px)
export const LEGEND_BOX_SIZE = 20; // Width and height of each color box in the legend.
export const LEGEND_LABEL_GAP = 5; // Space between a legend box and text label.
export const LEGEND_TOP_LABEL_DY = "0.8em";

// Filter by option of temp max to min, and min to max
export const FILTER_TITLE = "Color by";
export const FILTER_TOP_GAP = 30;
export const FILTER_OPTION_HEIGHT = 20;
export const FILTER_OPTION_WIDTH = 100;
export const RADIO_RADIUS = 5;

// Tooltip
export const TOOLTIP_OFFSET = 10; // offset distance from cursor