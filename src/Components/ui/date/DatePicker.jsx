import React, { useCallback } from 'react';
import { Calendar } from 'lucide-react';

const DatePicker = ({
  type = 'date', // 'date' for single date (day-month-year), 'month' for range (month-year)
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  singleDate,
  onSingleDateChange,
  labelFrom = 'From Month',
  labelTo = 'To Month',
  labelSingle = 'Select Date',
}) => {
  const handleFromChange = useCallback(
    (e) => onFromDateChange(e.target.value),
    [onFromDateChange]
  );

  const handleToChange = useCallback(
    (e) => onToDateChange(e.target.value),
    [onToDateChange]
  );

  const handleSingleChange = useCallback(
    (e) => onSingleDateChange(e.target.value),
    [onSingleDateChange]
  );

  return (
    <div className="flex flex-col gap-4">
      {type === 'month' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="from-date" className="block mb-2 font-medium text-gray-700">
              {labelFrom}
            </label>
            <div className="flex items-center space-x-2">
              <Calendar className="text-gray-400" size={20} />
              <input
                id="from-date"
                type="month"
                value={fromDate || ''}
                onChange={handleFromChange}
                className="px-4 py-2 bg-white/70 backdrop-blur-md border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                aria-label={labelFrom}
                max={toDate || undefined}
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="to-date" className="block mb-2 font-medium text-gray-700">
              {labelTo}
            </label>
            <div className="flex items-center space-x-2">
              <Calendar className="text-gray-400" size={20} />
              <input
                id="to-date"
                type="month"
                value={toDate || ''}
                onChange={handleToChange}
                className="px-4 py-2 bg-white/70 backdrop-blur-md border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                aria-label={labelTo}
                min={fromDate || undefined}
                required
              />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <label htmlFor="single-date" className="block mb-2 font-medium text-gray-700">
            {labelSingle}
          </label>
          <div className="flex items-center space-x-2">
            <Calendar className="text-gray-400" size={20} />
            <input
              id="single-date"
              type="date"
              value={singleDate || ''}
              onChange={handleSingleChange}
              className="px-4 py-2 bg-white/70 backdrop-blur-md border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
              aria-label={labelSingle}
              required
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;