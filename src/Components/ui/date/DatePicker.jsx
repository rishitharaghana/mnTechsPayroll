import React, { useState, useMemo, useEffect } from 'react';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { format, parse, isValid } from 'date-fns';

const generateUniqueName = () => `datePicker_${Math.random().toString(36).substr(2, 9)}`;

const DatePicker = ({ name = 'datePicker', title, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showYearSelect, setShowYearSelect] = useState(false);
  const [showMonthSelect, setShowMonthSelect] = useState(false);
  const [currentYear, setCurrentYear] = useState(() => {
    const date = new Date();
    const istDate = new Date(date.getTime() + 5.5 * 60 * 60 * 1000); // IST offset
    return istDate.getFullYear();
  });
  const [currentMonthIndex, setCurrentMonthIndex] = useState(() => {
    const date = new Date();
    const istDate = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
    return istDate.getMonth();
  });

  const inputName = useMemo(() => name || generateUniqueName(), [name]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonthIndex, 1).getDay();

  // Sync DatePicker with value prop from parent
  useEffect(() => {
    if (value && value !== 'Select a date') {
      try {
        const parsedDate = parse(value, 'yyyy-MM-dd', new Date());
        if (isValid(parsedDate)) {
          const istDate = new Date(parsedDate.getTime() + 5.5 * 60 * 60 * 1000);
          setCurrentYear(istDate.getFullYear());
          setCurrentMonthIndex(istDate.getMonth());
        } else {
          console.error('Invalid value prop:', value);
        }
      } catch (error) {
        console.error('Error parsing value prop:', value, error);
      }
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
    try {
      const dayStr = String(day).padStart(2, '0');
      const monthStr = String(currentMonthIndex + 1).padStart(2, '0');
      const dateStr = `${currentYear}-${monthStr}-${dayStr}`;
      const parsedDate = parse(dateStr, 'yyyy-MM-dd', new Date());
      if (!isValid(parsedDate)) {
        console.error('Invalid date selected:', dateStr);
        return;
      }
      const istDate = new Date(parsedDate.getTime() + 5.5 * 60 * 60 * 1000);
      const formattedDate = `${istDate.getFullYear()}-${String(istDate.getMonth() + 1).padStart(2, '0')}-${String(istDate.getDate()).padStart(2, '0')}`;
      
      setIsOpen(false); // Close calendar after selection
      if (onChange) {
        onChange(formattedDate); // Notify parent with YYYY-MM-DD
      }
      console.log('DatePicker selected:', formattedDate);
    } catch (error) {
      console.error('Error selecting date:', error);
    }
  };

  // Display date in DD/MM/YYYY for UI
  const displayDate = value && value !== 'Select a date'
    ? format(parse(value, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy')
    : 'Select a date';

  return (
    <div className="relative w-full mx-auto">
      {title && (
        <div>
          <p className="block text-sm font-medium text-gray-700 mb-1">{title}</p>
        </div>
      )}
      <div
        className="w-full flex items-center justify-between p-3 bg-white text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-493"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-gray-500">{displayDate}</span>
        <CalendarIcon size={20} className="text-teal-800" />
      </div>
      <input type="hidden" name={inputName} value={value} />
      {isOpen && (
        <div className="w-full absolute z-10 mt-2 bg-slate-700 text-white rounded-lg shadow-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex justify-center align-middle space-x-2">
              <button
                className="p-1 hover:bg-teal-600 rounded"
                onClick={() => {
                  setShowMonthSelect(true);
                  setShowYearSelect(false);
                }}
              >
                {months[currentMonthIndex]}
              </button>
              <button
                className="p-1 hover:bg-teal-600 rounded"
                onClick={() => {
                  setShowYearSelect(true);
                  setShowMonthSelect(false);
                }}
              >
                {currentYear}
              </button>
            </div>
            <div className="flex space-x-2">
              <button onClick={handlePrevMonth}>
                <ChevronLeftIcon size={20} />
              </button>
              <button onClick={handleNextMonth}>
                <ChevronRightIcon size={20} />
              </button>
            </div>
          </div>

          {showYearSelect && (
            <div className="grid grid-cols-4 gap-2 mb-4 max-h-48 overflow-y-auto">
              {Array.from({ length: 200 }, (_, i) => 1900 + i).map((year) => (
                <button
                  key={year}
                  className="p-1 hover:bg-teal-600 rounded"
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
                  className="p-1 hover:bg-teal-600 rounded"
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
                <div key={day} className="text-center font-semibold text-sm">
                  {day}
                </div>
              ))}
              {Array.from({ length: firstDay }, (_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const dayStr = String(day).padStart(2, '0');
                const monthStr = String(currentMonthIndex + 1).padStart(2, '0');
                const isSelected = value === `${currentYear}-${monthStr}-${dayStr}`;
                return (
                  <button
                    key={day}
                    className={`text-center cursor-pointer rounded-full p-1 ${
                      isSelected ? 'bg-teal-600' : 'hover:bg-teal-600'
                    }`}
                    onClick={() => handleDateSelect(day)}
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