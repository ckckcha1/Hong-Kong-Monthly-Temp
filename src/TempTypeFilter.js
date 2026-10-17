import {
  TEMP_TYPES,
  FILTER_TITLE,
  FILTER_OPTION_HEIGHT,
  FILTER_OPTION_WIDTH,
  RADIO_RADIUS,
  LEGEND_BOX_SIZE,
  LEGEND_LABEL_GAP,
} from "./config";

// Radio style filter that chooses whether the heatmap cells are colored by monthly max or min temp
// Rendered as an SVG
//
// Props:
//   x, y: position of the filter heading's baseline
//   tempType: id of the selected temperature type ("max" or "min")
//   onTempTypeChange: (tempTypeId) => void, called when an option is picked
function TempTypeFilter({ x = 0, y = 0, tempType, onTempTypeChange }) {
  const radioCenterX = LEGEND_BOX_SIZE / 2;
  const labelX = LEGEND_BOX_SIZE + LEGEND_LABEL_GAP;

  const radioCenterY = -RADIO_RADIUS;
  const hitAreaY = RADIO_RADIUS - FILTER_OPTION_HEIGHT;

  return (
    <g
      className="temp-type-filter"
      transform={`translate(${x},${y})`}
      role="radiogroup"
      aria-label={FILTER_TITLE}
    >
      {/* Heading */}
      <text className="legend-label legend-title">{FILTER_TITLE}</text>

      {TEMP_TYPES.map(({ id, label }, index) => {
        const isSelected = tempType === id;
        const selectTempType = () => onTempTypeChange(id);

        // Let users pick an option with Enter or Space
        const handleKeyDown = (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            selectTempType();
          }
        };

        return (
          <g
            key={id}
            className="temp-option"
            transform={`translate(0,${(index + 1) * FILTER_OPTION_HEIGHT})`}
            role="radio"
            aria-checked={isSelected}
            tabIndex={0}
            onClick={selectTempType}
            onKeyDown={handleKeyDown}
          >
            <rect
              className="temp-option-hit"
              y={hitAreaY}
              width={FILTER_OPTION_WIDTH}
              height={FILTER_OPTION_HEIGHT}
            />

            {/* Radio circle */}
            <circle className="temp-radio" cx={radioCenterX} cy={radioCenterY} r={RADIO_RADIUS} />
            {isSelected && (
              <circle
                className="temp-radio-dot"
                cx={radioCenterX}
                cy={radioCenterY}
                r={RADIO_RADIUS / 2}
              />
            )}

            <text className="legend-label" x={labelX}>
              {label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export default TempTypeFilter;