import React, { useState, useMemo, useEffect } from 'react';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { format, parse, isValid, startOfDay } from 'date-fns';

const generateUniqueName = () => `datePicker_${Math.random().toString(36).substr(2, 9)}`;

const DatePicker = ({ name = 'datePicker', title, value, onChange, maxDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showYearSelect, setShowYearSelect] = useState(false);
  const [showMonthSelect, setShowMonthSelect] = useState(false);
  const [currentYear, setCurrentYear] = useState(() => (value ? value.getFullYear() : new Date().getFullYear()));
  const [currentMonthIndex, setCurrentMonthIndex] = useState(() => (value ? value.getMonth() : new Date().getMonth()));

  const inputName = useMemo(() => name || generateUniqueName(), [name]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonthIndex, 1).getDay();

  // Sync with value prop
  useEffect(() => {
    if (value && isValid(value)) {
      setCurrentYear(value.getFullYear());
      setCurrentMonthIndex(value.getMonth());
    }
  }, [value]);

  const handlePrevMonth = () => {
    setCurrentMonthIndex((prev) => {
      if (prev === 0) {
        setCurrentYear((year) => year - 1);
        return 11;
      }
      return prev - 1;
    });
    setShowMonthSelect(false);
    setShowYearSelect(false);
  };

  const handleNextMonth = () => {
    setCurrentMonthIndex((prev) => {
      if (prev === 11) {
        setCurrentYear((year) => year + 1);
        return 0;
      }
      return prev + 1;
    });
    setShowMonthSelect(false);
    setShowYearSelect(false);
  };

  const handleYearSelect = (year) => {
    setCurrentYear(year);
    setShowYearSelect(false);
  };

  const handleMonthSelect = (index) => {
    setCurrentMonthIndex(index);
    setShowMonthSelect(false);
  };

  const handleDateSelect = (day) => {
    const newDate = startOfDay(new Date(currentYear, currentMonthIndex, day));
    if (maxDate && newDate > maxDate) {
      return; // Prevent selecting future dates
    }
    setIsOpen(false);
    if (onChange) {
      onChange(newDate);
    }
  };

  // Display date in DD/MM/YYYY for UI
  const displayDate = value && isValid(value) ? format(value, 'dd/MM/yyyy') : 'Select a date';

  return (
    <div className="relative w-full">
      {title && (
        <div>
          <p className="block text-sm font-medium text-slate-700 mb-1">{title}</p>
        </div>
      )}
      <div
        className="w-full flex items-center justify-between p-3 bg-white text-slate-700 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-700 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-slate-500">{displayDate}</span>
        <CalendarIcon size={20} className="text-teal-700" />
      </div>
      <input type="hidden" name={inputName} value={value ? format(value, 'yyyy-MM-dd') : ''} />
      {isOpen && (
        <div className="w-full absolute z-10 mt-2 bg-white border border-slate-300 rounded-lg shadow-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <button
                className="p-1 text-slate-700 hover:bg-teal-100 rounded"
                onClick={() => {
                  setShowMonthSelect(true);
                  setShowYearSelect(false);
                }}
              >
                {months[currentMonthIndex]}
              </button>
              <button
                className="p-1 text-slate-700 hover:bg-teal-100 rounded"
                onClick={() => {
                  setShowYearSelect(true);
                  setShowMonthSelect(false);
                }}
              >
                {currentYear}
              </button>
            </div>
            <div className="flex space-x-2">
              <button onClick={handlePrevMonth} className="p-1 text-slate-700 hover:bg-teal-100 rounded">
                <ChevronLeftIcon size={20} />
              </button>
              <button onClick={handleNextMonth} className="p-1 text-slate-700 hover:bg-teal-100 rounded">
                <ChevronRightIcon size={20} />
              </button>
            </div>
          </div>

          {showYearSelect && (
            <div className="grid grid-cols-4 gap-2 mb-4 max-h-48 overflow-y-auto">
              {Array.from({ length: 100 }, (_, i) => currentYear - 50 + i).map((year) => (
                <button
                  key={year}
                  className="p-2 text-slate-700 hover:bg-teal-100 rounded"
                  onClick={() => handleYearSelect(year)}
                >
                  {year}
                </button>
              ))}
            </div>
          )}

          {showMonthSelect && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              {months.map((month, index) => (
                <button
                  key={month}
                  className="p-2 text-slate-700 hover:bg-teal-100 rounded"
                  onClick={() => handleMonthSelect(index)}
                >
                  {month}
                </button>
              ))}
            </div>
          )}

          {!showYearSelect && !showMonthSelect && (
            <div className="grid grid-cols-7 gap-1">
              {days.map((day) => (
                <div key={day} className="text-center font-semibold text-sm text-slate-700">
                  {day}
                </div>
              ))}
              {Array.from({ length: firstDay }, (_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const dayDate = new Date(currentYear, currentMonthIndex, day);
                const isSelected = value && isValid(value) && value.getTime() === dayDate.getTime();
                const isDisabled = maxDate && dayDate > maxDate;
                return (
                  <button
                    key={day}
                    className={`text-center p-2 rounded-full ${
                      isSelected ? 'bg-teal-700 text-white' : isDisabled ? 'text-slate-400 cursor-not-allowed' : 'text-slate-700 hover:bg-teal-100'
                    }`}
                    onClick={() => handleDateSelect(day)}
                    disabled={isDisabled}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DatePicker;