import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import Select from "react-select";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";

const holidays = {
  2025: {
    0: {
      1: { name: "New Year's Day", type: "Public Holiday" },
      14: { name: "Makar Sankranti", type: "Festival" },
      26: { name: "Republic Day", type: "National Holiday" },
    },
    1: {
      13: { name: "Maha Shivratri", type: "Festival" },
      14: { name: "Valentine's Day", type: "Observance" },
    },
    2: {
      13: { name: "Holi", type: "Festival" },
      14: { name: "Dhulandi", type: "Festival" },
    },
    3: {
      10: { name: "Ram Navami", type: "Festival" },
      14: { name: "Ambedkar Jayanti", type: "Jayanti" },
      18: { name: "Good Friday", type: "Christian Holiday" },
    },
    4: {
      1: { name: "Labour Day", type: "Public Holiday" },
      12: { name: "Buddha Purnima", type: "Festival" },
    },
    5: {
      15: { name: "Eid al-Adha", type: "Islamic Festival" },
    },
    7: {
      15: { name: "Independence Day", type: "National Holiday" },
      16: { name: "Janmashtami", type: "Festival" },
    },
    9: {
      2: { name: "Gandhi Jayanti", type: "Jayanti" },
      20: { name: "Karva Chauth", type: "Festival" },
      24: { name: "Dussehra", type: "Festival" },
      31: { name: "Diwali", type: "Festival" },
    },
    10: {
      1: { name: "Govardhan Puja", type: "Festival" },
      2: { name: "Bhai Dooj", type: "Festival" },
      15: { name: "Guru Nanak Jayanti", type: "Jayanti" },
    },
    11: {
      25: { name: "Christmas Day", type: "Christian Holiday" },
    },
  },
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Options for react-select
const monthOptions = monthNames.map((month, index) => ({
  value: index,
  label: month,
}));

const yearOptions = Array.from({ length: 2051 - 1970 }, (_, i) => ({
  value: 1970 + i,
  label: `${1970 + i}`,
}));

// Custom styles for react-select
const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    minHeight: "38px",
    borderColor: "#334155", // slate-700
    boxShadow: "none",
    "&:hover": {
      borderColor: "#2dd4bf", // teal-700
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#334155", // slate-700
    fontSize: "0.875rem", // text-sm
    fontWeight: 500, // font-medium
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#2dd4bf" // teal-700
      : state.isFocused
      ? "#e0f2fe" // light teal hover
      : "white",
    color: state.isSelected ? "white" : "#334155", // slate-700
    fontSize: "0.875rem", // text-sm
    fontWeight: 500, // font-medium
    padding: "8px 12px",
  }),
  menu: (provided) => ({
    ...provided,
    minHeight: "200px",
    zIndex: 20,
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: "200px",
  }),
};

const AnnualCalendar = () => {
  const [currentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [hoveredDay, setHoveredDay] = useState(null);

  const today = new Date();
  const isCurrentMonth =
    selectedMonth === today.getMonth() && selectedYear === today.getFullYear();

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let day = 1; day <= daysInMonth; day++) calendarDays.push(day);

  const goToPreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else setSelectedMonth(selectedMonth - 1);
  };

  const goToNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else setSelectedMonth(selectedMonth + 1);
  };

  const goToToday = () => {
    setSelectedMonth(today.getMonth());
    setSelectedYear(today.getFullYear());
  };

  const getHolidayInfo = (day) => {
    const yearHolidays = holidays[selectedYear];
    return yearHolidays?.[selectedMonth]?.[day] || null;
  };

  const isToday = (day) => isCurrentMonth && day === today.getDate();

  const getHolidayColor = (type) => {
    switch (type) {
      case "National Holiday":
        return "bg-red-100 border-red-300 text-red-800";
      case "Festival":
        return "bg-orange-100 border-orange-300 text-orange-800";
      case "Jayanti":
        return "bg-green-100 border-green-300 text-green-800";
      case "Christian Holiday":
        return "bg-blue-100 border-blue-300 text-blue-800";
      case "Islamic Festival":
        return "bg-purple-100 border-purple-300 text-purple-800";
      case "Public Holiday":
        return "bg-gray-100 border-gray-300 text-gray-800";
      default:
        return "bg-yellow-100 border-yellow-300 text-yellow-800";
    }
  };

  const getUpcomingHolidays = () => {
    const yearHolidays = holidays[selectedYear];
    if (!yearHolidays || !yearHolidays[selectedMonth]) return [];
    return Object.entries(yearHolidays[selectedMonth])
      .map(([day, info]) => ({ day: parseInt(day), ...info }))
      .sort((a, b) => a.day - b.day);
  };

  const upcomingHolidays = getUpcomingHolidays();

  return (
    <div className="w-full lg:w-[78%]">
      <div className="flex justify-end">
        <PageMeta title="Annual Calendar" />
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "Annual Calendar", link: "/admin/annual-calendar" },
          ]}
        />
      </div>

      <div className="space-y-8 bg-white rounded-2xl p-6">
        {/* Header */}
        <div className="text-left mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-start justify-start gap-3">
            <Calendar className="h-7 w-7 text-indigo-600" />
            Festival Calendar {selectedYear}
          </h1>
          <p className="text-gray-500">
            Track all public holidays and festivals throughout the year
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-md border-1 border-gray-200 p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={goToPreviousMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-600" />
                </button>

                <div className="flex items-center gap-4">
                  <Select
                    options={monthOptions}
                    value={monthOptions.find(
                      (option) => option.value === selectedMonth
                    )}
                    onChange={(option) => setSelectedMonth(option.value)}
                    styles={customSelectStyles}
                    className="w-40"
                  />
                  <Select
                    options={yearOptions}
                    value={yearOptions.find(
                      (option) => option.value === selectedYear
                    )}
                    onChange={(option) => setSelectedYear(option.value)}
                    styles={customSelectStyles}
                    className="w-28"
                  />
                </div>

                <button
                  onClick={goToNextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="h-6 w-6 text-gray-600" />
                </button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map((day) => (
                  <div
                    key={day}
                    className="p-3 text-center font-semibold text-gray-600 text-sm"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  if (!day) return <div key={index} className="p-3 h-10"></div>;

                  const holiday = getHolidayInfo(day);
                  const isCurrentDay = isToday(day);

                  return (
                    <div
                      key={day}
                      className={`relative p-2 h-15 border-2 rounded-lg cursor-pointer transition-all
                        ${
                          isCurrentDay
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-lg"
                            : holiday
                            ? `${getHolidayColor(holiday.type)} hover:shadow-md`
                            : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
                        }`}
                      onMouseEnter={() => setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                    >
                      <div className="text-lg font-semibold">{day}</div>

                      {holiday && (
                        <div className="absolute bottom-1 left-1 right-1">
                          <div
                            className={`text-xs font-medium truncate ${
                              isCurrentDay ? "text-white" : ""
                            }`}
                          >
                            {holiday.name}
                          </div>
                        </div>
                      )}

                      {/* Tooltip */}
                      {hoveredDay === day && holiday && (
                        <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-black text-white text-xs rounded shadow-lg whitespace-nowrap">
                          <div className="font-semibold">{holiday.name}</div>
                          <div className="text-gray-300">{holiday.type}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Today Button */}
            {/* <div className="mt-6 text-center">
              <button
                onClick={goToToday}
                className="inline-flex items-center px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-teal-700 text-sm font-medium transition-colors"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Go to Today
              </button>
            </div> */}
          </div>

          {/* Sidebar - Holiday List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-md border-1 border-gray-200 p-6 sticky top-4">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold underline text-gray-800">
                  Holidays This Month
                </h3>
              </div>

              {upcomingHolidays.length > 0 ? (
                <div className="space-y-3">
                  {upcomingHolidays.map((holiday) => (
                    <div
                      key={holiday.day}
                      className={`p-3 rounded-lg border-l-4 ${
                        getHolidayColor(holiday.type)
                          .replace("border-", "border-l-")
                          .split(" ")[1]
                      }`}
                    >
                      <div className="font-semibold text-sm text-gray-800">
                        {monthNames[selectedMonth]} {holiday.day}
                      </div>
                      <div className="font-medium text-gray-700 text-sm">
                        {holiday.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {holiday.type}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No holidays this month</p>
                </div>
              )}

              {/* Legend */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">
                  Legend
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-red-200 border border-red-300"></div>
                    <span>National Holiday</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-orange-200 border border-orange-300"></div>
                    <span>Festival</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-200 border border-green-300"></div>
                    <span>Jayanti</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-indigo-600"></div>
                    <span>Today</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnualCalendar;