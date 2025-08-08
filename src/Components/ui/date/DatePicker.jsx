import React, { useState, useMemo } from 'react';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';


const generateUniqueName = () => `datePicker_${Math.random().toString(36).substr(2, 9)}`;

const DatePicker = ({ name = 'datePicker', title }) => { 
  const [isOpen, setIsOpen] = useState(false);
  const [showYearSelect, setShowYearSelect] = useState(false);
  const [showMonthSelect, setShowMonthSelect] = useState(false);
  const [selectedDate, setSelectedDate] = useState('Select a date');
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); 
  const [currentMonthIndex, setCurrentMonthIndex] = useState(7); 

  
  const inputName = useMemo(() => name || generateUniqueName(), [name]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonthIndex, 1).getDay();

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

  return (
    <div className="relative w-full mx-auto">
      <div>
        <p className='block text-sm font-medium text-gray-700 mb-1'>{title}</p>
      </div>
      <div
        className="w-full flex items-center justify-between p-3 bg-white text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-493"
        onClick={() => setIsOpen(!isOpen)}>
        <span className='text-gray-500'>{selectedDate}</span>
        <CalendarIcon size={20} className="text-teal-800" />
      </div>
      <input
        type="hidden"
        name={inputName} 
        value={selectedDate}
      />
      {isOpen && (
        <div className="w-full absolute z-10 mt-2 bg-slate-700 text-white rounded-lg shadow-lg p-4">
          <div className="flex justify-between items-center mb-4 ">
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
                const dayStr = String(i + 1).padStart(2, '0');
                const monthStr = String(currentMonthIndex + 1).padStart(2, '0');
                const isSelected = selectedDate === `${dayStr}/${monthStr}/${currentYear}`;
                return (
                  <button
                    key={i + 1}
                    className={`text-center cursor-pointer rounded-full p-1 ${
                      isSelected ? 'bg-teal-600' : 'hover:bg-teal-600'
                    }`}
                    onClick={() =>
                      setSelectedDate(`${dayStr}/${monthStr}/${currentYear}`)
                    }
                  >
                    {i + 1}
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