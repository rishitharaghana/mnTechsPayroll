// src/components/common/MiniCalendar.js
import React from "react";

const MiniCalendar = ({ month, workSummary }) => {
  const [year, monthNum] = month.split("-").map(Number);
  const date = new Date(year, monthNum - 1, 1);
  const firstDay = date.getDay();
  const daysInMonth = new Date(year, monthNum, 0).getDate();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, () => null);

  // Sequential assignment
  const attendance = [];
  let currentDay = 1;
  if (workSummary) {
    const { present_days, paid_leave_days, unpaid_leave_days, holidays } = workSummary;
    for (let i = 0; i < present_days && currentDay <= daysInMonth; i++) {
      attendance[currentDay++] = "present";
    }
    for (let i = 0; i < paid_leave_days && currentDay <= daysInMonth; i++) {
      attendance[currentDay++] = "paid_leave";
    }
    for (let i = 0; i < unpaid_leave_days && currentDay <= daysInMonth; i++) {
      attendance[currentDay++] = "unpaid_leave";
    }
    for (let i = 0; i < holidays && currentDay <= daysInMonth; i++) {
      attendance[currentDay++] = "holiday";
    }
  }

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          {date.toLocaleString("en-IN", { month: "long", year: "numeric" })}
        </h3>
      </div>

      {/* Calendar */}
      <div className="grid grid-cols-7 gap-2 text-center flex-1">
        {/* Weekday headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
          <div key={index} className="text-xs font-semibold text-gray-400 tracking-wide uppercase">
            {day}
          </div>
        ))}

        {/* Empty blanks */}
        {blanks.map((_, index) => (
          <div key={`blank-${index}`} className="h-10 sm:h-12"></div>
        ))}

        {/* Days */}
        {days.map((day) => {
          const status = attendance[day];
          return (
            <div
              key={day}
              className={`h-10 sm:h-12 flex items-center justify-center rounded-full text-sm font-medium cursor-pointer transition-all duration-200
                ${status === "present" ? "bg-teal-500/10 text-teal-600 hover:bg-teal-500/20" : ""}
                ${status === "paid_leave" ? "bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20" : ""}
                ${status === "unpaid_leave" ? "bg-rose-500/10 text-rose-600 hover:bg-rose-500/20" : ""}
                ${status === "holiday" ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20" : ""}
                ${!status ? "text-gray-600 hover:bg-gray-100" : ""}
              `}
              role="gridcell"
              aria-label={`Day ${day} is ${status || "no status"}`}
            >
              <span>{day}</span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-6 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span> Present
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Paid Leave
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Unpaid Leave
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Holiday
        </div>
      </div>
    </div>
  );
};

export default MiniCalendar;
