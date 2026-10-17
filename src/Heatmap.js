import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import {
  colorScale,
  MONTH_NAMES,
  DAY_DOMAIN,
  DEFAULT_TEMP_TYPE,
  MARGIN,
  LEGEND_GAP,
  CELL_PADDING,
  LINE_PADDING,
} from "./config";
import Legend from "./Legend";

// Year × month matrix
// Each cell is one month of one year, colored by the monthly maximum or minimum temperature
// and draws a mini line chart of the daily max/min inside each cell 
function Heatmap({
  months,
  slotWidth,
  slotHeight,
  showDailyLines = false, // draw a mini line chart of daily max/min in each cell
  tempType = DEFAULT_TEMP_TYPE,
  onTempTypeChange,
  onCellHover,
  onCellLeave,
}) {
  // Matrix scales 

  // Every year in the data
  const years = useMemo(() => {
    const [firstYear, lastYear] = d3.extent(months, (monthRecord) => monthRecord.year);
    return d3.range(firstYear, lastYear + 1);
  }, [months]);

  // Month indices
  const monthIndices = useMemo(() => d3.range(MONTH_NAMES.length), []);

  const innerWidth = years.length * slotWidth;
  const innerHeight = monthIndices.length * slotHeight;

  // Band scales map a year,month to row, column
  const xScale = useMemo(
    () => d3.scaleBand().domain(years).range([0, innerWidth]).padding(CELL_PADDING),
    [years, innerWidth]
  );
  const yScale = useMemo(
    () => d3.scaleBand().domain(monthIndices).range([0, innerHeight]).padding(CELL_PADDING),
    [monthIndices, innerHeight]
  );

  // Size of the colored cell itself
  const cellWidth = xScale.bandwidth();
  const cellHeight = yScale.bandwidth();

  // Mini line charts 

  // x is day of month, inside the cell with padding on each side
  const dayScale = useMemo(
    () => d3.scaleLinear().domain(DAY_DOMAIN).range([LINE_PADDING, cellWidth - LINE_PADDING]),
    [cellWidth]
  );

  // y is temperature
  const dailyTempScale = useMemo(() => {
    const allDays = months.flatMap((monthRecord) => monthRecord.days);
    const lowestTemp = d3.min(allDays, (day) => day.min);
    const highestTemp = d3.max(allDays, (day) => day.max);
    return d3
      .scaleLinear()
      .domain([lowestTemp, highestTemp])
      .range([cellHeight - LINE_PADDING, LINE_PADDING]);
  }, [months, cellHeight]);

  // Path generators making d3.line() turns an array of days into an SVG path string
  const maxLine = useMemo(
    () => d3.line().x((day) => dayScale(day.day)).y((day) => dailyTempScale(day.max)),
    [dayScale, dailyTempScale]
  );
  const minLine = useMemo(
    () => d3.line().x((day) => dayScale(day.day)).y((day) => dailyTempScale(day.min)),
    [dayScale, dailyTempScale]
  );

  // Axes 

  const xAxisRef = useRef(null);
  const yAxisRef = useRef(null);

  useEffect(() => {
    d3.select(xAxisRef.current).call(d3.axisTop(xScale));
    d3.select(yAxisRef.current).call(
      d3.axisLeft(yScale).tickFormat((monthIndex) => MONTH_NAMES[monthIndex])
    );
  }, [xScale, yScale]);


  const svgWidth = MARGIN.left + innerWidth + LEGEND_GAP + MARGIN.right;
  const svgHeight = MARGIN.top + innerHeight + MARGIN.bottom;

  return (
    <svg className="heatmap" width={svgWidth} height={svgHeight}>
      <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
        <g ref={xAxisRef} className="axis" />
        <g ref={yAxisRef} className="axis" />

        {/* One cell per month */}
        {months.map((monthRecord) => (
          <g
            key={monthRecord.key}
            transform={`translate(${xScale(monthRecord.year)},${yScale(monthRecord.month)})`}
            onMouseEnter={(event) => onCellHover(event, monthRecord)}
            onMouseMove={(event) => onCellHover(event, monthRecord)}
            onMouseLeave={onCellLeave}
          >
            {/* Cell color with monthly max or min, depending on tempType */}
            <rect
              className="cell"
              width={cellWidth}
              height={cellHeight}
              fill={colorScale(monthRecord[tempType])}
            />

            {/* Level 2 part with daily max and daily min lines */}
            {showDailyLines && (
              <>
                <path className="daily-line daily-max" d={maxLine(monthRecord.days)} />
                <path className="daily-line daily-min" d={minLine(monthRecord.days)} />
              </>
            )}
          </g>
        ))}

        {/* Legend at the right of the matrix */}
        <Legend
          x={innerWidth + LEGEND_GAP}
          y={0}
          tempType={tempType}
          onTempTypeChange={onTempTypeChange}
        />
      </g>
    </svg>
  );
}

export default Heatmap;