import {
  Users,
  Clock,
  FileText,
  Calendar,
  TrendingUp,
  CreditCard,
  MapPin,
  PersonStanding,
  Shield,
  Settings,
  HelpCircle,
  LogOut,
  CalendarClock,
  IdCard,
  IdCardIcon,
  IdCardLanyard,
} from "lucide-react";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const AppSidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const [activeTab, setActiveTab] = useState("");

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: TrendingUp,
      path: "/admin/dashboard",
    },
    {
      id: "employees",
      label: "Employees",
      icon: Users,
      children: [
        { id: "view-employees", label: "View Employees", path: "/admin/employees" },
        {id: "assign-employee", label: "Assign Employee", path: "/admin/assign-employee"},
      ],
    },
    {
      id: "attendance",
      label: "Attendance",
      icon: Clock,
      path: "/admin/attendance",
    },
    {
      id: "leave-tracker",
      label: "Leave Management",
      icon: CalendarClock,
      path: "/admin/leave-tracker",
    },
    {
      id: "payroll",
      label: "Payroll",
      icon: CreditCard,
      children: [
        { id: "view-payroll", label: "View Payroll", path: "/admin/payroll" },
        {
          id: "generate-payroll",
          label: "Generate Payroll",
          path: "/admin/generate-payroll",
        },
        {
          id: "payroll history",
          label: "View Payroll History",
          path: "/pay-history",
        },
      ],
    },
    {
      id: "payslips",
      label: "Payslips",
      icon: FileText,
      path: "/admin/payslip",
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: Calendar,
      path: "/admin/calendar",
    },
    {
      id: "performance",
      label: "Performance",
      icon: TrendingUp,
      children: [
        {
          id: "view-performance",
          label: "View Performance",
          path: "/admin/performance",
        },
        {
          id: "add-performance",
          label: "Add Employee Review",
          path: "/admin/add-performance",
        },
      ],
    },
    {
      id: "visitingcards",
      label: "Visiting Cards",
      icon: IdCardIcon,
      path: "/admin/visitingcards",
    },
    { id: "idcard", label: "ID Card", icon: IdCardLanyard, path: "/idcard" },
  ];

  const profileItems = [
    { id: "profile", label: "Profile", icon: PersonStanding, path: "/profile" },
    { id: "logout", label: "Logout", icon: LogOut, path: "login" }, 
  ];

  return (
    <>
      <aside
        className={`${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white text-gray-800 border-r border-white/20 transition-transform duration-300 ease-in-out flex flex-col`}
      >
        {/* Main Navigation */}
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;

            if (item.children) {
              const isActive = activeTab === item.id;
              return (
                <div key={item.id}>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveTab((prev) => (prev === item.id ? "" : item.id))
                    }
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-teal-600 text-white shadow-md"
                        : "hover:bg-slate-700 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </div>
                  </button>

                  {isActive && (
                    <div className="ml-6 mt-2 space-y-1">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.id}
                          to={child.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `block px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                              isActive
                                ? "bg-teal-100 text-teal-800"
                                : "hover:bg-slate-100 text-gray-700"
                            }`
                          }
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={({ isActive }) =>
                  `w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive || activeTab === item.id
                      ? "bg-teal-600 text-white shadow-md"
                      : "hover:bg-slate-700 hover:text-white"
                  }`
                }
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Profile & Logout */}
        <div className="p-4 border-t border-gray-200">
          {profileItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={({ isActive }) =>
                  `w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    item.id === "logout"
                      ? isActive
                        ? "text-red-600 bg-red-50"
                        : "text-red-600 hover:bg-red-50"
                      : isActive || activeTab === item.id
                      ? "bg-teal-600 text-white shadow-md"
                      : "hover:bg-slate-700 hover:text-white"
                  }`
                }
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </aside>

      {/* Overlay on mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default AppSidebar;