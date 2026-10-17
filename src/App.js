import { useEffect, useMemo, useState } from "react";
import * as d3 from "d3";
import "./App.css";
import { DATA_URL, parseRow, groupByMonth } from "./data";
import {
  TEMP_TYPES,
  DEFAULT_TEMP_TYPE,
  LEVEL2_YEAR_COUNT,
  LEVEL1_SLOT,
  LEVEL2_SLOT,
  TOOLTIP_OFFSET,
} from "./config";
import Heatmap from "./Heatmap";

// buttons for level 1 and 2 
const LEVELS = [
  { id: 1, label: "Level 1" },
  { id: 2, label: "Level 2" },
];

function App() {

  // *** State variables to store
  const [months, setMonths] = useState([]); // one record per year, month
  const [level, setLevel] = useState(LEVELS[0].id); // heatmap to be shown
  const [tempType, setTempType] = useState(DEFAULT_TEMP_TYPE); // which value colors the cells
  const [tooltip, setTooltip] = useState(null); // { x, y, text } or null

  // *** Controller
  useEffect(() => {
    let cancelled = false; 
    d3.csv(DATA_URL, parseRow).then((rows) => {
      if (!cancelled) setMonths(groupByMonth(rows));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Year range from the requirements from git
  const [firstYear, lastYear] = useMemo(
    () => d3.extent(months, (monthRecord) => monthRecord.year),
    [months]
  );

  // Level 2 subset with last LEVEL2_YEAR_COUNT years
  const recentMonths = useMemo(
    () => months.filter((monthRecord) => monthRecord.year > lastYear - LEVEL2_YEAR_COUNT),
    [months, lastYear]
  );
  const recentFirstYear = d3.min(recentMonths, (monthRecord) => monthRecord.year);

  // Show the tooltip next to the pointer with the cell's date and values
  const showTooltip = (event, monthRecord) =>
    setTooltip({
      x: event.clientX + TOOLTIP_OFFSET,
      y: event.clientY + TOOLTIP_OFFSET,
      text: `Date: ${monthRecord.key}; max: ${monthRecord.max} min: ${monthRecord.min}`,
    });

  const hideTooltip = () => setTooltip(null);

  // Word for headings for the selected temperature type 
  const tempTypeLabel = TEMP_TYPES.find((type) => type.id === tempType).longLabel;

  // *** View starts
  if (months.length === 0) return <p className="loading">Loading data…</p>;

  return (
    <div className="app">
      <h1>Assignment 1: Hong Kong's Monthly Temperature</h1>

      {/* Buttons to choose level1 or level2 */}
      <div className="controls">
        {LEVELS.map(({ id, label }) => (
          <button
            key={id}
            className={`level-button${level === id ? " active" : ""}`}
            aria-pressed={level === id}
            onClick={() => setLevel(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Level 1 */}
      {level === 1 && (
        <section>
          <h2>
            Level 1: Year/Month Heatmap ({firstYear}–{lastYear}), colored by monthly{" "}
            {tempTypeLabel}
          </h2>
          <Heatmap
            months={months}
            slotWidth={LEVEL1_SLOT.width}
            slotHeight={LEVEL1_SLOT.height}
            tempType={tempType}
            onTempTypeChange={setTempType}
            onCellHover={showTooltip}
            onCellLeave={hideTooltip}
          />
        </section>
      )}

      {/* Level 2 */}
      {level === 2 && (
        <section>
          <h2>
            Level 2: Daily Temperature Detail ({recentFirstYear}–{lastYear}), colored by
            monthly {tempTypeLabel}
          </h2>
          <p className="line-key">
            Lines inside each cell: <span className="key-max">daily max</span>,{" "}
            <span className="key-min">daily min</span>
          </p>
          <Heatmap
            months={recentMonths}
            slotWidth={LEVEL2_SLOT.width}
            slotHeight={LEVEL2_SLOT.height}
            showDailyLines
            tempType={tempType}
            onTempTypeChange={setTempType}
            onCellHover={showTooltip}
            onCellLeave={hideTooltip}
          />
        </section>
      )}

      {/* Tooltip */}
      {tooltip && (
        <div className="tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
          {tooltip.text}
        </div>
      )}
    </div>
  );
}

export default App;
