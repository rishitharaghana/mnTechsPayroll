// App.jsx
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Components/dashboard/Dashboard";
import Home from "./pages/HomePage/home";
import AppLayout from "./layout/AppLayout";
import Attendance from "./pages/AttendanceManagement/Attendance";
import Payroll from "./pages/PayrollManagement/Payroll";
import Performance from "./pages/PerformanceManagement/Performance";
import Payslip from "./pages/PayslipManagement/Payslip";
import HolidayCalendar from "./pages/HolidayCalendar/Calendar";
import Cards from "./pages/Cards/Cards";
import Employee from "./pages/EmployeeManagement/Employee";
import LeaveTracker  from "./pages/LeaveManagement/LeaveTracker";

const App = () => {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/payroll" element={<Payroll />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/payslip" element={<Payslip />} />
          <Route path="/calendar" element={<HolidayCalendar />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/employees" element={<Employee />} />
          <Route path ='/leave_tracker' element={<LeaveTracker/>}  />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
};

export default App;
