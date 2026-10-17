import * as d3 from "d3";
import csvUrl from "./temperature_daily.csv";

// Loading and preparing the temperature data

export const DATA_URL = csvUrl; // Path of temperature_daily.csv

const CSV_DATE_FORMAT = "%Y-%m-%d"; // Date format used in the CSV's "date" column
const parseDate = d3.timeParse(CSV_DATE_FORMAT);

// Parsing
// Row accessor for d3.csv: turns one CSV row (all strings) into a typed object.
export function parseRow(row) {
  const date = parseDate(row.date);
  return {
    date,
    year: date.getFullYear(),
    month: date.getMonth(), // 0 = January
    day: date.getDate(), // 1–31
    max: +row.max_temperature,
    min: +row.min_temperature,
  };
}

// Grouping by year-month

// Groups daily rows into one record per (year, month).
// Monthly max = highest daily max; monthly min = lowest daily min.
// `days` keeps the daily rows (sorted by day) for the Level 2 mini line charts.
export function groupByMonth(rows) {
  const yearGroups = d3.groups(rows, (row) => row.year, (row) => row.month);

  return yearGroups.flatMap(([year, monthGroups]) =>
    monthGroups.map(([month, dailyRows]) => ({
      key: `${year}-${String(month + 1).padStart(2, "0")}`, 
      year,
      month,
      max: d3.max(dailyRows, (row) => row.max),
      min: d3.min(dailyRows, (row) => row.min),
      days: [...dailyRows].sort((a, b) => a.day - b.day),
    }))
  );
}