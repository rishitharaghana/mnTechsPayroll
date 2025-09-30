import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ChevronLeft, ChevronRight, Calendar, X } from "lucide-react";
import Select from "react-select";
import { toast } from "react-toastify";
import { format, isValid, isPast } from "date-fns";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";

// Redux actions
import {
  fetchHolidays,
  createHoliday,
  updateHoliday,
  deleteHoliday,
} from "../../redux/slices/holidaySlice";

const holidayTypes = [
  { value: "Public Holiday", label: "Public Holiday" },
  { value: "National Holiday", label: "National Holiday" },
  { value: "Festival", label: "Festival" },
  { value: "Jayanti", label: "Jayanti" },
  { value: "Christian Holiday", label: "Christian Holiday" },
  { value: "Islamic Festival", label: "Islamic Festival" },
  { value: "Observance", label: "Observance" },
];

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

const monthOptions = monthNames.map((month, index) => ({
  value: index,
  label: month,
}));

const yearOptions = Array.from({ length: 2051 - 2020 }, (_, i) => ({
  value: 2020 + i,
  label: `${2020 + i}`,
}));

const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    minHeight: "36px",
    borderRadius: "8px",
    borderColor: "#e2e8f0",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#10b981",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#1f2937",
    fontSize: "0.875rem",
    fontWeight: 500,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#10b981"
      : state.isFocused
      ? "#ecfdf5"
      : "white",
    color: state.isSelected ? "white" : "#1f2937",
    fontSize: "0.875rem",
    fontWeight: 500,
    padding: "8px 12px",
    borderRadius: "4px",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "8px",
    marginTop: "4px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: "200px",
  }),
};

const AnnualCalendar = () => {
  const dispatch = useDispatch();
  const { holidays = [], loading = false, error = null } = useSelector(
    (state) => state.holidays || {}
  );
  const { user } = useSelector((state) => state.auth || {});
  const isAdmin = ["super_admin", "hr"].includes(user?.role);

  const [currentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [hoveredDay, setHoveredDay] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editHoliday, setEditHoliday] = useState(null);
  const [formData, setFormData] = useState({
    holiday_date: "",
    description: "",
    type: null,
  });
  const [formErrors, setFormErrors] = useState({});

  const today = new Date();
  const isCurrentMonth =
    selectedMonth === today.getMonth() && selectedYear === today.getFullYear();

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let day = 1; day <= daysInMonth; day++) calendarDays.push(day);

  // Fetch holidays on year change
  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      dispatch(fetchHolidays({ year: selectedYear }));
    } else {
      toast.error("Please log in to view holidays");
    }
  }, [selectedYear, dispatch]);

  // Validate form
  const validateForm = () => {
    const errors = {};
    const date = new Date(formData.holiday_date);
    if (!formData.holiday_date || !isValid(date)) {
      errors.holiday_date = "Valid date is required";
    } else if (isPast(date) && !editHoliday) {
      errors.holiday_date = "Date cannot be in the past";
    }
    if (!formData.description || formData.description.trim().length === 0) {
      errors.description = "Description is required";
    } else if (formData.description.length > 255) {
      errors.description = "Description must be 255 characters or less";
    }
    if (!formData.type) {
      errors.type = "Holiday type is required";
    }
    if (
      holidays.some(
        (h) =>
          h.holiday_date === formData.holiday_date &&
          (!editHoliday || h.id !== editHoliday.id)
      )
    ) {
      errors.holiday_date = "Holiday already exists on this date";
    }
    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const payload = {
      holiday_date: formData.holiday_date,
      description: formData.description.trim(),
      type: formData.type?.value,
    };

    try {
      if (editHoliday) {
        await dispatch(updateHoliday({ id: editHoliday.id, ...payload })).unwrap();
        toast.success("Holiday updated successfully");
      } else {
        await dispatch(createHoliday(payload)).unwrap();
        toast.success("Holiday created successfully");
      }
      setFormData({ holiday_date: "", description: "", type: null });
      setEditHoliday(null);
      setShowForm(false);
      setFormErrors({});
      dispatch(fetchHolidays({ year: selectedYear }));
    } catch (err) {
      toast.error(
        `Failed to ${editHoliday ? "update" : "create"} holiday: ${
          err.message || "Something went wrong"
        }`
      );
    }
  };

  // Handle delete holiday
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this holiday?")) {
      try {
        await dispatch(deleteHoliday(id)).unwrap();
        toast.success("Holiday deleted successfully");
        dispatch(fetchHolidays({ year: selectedYear }));
      } catch (err) {
        toast.error(`Failed to delete holiday: ${err.message || "Something went wrong"}`);
      }
    }
  };

  // Handle edit holiday
  const handleEdit = (holiday) => {
    setEditHoliday(holiday);
    setFormData({
      holiday_date: holiday.holiday_date,
      description: holiday.description,
      type: holidayTypes.find((t) => t.value === holiday.type),
    });
    setShowForm(true);
  };

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
    return (
      holidays.find(
        (h) =>
          new Date(h.holiday_date).getDate() === day &&
          new Date(h.holiday_date).getMonth() === selectedMonth &&
          new Date(h.holiday_date).getFullYear() === selectedYear
      ) || null
    );
  };

  const isToday = (day) => isCurrentMonth && day === today.getDate();

  const getHolidayColor = (type) => {
    switch (type) {
      case "National Holiday":
        return "bg-red-50 border-red-200 text-red-700";
      case "Festival":
        return "bg-orange-50 border-orange-200 text-orange-700";
      case "Jayanti":
        return "bg-green-50 border-green-200 text-green-700";
      case "Christian Holiday":
        return "bg-blue-50 border-blue-200 text-blue-700";
      case "Islamic Festival":
        return "bg-purple-50 border-purple-200 text-purple-700";
      case "Public Holiday":
        return "bg-gray-50 border-gray-200 text-gray-700";
      default:
        return "bg-yellow-50 border-yellow-200 text-yellow-700";
    }
  };

  const getUpcomingHolidays = () => {
    return holidays
      .filter(
        (h) =>
          new Date(h.holiday_date).getMonth() === selectedMonth &&
          new Date(h.holiday_date).getFullYear() === selectedYear
      )
      .map((h) => ({
        ...h,
        day: new Date(h.holiday_date).getDate(),
      }))
      .sort((a, b) => a.day - b.day);
  };

  const upcomingHolidays = getUpcomingHolidays();

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 font-sans">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Calendar className="h-6 w-6 text-emerald-600" />
            {monthNames[selectedMonth]} {selectedYear}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage holidays and festivals
          </p>
        </div>
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <PageMeta title="Annual Calendar" />
          <PageBreadcrumb
            items={[
              { label: "Home", link: "/" },
              { label: "Calendar", link: "/annual-calendar" },
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={goToPreviousMonth}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Previous Month"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex gap-2">
                <Select
                  options={monthOptions}
                  value={monthOptions.find(
                    (option) => option.value === selectedMonth
                  )}
                  onChange={(option) => setSelectedMonth(option.value)}
                  styles={customSelectStyles}
                  className="w-36"
                  aria-label="Select Month"
                />
                <Select
                  options={yearOptions}
                  value={yearOptions.find(
                    (option) => option.value === selectedYear
                  )}
                  onChange={(option) => setSelectedYear(option.value)}
                  styles={customSelectStyles}
                  className="w-24"
                  aria-label="Select Year"
                />
              </div>
              <button
                onClick={goToNextMonth}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Next Month"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <button
              onClick={goToToday}
              className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium transition-colors"
              aria-label="Go to Today"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Today
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {dayNames.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-gray-500"
              >
                {day}
              </div>
            ))}
            {loading ? (
              <div className="col-span-7 text-center py-8">
                <div className="animate-spin h-8 w-8 mx-auto border-4 border-emerald-600 border-t-transparent rounded-full"></div>
                <p className="mt-2 text-gray-500">Loading calendar...</p>
              </div>
            ) : (
              calendarDays.map((day, index) => {
                if (!day)
                  return (
                    <div key={index} className="h-12 sm:h-14"></div>
                  );

                const holiday = getHolidayInfo(day);
                const isCurrentDay = isToday(day);

                return (
                  <div
                    key={day}
                    className={`relative p-2 h-12 sm:h-14 rounded-lg border transition-all duration-200
                      ${
                        isCurrentDay
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                          : holiday
                          ? `${getHolidayColor(holiday.type)} hover:shadow-md`
                          : "bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-200"
                      }`}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    onClick={() => setHoveredDay(day)}
                    role="button"
                    aria-label={`Day ${day}${holiday ? `, ${holiday.description}` : ""}`}
                  >
                    <div className="text-sm font-medium text-center">
                      {day}
                    </div>
                    {holiday && (
                      <div className="absolute bottom-1 left-0 right-0 text-center">
                        <span
                          className={`text-xs font-medium truncate ${
                            isCurrentDay ? "text-white" : ""
                          }`}
                        >
                          {holiday.description}
                        </span>
                      </div>
                    )}
                    {hoveredDay === day && holiday && (
                      <div className="absolute z-20 -top-20 left-1/2 transform -translate-x-1/2 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg max-w-xs">
                        <div className="font-semibold">{holiday.description}</div>
                        <div className="text-gray-300">{holiday.type}</div>
                        {isAdmin && (
                          <div className="mt-2 flex gap-2">
                            <button
                              onClick={() => handleEdit(holiday)}
                              className="text-xs text-emerald-400 hover:underline"
                              aria-label={`Edit ${holiday.description}`}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(holiday.id)}
                              className="text-xs text-red-400 hover:underline"
                              aria-label={`Delete ${holiday.description}`}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-900"></div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Sidebar - Holiday List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Upcoming Holidays
            </h3>
            {isAdmin && (
              <button
                onClick={() => {
                  setShowForm(true);
                  setEditHoliday(null);
                  setFormData({ holiday_date: "", description: "", type: null });
                }}
                className="w-full mb-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium transition-colors"
              >
                Add New Holiday
              </button>
            )}
            {loading ? (
              <div className="text-center py-6">
                <div className="animate-spin h-8 w-8 mx-auto border-4 border-emerald-600 border-t-transparent rounded-full"></div>
                <p className="mt-2 text-gray-500">Loading holidays...</p>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-6">
                {error}
                <button
                  onClick={() => dispatch(fetchHolidays({ year: selectedYear }))}
                  className="mt-2 text-sm text-emerald-600 hover:underline"
                >
                  Retry
                </button>
              </div>
            ) : upcomingHolidays.length > 0 ? (
              <div className="space-y-4">
                {upcomingHolidays.map((holiday) => (
                  <div
                    key={holiday.id}
                    className={`p-4 rounded-lg border-l-4 ${getHolidayColor(
                      holiday.type
                    )
                      .replace("border-", "border-l-")
                      .split(" ")[1]} bg-white shadow-sm hover:shadow-md transition-shadow`}
                  >
                    <div className="text-sm font-semibold text-gray-900">
                      {monthNames[selectedMonth]} {holiday.day}
                    </div>
                    <div className="text-sm font-medium text-gray-700">
                      {holiday.description}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {holiday.type}
                    </div>
                    {isAdmin && (
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => handleEdit(holiday)}
                          className="text-xs text-emerald-600 hover:underline"
                          aria-label={`Edit ${holiday.description}`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(holiday.id)}
                          className="text-xs text-red-600 hover:underline"
                          aria-label={`Delete ${holiday.description}`}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Calendar className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No holidays this month</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Modal for Holiday Form */}
      {showForm && isAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-11/12 max-w-md shadow-xl">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Close Modal"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editHoliday ? "Edit Holiday" : "Add Holiday"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.holiday_date}
                  onChange={(e) =>
                    setFormData({ ...formData, holiday_date: e.target.value })
                  }
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm ${
                    formErrors.holiday_date ? "border-red-500" : ""
                  }`}
                  required
                />
                {formErrors.holiday_date && (
                  <p className="text-xs text-red-500 mt-1">
                    {formErrors.holiday_date}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm ${
                    formErrors.description ? "border-red-500" : ""
                  }`}
                  required
                  maxLength={255}
                />
                {formErrors.description && (
                  <p className="text-xs text-red-500 mt-1">
                    {formErrors.description}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <Select
                  options={holidayTypes}
                  value={formData.type}
                  onChange={(option) => setFormData({ ...formData, type: option })}
                  styles={customSelectStyles}
                  className={`mt-1 ${formErrors.type ? "border-red-500 rounded-md" : ""}`}
                  required
                />
                {formErrors.type && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.type}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium transition-colors ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Processing..." : editHoliday ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnualCalendar;