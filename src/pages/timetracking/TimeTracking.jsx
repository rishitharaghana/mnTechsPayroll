import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Users, MapPin, Search, Download } from "lucide-react";
import Select from "react-select";
import {
  fetchActiveSiteVisits,
  initializeWebSocket,
} from "../../redux/slices/siteVisitSlice";
import LiveTrackingTable from "../timetracking/LiveTrackingTable";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";

// Custom styles for React Select
const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    minHeight: "32px",
    height: "32px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    boxShadow: "none",
    fontSize: "12px",
    width: "100%",
    "&:hover": {
      borderColor: "#3b82f6",
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "0 12px",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#1f2937",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#9ca3af",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "8px",
    marginTop: "4px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    zIndex: 10,
  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: "12px",
    padding: "10px 16px", // Increased padding for better touch targets and spacing
    backgroundColor: state.isSelected
      ? "#3b82f6"
      : state.isFocused
      ? "#f3f4f6"
      : "white",
    color: state.isSelected ? "white" : "#1f2937",
    "&:hover": {
      backgroundColor: state.isSelected ? "#3b82f6" : "#e5e7eb",
    },
    display: "flex",
    alignItems: "center",
    transition: "background-color 0.2s",
  }),
};

// Status options with custom styling
const statusOptions = [
  {
    value: "all",
    label: "All Status",
    customStyle: { backgroundColor: "#f3f4f6", color: "#1f2937" },
  },
  {
    value: "online",
    label: "Online",
    customStyle: { backgroundColor: "#dcfce7", color: "#15803d" },
  },
  {
    value: "offline",
    label: "Offline",
    customStyle: { backgroundColor: "#fee2e2", color: "#b91c1c" },
  },
];

const TimeTracking = () => {
  const dispatch = useDispatch();
  const [activeView, setActiveView] = useState("tracking");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState(statusOptions[0]); // Default to "All Status"

  useEffect(() => {
    dispatch(initializeWebSocket());
    dispatch(fetchActiveSiteVisits());
  }, [dispatch]);

  // Custom Option component for React Select
  const CustomOption = ({ innerProps, label, data }) => (
    <div
      {...innerProps}
      style={{
        ...data.customStyle,
        padding: "10px 16px", // Consistent padding with option styles
        cursor: "pointer",
      }}
    >
      {label}
    </div>
  );

  return (
    <div className="w-full mt-4 sm:mt-0 px-4 sm:px-6 lg:px-8">
      <div className="hidden sm:flex sm:justify-end sm:items-center mb-4">
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/admin/dashboard" },
            { label: "Time Tracking", link: "/admin/time-tracking" },
          ]}
        />
      </div>
      <div className="space-y-4 bg-white rounded-2xl p-4 sm:p-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-md border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col space-y-4 md:space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Time Tracking Dashboard
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm">
                Real-time employee site visit tracking and location monitoring
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full lg:w-auto">
              <div className="relative w-full sm:w-48">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-teal-700 w-full"
                />
              </div>
              <div className="w-full relative z-999 sm:w-32">
                <Select
                  options={statusOptions}
                  value={filterStatus}
                  onChange={setFilterStatus}
                  styles={customSelectStyles}
                  components={{ Option: CustomOption }}
                  isSearchable={false}
                />
              </div>
              <button className="flex items-center justify-center space-x-1 px-3 py-2 text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-teal-700 hover:to-teal-700 transition-all duration-300 shadow w-full sm:w-auto">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
          <div className="flex space-x-1 bg-white/80 rounded-xl backdrop-blur-xl shadow-md border border-white/10 p-1 mt-4">
            <button
              onClick={() => setActiveView("tracking")}
              className={`flex-1 py-2 rounded-md text-xs sm:text-sm font-medium flex items-center justify-center space-x-1 ${
                activeView === "tracking"
                  ? "bg-teal-700 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Tracking</span>
            </button>
          </div>
        </div>
        <div>
          {activeView === "tracking" && (
            <LiveTrackingTable
              searchTerm={searchTerm}
              filterStatus={filterStatus.value}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeTracking;