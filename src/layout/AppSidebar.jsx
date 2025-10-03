import React, { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import {
  Users,
  Clock,
  FileText,
  Calendar,
  LayoutDashboard,
  TrendingUp,
  CreditCard,
  PersonStanding,
  LogOut,
  CalendarClock,
  IdCardIcon,
  RouteOff,
  Waypoints,
} from "lucide-react";

const AppSidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const [activeTab, setActiveTab] = useState("");
  const { user } = useSelector((state) => state.auth);

  if (!user?.role) {
    console.error("User role is undefined or user is not authenticated");
  }

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
      allowedRoles: ["super_admin", "hr", "dept_head", "manager"],
    },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: TrendingUp,
      path: "/emp-dashboard",
      allowedRoles: ["employee"],
    },
    {
      id: "employees",
      label: "Employees",
      icon: Users,
      allowedRoles: ["super_admin", "hr", "dept_head", "manager", "employee"],
      children: [
        {
          id: "view-employees",
          label: "View Employees",
          path: "/admin/employees",
          allowedRoles: ["super_admin", "hr", "dept_head", "manager"],
        },
        {
          id: "assign-employee",
          label: "Assign Employee",
          path: "/admin/assign-employee",
          allowedRoles: ["super_admin", "hr"],
        },
           {
          id: "exit-employee",
          label: "Employee Exit",
          path: "/admin/exit-employee",
          allowedRoles: ["super_admin", "hr"],
        },
        {
          id: "view-employeees",
          label: "Add Details",
          path: "/employee/employee-details",
          allowedRoles: ["hr","dept_head","employee"],
        },
      ],
    },

    {
      id: "attendance",
      label: "Attendance",
      icon: Clock,
      allowedRoles: ["super_admin", "hr", "dept_head", "employee", "manager"],
      children: [
        {
          id: "attendance",
          label: "Apply Attendance",
          path: "/employee/employee-attendance",
          allowedRoles: ["employee", "dept_head", "manager", "hr"],
        },
         {
          id: "attendance-overview",
          label: "Attendance Overview",
          path: "/employee/attendance-overview",
          allowedRoles: ["employee", "dept_head", "manager", "hr"],
        },
        {
          id: "admin-attendance",
          label: "Attendance",
          path: "/admin/attendance",
          allowedRoles: ["super_admin", "hr", "dept_head", "manager"],
        },
        {
          id: "working-hours",
          label: "Employee Avg Hours",
          path: "/admin/working-hours",
          allowedRoles: ["super_admin", "hr"],
        },
      ],
    },
    {
      id: "leave-tracker",
      label: "Leave Management",
      icon: CalendarClock,
      allowedRoles: ["super_admin", "hr", "dept_head", "employee", "manager"],
      children: [
        {
          id: "leave-dashboard",
          label: "Leave Dashboard",
          path: "/employee/leave-dashboard",
          allowedRoles: ["employee", "hr", "dept_head", "manager"],
        },
         {
          id: "leave-tracker",
          label: "Leave Tracker",
          path: "/admin/leave-tracker",
          allowedRoles: ["hr", "super_admin"],
        },
        {
          id: "leave-application",
          label: "Apply Leave",
          path: "/employee/leave-application",
          allowedRoles: ["employee", "dept_head", "hr"],
        },
         {
          id: "leave-assign",
          label: "Assign Leave",
          path: "/admin/assign-leave",
          allowedRoles: ["super_admin", "hr"],
        },
      ],
    },
    {
      id: "payroll",
      label: "Payroll",
      icon: CreditCard,
      allowedRoles: ["super_admin", "hr"],
      children: [
        {
          id: "view-payroll",
          label: "View Payroll",
          path: "/admin/payroll",
          allowedRoles: ["super_admin", "hr"],
        },
        {
          id: "generate-payroll",
          label: "Generate Payroll",
          path: "/admin/generate-payroll",
          allowedRoles: ["super_admin"],
        },
        {
          id: "payroll-history",
          label: "View Payroll History",
          path: "/pay-history",
          allowedRoles: ["super_admin", "hr"],
        },
      ],
    },
    {
      id: "payslips",
      label: "Payslips",
      icon: FileText,
      allowedRoles: ["super_admin", "hr", "employee", "dept_head", "manager"],
      children:[
        {
          id: "payslip",
          label: "PaySlips",
          path: "/admin/payslip",
          allowedRoles: ["super_admin", "hr", ],
        },
         {
      id: "payslips",
      label: "View Payslips",
      icon: FileText,
      path: "/employee-payslip",
      allowedRoles: ["employee", "dept_head", "manager", "hr"],
    },
      ]
    },
   
    {
      id: "calendar",
      label: "Calendar",
      icon: Calendar,
      allowedRoles: ["super_admin", "hr", "dept_head", "manager", "employee"],
      children: [
        // {
        //   id: "holiday-calendar",
        //   label: "Holiday Calendar",
        //   path: "/admin/calendar",
        //   allowedRoles: [
        //     "super_admin",
        //     "hr",
        //     "dept_head",
        //     "manager",
        //     "employee",
        //   ],
        // },
        {
          id: "calendar",
          label: "Annual Calendar",
          path: "/admin/annual-calendar",
          allowedRoles: ["super_admin", "hr", "dept_head", "manager", "employee"],
        },
      ],
    },
    {
      id: "performance",
      label: "Performance",
      icon: TrendingUp,
      allowedRoles: ["super_admin", "hr", "dept_head", "manager", "employee"],
      children: [
        {
          id: "view-performances",
          label: "View Performance",
          path: "/admin/performance",
          allowedRoles: [
            "super_admin",
            "hr",
            "dept_head",
            "manager",
            "employee",
          ],
        },
        {
          id: "view-performance",
          label: "View Goals",
          path: "/employee/viewgoals",
          allowedRoles: ["dept_head", "employee"],
        },
        {
          id: "add-performance",
          label: "Add Employee Review",
          path: "/admin/add-performance",
          allowedRoles: ["super_admin", "hr", "manager"],
        },
      ],
    },
    {
      id: "time-tracking",
      label: "Time Tracking",
      icon: RouteOff,
      allowedRoles: ["super_admin", "hr", "dept_head", "manager", "employee"],
      children: [
        {
          id: "time-tracking-admin",
          label: "Time Tracking",
          path: "/admin/time-tracking",
          allowedRoles: ["super_admin", "hr", "manager", "dept_head"],
        },
        {
          id: "time-tracking-employee",
          label: "Time Tracking",
          path: "/employee/emp-timetracking",
          allowedRoles: ["employee"],
        },
      ],
    },
    {
      id: "visitingcards",
      label: "Visiting Cards",
      icon: IdCardIcon,
      path: "/admin/visitingcards",
      allowedRoles: ["super_admin", "hr"],
    },
    {
      id: "visitingcards",
      label: "Visiting Cards",
      icon: IdCardIcon,
      path: "/employee/employee-visitingcards",
      allowedRoles: ["employee"],
    },
    {
      id: "idcard",
      label: "ID Card",
      icon: IdCardIcon,
      allowedRoles: ["super_admin", "hr", "manager", "dept_head", "employee"],
      children: [
        {
          id: "idcards",
          label: "View ID Card",
          icon: IdCardIcon,
          path: "/employee/employee-idcards",
          allowedRoles: ["employee", "hr", "manager", "dept_head"],
        },
        {
          id: "idcard",
          label: "ID Card",
          icon: IdCardIcon,
          path: "/idcard",
          allowedRoles: [ "hr", "manager", "dept_head", "super_admin"],
        },
      ],
    },

    {
      id: "travelexpenses",
      label: "Travel Expenses",
      icon: Waypoints,
      path: "/employee/travel-expenses",
      allowedRoles: ["dept_head", "employee", "manager"],
    },
    {
      id: "travelexpenses",
      label: "Travel Expenses",
      icon: Waypoints,
      path: "/admin/travel-expense",
      allowedRoles: ["super_admin", "hr" ],
    },
  ];

  const profileItems = [
    {
      id: "profile",
      label: "Profile",
      icon: PersonStanding,
      path: "/profile",
      allowedRoles: ["super_admin", "hr", "dept_head", "manager", "employee"],
    },
    {
      id: "logout",
      label: "Logout",
      icon: LogOut,
      path: "/login",
      allowedRoles: ["super_admin", "hr", "dept_head", "manager", "employee"],
    },
  ];

  const filteredMenuItems = menuItems
    .filter((menu) => menu.allowedRoles.includes(user?.role))
    .map((menu) => {
      if (menu.children) {
        const filteredChildren = menu.children.filter((child) =>
          child.allowedRoles.includes(user?.role)
        );
        return { ...menu, children: filteredChildren };
      }
      return menu;
    });

  const filteredProfileItems = profileItems.filter((item) =>
    item.allowedRoles.includes(user?.role)
  );

  return (
    <>
    <div className="">
      <aside
        className={`
          fixed top-16 inset-y-0 z-40 
          bg-white text-gray-800 border-r border-gray-200 
          transform transition-transform duration-300 ease-in-out 
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 
          flex flex-col
          max-h-screen
        `}
      >
        <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;

            if (item.path && (!item.children || item.children.length === 0)) {
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={({ isActive }) =>
                    `w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 
                    ${
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
            }

            if (item.children) {
              const isActive = activeTab === item.id;
              return (
                <div key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab((prev) => (prev === item.id ? "" : item.id));
                      if (item.path && item.children.length === 0) {
                        setIsMobileMenuOpen(false);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 
                      ${
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

                  {isActive && item.children.length > 0 && (
                    <div className="ml-6 mt-2 space-y-1">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.id}
                          to={child.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `block px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 
                            ${
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
                  `w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 
                  ${
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
          <div className="p-4 border-t-2 border-gray-200">
            {filteredProfileItems.map((item) => {
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
                    `w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 
                    ${
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
        </nav>
      </aside>
      </div>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default AppSidebar;
