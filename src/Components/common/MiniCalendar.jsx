import React from 'react';

const MiniCalendar = ({ month, workSummary }) => {
  const [year, monthNum] = month.split('-').map(Number);
  const date = new Date(year, monthNum - 1, 1);
  const firstDay = date.getDay(); 
  const daysInMonth = new Date(year, monthNum, 0).getDate();

  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, () => null); 
  const attendance = [];
  let currentDay = 1;
  if (workSummary) {
    const { present_days, paid_leave_days, unpaid_leave_days, holidays } = workSummary;
    for (let i = 0; i < present_days && currentDay <= daysInMonth; i++) {
      attendance[currentDay++] = 'present';
    }
    for (let i = 0; i < paid_leave_days && currentDay <= daysInMonth; i++) {
      attendance[currentDay++] = 'paid_leave';
    }
    for (let i = 0; i < unpaid_leave_days && currentDay <= daysInMonth; i++) {
      attendance[currentDay++] = 'unpaid_leave';
    }
    for (let i = 0; i < holidays && currentDay <= daysInMonth; i++) {
      attendance[currentDay++] = 'holiday';
    }
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200/50 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {date.toLocaleString('en-IN', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex flex-wrap gap-3 sm:gap-4 text-xs text-gray-600">
          <div className="flex items-center">
            <span className="w-3 h-3 bg-teal-500 rounded-full mr-1.5"></span>
            Present: {workSummary?.present_days || 0}
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-indigo-500 rounded-full mr-1.5"></span>
            Paid Leave: {workSummary?.paid_leave_days || 0}
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-coral-500 rounded-full mr-1.5"></span>
            Unpaid Leave: {workSummary?.unpaid_leave_days || 0}
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-amber-500 rounded-full mr-1.5"></span>
            Holidays: {workSummary?.holidays || 0}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div
            key={index}
            className="text-xs font-medium text-gray-500 uppercase tracking-wider py-2"
          >
            {day}
          </div>
        ))}
        {blanks.map((_, index) => (
          <div key={`blank-${index}`} className="h-10 sm:h-12"></div>
        ))}
        {days.map((day) => (
          <div
            key={day}
            className={`h-10 sm:h-12 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200
              ${attendance[day] === 'present' ? 'bg-teal-50 text-teal-600 hover:bg-teal-100' : ''}
              ${attendance[day] === 'paid_leave' ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100' : ''}
              ${attendance[day] === 'unpaid_leave' ? 'bg-coral-50 text-coral-600 hover:bg-coral-100' : ''}
              ${attendance[day] === 'holiday' ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : ''}
              ${!attendance[day] ? 'text-gray-600 hover:bg-gray-100' : ''}
              cursor-pointer relative group`}
            role="gridcell"
            aria-label={`Day ${day} is ${attendance[day] ? attendance[day].replace('_', ' ') : 'no status'}`}
          >
            <span>{day}</span>
            {attendance[day] && (
              <span className="ml-1 text-xs font-semibold">
                {attendance[day] === 'present' ? '✓' : 
                 attendance[day] === 'paid_leave' ? 'P' : 
                 attendance[day] === 'unpaid_leave' ? 'U' : 'H'}
              </span>
            )}
            <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded-lg py-1 px-2 bottom-full mb-2 z-10 shadow-lg">
              {attendance[day] ? attendance[day].replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'No status'}
              <svg className="absolute text-gray-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255">
                <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiniCalendar;