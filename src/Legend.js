import {
  colorScale,
  TEMP_DOMAIN,
  TEMP_UNIT,
  LEGEND_BOX_SIZE,
  LEGEND_LABEL_GAP,
  LEGEND_TOP_LABEL_DY,
  FILTER_TOP_GAP,
} from "./config";
import TempTypeFilter from "./TempTypeFilter";

// Color legend
// Rendered as an SVG 
//
// Props:
//   x, y: position of the top-left corner of the color bar
//   tempType, onTempTypeChange: passed through to TempTypeFilter
function Legend({ x, y, tempType, onTempTypeChange }) {
  const colors = colorScale.range();
  const [minTemp, maxTemp] = TEMP_DOMAIN;
  const barHeight = colors.length * LEGEND_BOX_SIZE;
  const labelX = LEGEND_BOX_SIZE + LEGEND_LABEL_GAP;

  return (
    <g className="legend" transform={`translate(${x},${y})`}>
      {/* Color boxes */}
      {colors.map((color, index) => (
        <rect
          key={color}
          y={index * LEGEND_BOX_SIZE}
          width={LEGEND_BOX_SIZE}
          height={LEGEND_BOX_SIZE}
          fill={color}
        />
      ))}

      {/* End labels being top of the first box and bottom of the last box */}
      <text className="legend-label" x={labelX} dy={LEGEND_TOP_LABEL_DY}>
        {minTemp} {TEMP_UNIT}
      </text>
      <text className="legend-label" x={labelX} y={barHeight}>
        {maxTemp} {TEMP_UNIT}
      </text>

      {/* Max/min filter under the color bar */}
      <TempTypeFilter
        y={barHeight + FILTER_TOP_GAP}
        tempType={tempType}
        onTempTypeChange={onTempTypeChange}
      />
    </g>
  );
}

export default Legend;