import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Layout
import AppLayout from './layout/AppLayout';

// Auth Pages
import AdminLogin from './pages/Login/AdminLogin';
import EmployeeLogin from './pages/Login/EmployeeLogin';

// Dashboard & Common
import Home from './pages/HomePage/home';
import Dashboard from './Components/dashboard/Dashboard';
import EmployeeDashboard from './Components/dashboard/EmployeeDashboard';
import UserProfile from './header/userProfile';
import Settings from './pages/settings/Settings';

// Employee Management
import Employee from './pages/EmployeeManagement/Employee';
import AddEmployee from './pages/EmployeeManagement/AddEmployee';

// Attendance
import Attendance from './pages/AttendanceManagement/Attendance';
import EmployeeAttendance from './pages/AttendanceManagement/EmployeeAttendance';

// Payroll & Payslip
import Payroll from './pages/PayrollManagement/Payroll';
import GeneratePayroll from './pages/PayrollManagement/GeneratePayroll';
import PayrollHistory from './pages/PayrollManagement/PayrollHistory';
import Payslip from './pages/PayslipManagement/Payslip';
import PayslipGenerator from './pages/PayslipManagement/PaySlipGenerator';
import PayslipForm from './form/PayslipForm';
import EmployeePayslip from './pages/PayslipManagement/EmployeePayslip';

// Performance
import Performance from './pages/PerformanceManagement/Performance';
import AddEmployeeReview from './pages/PerformanceManagement/AddEmployeeReview';

// Leave Management
import LeaveTracker from './pages/LeaveManagement/LeaveTracker';
import LeaveApplication from './pages/LeaveManagement/LeaveApplication';
import LeaveDashboard from './pages/LeaveManagement/LeaveDashboard';

// Cards
import IdCard from './pages/Cards/IdCard';
import ViewIdCard from './pages/Cards/ViewIdCard';
import IdCardForm from './form/IdCardForm';
import VisitingCard from './pages/Cards/VisitingCard';

// Calendar
import CalendarIntegration from './pages/HolidayCalendar/CalendarIntegration';

const App = () => {
  return (
    <GoogleOAuthProvider clientId="https://www.googleapis.com/auth/userinfo.profile">
      <BrowserRouter>
        <Routes>
          {/* ❌ Public Routes (no layout) */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/employee-login" element={<EmployeeLogin />} />

          {/* ✅ Protected Routes inside AppLayout */}
          <Route element={<AppLayout />}>
            {/* Dashboard & User */}
            <Route path="/" element={<Home />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/emp-dashboard" element={<EmployeeDashboard />} />
            <Route path="/userprofile" element={<UserProfile />} />
            <Route path="/settings" element={<Settings />} />

            {/* Employee Management */}
            <Route path="/admin/employees" element={<Employee />} />
            <Route path="/admin/employees/add-employee" element={<AddEmployee />} />

            {/* Attendance */}
            <Route path="/admin/attendance" element={<Attendance />} />
            <Route path="/employee/employee-attendance" element={<EmployeeAttendance />} />

            {/* Payroll & Payslip */}
            <Route path="/admin/payroll" element={<Payroll />} />
            <Route path="/admin/generate-payroll" element={<GeneratePayroll />} />
            <Route path="/pay-history" element={<PayrollHistory />} />
            <Route path="/admin/payslip" element={<Payslip />} />
            <Route path="/admin/payslip-generator/:id" element={<PayslipGenerator />} />
            <Route path="/admin/payslip/payslip-form" element={<PayslipForm />} />
            <Route path="/employee-payslip" element={<EmployeePayslip />} />

            {/* Performance */}
            <Route path="/admin/performance" element={<Performance />} />
            <Route path="/admin/add-performance" element={<AddEmployeeReview />} />

            {/* Leave Management */}
            <Route path="/admin/leave-tracker" element={<LeaveTracker />} />
            <Route path="/employee/leave-application" element={<LeaveApplication />} />
            <Route path="/employee/leave-dashboard" element={<LeaveDashboard />} />

            {/* Cards */}
            <Route path="/idcard" element={<IdCard />} />
            <Route path="/idcard/idcard-form" element={<IdCardForm />} />
            <Route path="/idcard/:id" element={<ViewIdCard />} />
            <Route path="/admin/visitingcards" element={<VisitingCard />} />

            {/* Calendar */}
            <Route path="/admin/calendar" element={<CalendarIntegration />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

export default App;
