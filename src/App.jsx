import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Dashboard from './Components/dashboard/Dashboard';
import Home from './pages/HomePage/home';
import AppLayout from './layout/AppLayout';
import Attendance from './pages/AttendanceManagement/Attendance';
import Payroll from './pages/PayrollManagement/Payroll';
import Performance from './pages/PerformanceManagement/Performance';
import Payslip from './pages/PayslipManagement/Payslip';
import Employee from './pages/EmployeeManagement/Employee';
import LeaveTracker from './pages/LeaveManagement/LeaveTracker';
import AddEmployee from './pages/EmployeeManagement/AddEmployee';
import PayslipForm from './form/PayslipForm';
import LeaveApplication from './pages/LeaveManagement/LeaveApplication';
import EmployeeLogin from './pages/Login/EmployeeLogin';
import AdminLogin from './pages/Login/AdminLogin';
import IdCardForm from './form/IdCardForm';
import UserProfile from './header/userProfile';
import EmployeePayslip from './pages/PayslipManagement/EmployeePayslip';
import Settings from './pages/settings/Settings';
import VisitingCard from './pages/Cards/VisitingCard';
import LeaveDashboard from './pages/LeaveManagement/LeaveDashboard';
import AddEmployeeReview from './pages/PerformanceManagement/AddEmployeeReview';
import IdCard from './pages/Cards/IdCard';
import EmployeeAttendance from './pages/AttendanceManagement/EmployeeAttendance';
import PayslipGenerator from './pages/PayslipManagement/PaySlipGenerator';
import GeneratePayroll from './pages/PayrollManagement/GeneratePayroll';
import ViewIdCard from './pages/Cards/ViewIdCard';
import EmployeeDashboard from './Components/dashboard/EmployeeDashboard';
import CalendarIntegration from './pages/HolidayCalendar/CalendarIntegration';
import { PayrollHistory } from './pages/PayrollManagement/PayrollHistory';

const App = () => {
  return (
    <GoogleOAuthProvider clientId="https://www.googleapis.com/auth/userinfo.profile">
      <BrowserRouter>
        <Routes>
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/employee-login" element={<EmployeeLogin />} />
        </Routes>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/attendance" element={<Attendance />} />
            <Route path="/admin/payroll" element={<Payroll />} />
            <Route path="/admin/payslip-generator/:id" element={<PayslipGenerator />} />
            <Route path="/admin/generate-payroll" element={<GeneratePayroll />} />
            <Route path="/admin/add-performance" element={<AddEmployeeReview />} />
            <Route path="/admin/performance" element={<Performance />} />
            <Route path="/admin/payslip" element={<Payslip />} />
            <Route path="/admin/calendar" element={<CalendarIntegration />} />
            <Route path="/admin/visitingcards" element={<VisitingCard />} />
            <Route path="/admin/employees" element={<Employee />} />
            <Route path="/admin/employees/add-employee" element={<AddEmployee />} />
            <Route path="/admin/payslip/payslip-form" element={<PayslipForm />} />
            <Route path="/admin/leave-tracker" element={<LeaveTracker />} />
            <Route path="/employee/leave-application" element={<LeaveApplication />} />
            <Route path="/idcard" element={<IdCard />} />
            <Route path="/idcard/idcard-form" element={<IdCardForm />} />
            <Route path="/idcard/:id" element={<ViewIdCard />} />
            <Route path="/userprofile" element={<UserProfile />} />
            <Route path="/employee-payslip" element={<EmployeePayslip />} />
            <Route path="/employee/employee-attendance" element={<EmployeeAttendance />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/employee/leave-dashboard" element={<LeaveDashboard />} />
            <Route path="/emp-dashboard" element={<EmployeeDashboard />} />
             <Route path="/pay-history" element={<PayrollHistory/>} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

export default App;