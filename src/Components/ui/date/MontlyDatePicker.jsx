import React, { useState, useEffect } from "react";
import { format, parse } from "date-fns";

const MonthYearPicker = ({ name, value, onChange, maxDate, titleClassName }) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // 1-12
  const maxYear = maxDate ? maxDate.getFullYear() : currentYear;
  const maxMonth = maxDate && maxDate.getFullYear() === currentYear ? maxDate.getMonth() + 1 : 12;

  // Initialize month and year from value (Date object)
  const [month, setMonth] = useState(value ? value.getMonth() + 1 : currentMonth);
  const [year, setYear] = useState(value ? value.getFullYear() : currentYear);

  // Generate month and year options
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const years = Array.from({ length: maxYear - 2020 + 1 }, (_, i) => 2020 + i);

  // Handle month/year change
  const handleChange = (newMonth, newYear) => {
    // Restrict future months if the year is the max year
    if (newYear === maxYear && newMonth > maxMonth) {
      return;
    }

    const newDate = parse(`${newYear}-${newMonth}`, "yyyy-M", new Date());
    setMonth(newMonth);
    setYear(newYear);
    onChange(newDate);
  };

  // Update internal state if value prop changes
  useEffect(() => {
    if (value) {
      setMonth(value.getMonth() + 1);
      setYear(value.getFullYear());
    }
  }, [value]);

  return (
    <div className="flex flex-col">
      <label className={`block text-sm font-medium ${titleClassName || "text-slate-500"} mb-1`}>
        Select Month and Year
      </label>
      <div className="flex gap-4">
        <select
          name={`${name}-month`}
          value={month}
          onChange={(e) => handleChange(parseInt(e.target.value), year)}
          className="w-1/2 px-4 py-2 border border-slate-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-slate-900"
          aria-label="Select month"
        >
          {months.map((m) => (
            <option key={m.value} value={m.value} disabled={year === maxYear && m.value > maxMonth}>
              {m.label}
            </option>
          ))}
        </select>
        <select
          name={`${name}-year`}
          value={year}
          onChange={(e) => handleChange(month, parseInt(e.target.value))}
          className="w-1/2 px-4 py-2 border border-slate-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-slate-900"
          aria-label="Select year"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default MonthYearPicker;