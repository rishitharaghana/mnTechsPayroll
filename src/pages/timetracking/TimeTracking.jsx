import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Users, MapPin, Search, Download } from "lucide-react";
import {
  fetchActiveSiteVisits,
  initializeWebSocket,
} from "../../redux/slices/siteVisitSlice";
import LiveTrackingTable from "../timetracking/LiveTrackingTable";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";

const TimeTracking = () => {
  const dispatch = useDispatch();
  const [activeView, setActiveView] = useState("tracking");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    dispatch(initializeWebSocket());
    dispatch(fetchActiveSiteVisits());
  }, [dispatch]);

  return (
    <div className="w-78/100">
      <div className="flex justify-end">
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "Time Tracking", link: "/admin/time-tracking" },
          ]}
        />
      </div>
      <div className="space-y-4 bg-white rounded-2xl p-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-md border-1 border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Time Tracking Dashboard
              </h2>
              <p className="text-gray-600 text-xs">
                Real-time employee site visit tracking and location monitoring
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-teal-700 w-full sm:w-48"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
              <button className="flex items-center justify-center space-x-1 px-3 py-2 text-xs bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-teal-700 hover:to-teal-700 transition-all duration-300 shadow">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
          <div className="flex space-x-1 bg-white/80 rounded-xl backdrop-blur-xl shadow-md border border-white/10 p-1 mt-4">
            <button
              onClick={() => setActiveView("tracking")}
              className={`flex-1 py-2 rounded-md text-xs font-medium flex items-center justify-center space-x-1 ${
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
        <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-md border-1 border-gray-200 p-4">
          {activeView === "tracking" && (
            <LiveTrackingTable
              searchTerm={searchTerm}
              filterStatus={filterStatus}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeTracking;
