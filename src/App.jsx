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
import LeaveTracker from "./pages/LeaveManagement/LeaveTracker";
import AddEmployee from "./pages/EmployeeManagement/AddEmployee";
import PayslipForm from "./form/PayslipForm";
import LeaveApplication from "./pages/LeaveManagement/LeaveApplication";
import EmployeeLogin from "./pages/Login/EmployeeLogin";
import AdminLogin from "./pages/Login/AdminLogin";
import IdCard from "./pages/IdCards/IdCard";
import IdCardForm from "./form/IdCardForm";
import UserProfile from './header/userProfile'
import EmployeePayslip from "./pages/PayslipManagement/EmployeePayslip";
// import DatePicker from "./Components/ui/date/DatePicker";
import Settings from "./pages/settings/Settings";

const App = () => {
  return (
    <BrowserRouter>
    <Routes >
      <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/employee-login" element={<EmployeeLogin />} />
    </Routes>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/attendance" element={<Attendance />} />
          <Route path="/admin/payroll" element={<Payroll />} />
          <Route path="/admin/performance" element={<Performance />} />
          <Route path="/admin/payslip" element={<Payslip />} />
          <Route path="/admin/calendar" element={<HolidayCalendar />} />
          <Route path="/admin/visitingcards" element={<Cards />} />
          <Route path="/admin/employees" element={<Employee />} />
          <Route
            path="/admin/employees/add-employee"
            element={<AddEmployee />}
          />
          <Route path="/admin/payslip/payslip-form" element={<PayslipForm />} />
          <Route path="/admin/leave-tracker" element={<LeaveTracker />} />
          <Route path="/employee/leave-application" element={<LeaveApplication />} />
          <Route path="/idcard" element={<IdCard />} />
             <Route path="/idcard/idcard-form" element={<IdCardForm />} />
             <Route path='/userprofile' element={<UserProfile/>} />
                <Route path='/employee-payslip' element={<EmployeePayslip/>} />
                 {/* <Route path='/date' element={<DatePicker/>} /> */}

          <Route path="/settings" element={<Settings />} />


             


        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
};

export default App;
