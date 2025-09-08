import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AppLayout from "./layout/AppLayout";
import Home from "./pages/HomePage/home";
import Dashboard from "./Components/dashboard/Dashboard";
import EmployeeDashboard from "./Components/dashboard/EmployeeDashboard";
import UserProfile from "./header/userProfile";
import EditProfile from "./header/EditProfile";
import Employee from "./pages/EmployeeManagement/Employee";
import AssignEmployee from "./pages/EmployeeManagement/AssignEmployee";
import Attendance from "./pages/AttendanceManagement/Attendance";
import EmployeeAttendance from "./pages/AttendanceManagement/EmployeeAttendance";
import Payroll from "./pages/PayrollManagement/Payroll";
import GeneratePayroll from "./pages/PayrollManagement/GeneratePayroll";
import PayrollHistory from "./pages/PayrollManagement/PayrollHistory";
import Payslip from "./pages/PayslipManagement/Payslip";
import PayslipGenerator from "./pages/PayslipManagement/PayslipGenerator";
import PayslipForm from "./form/PayslipForm";
import EmployeePayslip from "./pages/PayslipManagement/EmployeePayslip";
import Performance from "./pages/PerformanceManagement/Performance";
import AddEmployeeReview from "./pages/PerformanceManagement/AddEmployeeReview";
import LeaveTracker from "./pages/LeaveManagement/LeaveTracker";
import LeaveApplication from "./pages/LeaveManagement/LeaveApplication";
import LeaveDashboard from "./pages/LeaveManagement/LeaveDashboard";
import IdCard from "./pages/Cards/IdCard";
import ViewIdCard from "./pages/Cards/ViewIdCard";
import VisitingCard from "./pages/Cards/VisitingCard";
import CalendarIntegration from "./pages/HolidayCalendar/CalendarIntegration";
import TimeTracking from "./pages/timetracking/TimeTracking";
import AdminForm from "./pages/Login/AdminForm";
import EmployeeDetails from "./pages/EmployeeManagement/EmployeeDetails";
import Login from "./pages/Login/Login";
import Unauthorized from "./pages/Others/UnAuthorized";
import ProtectedRoute from "./context/ProtectedRoute";
import EmployeeTimeTracking from "./pages/timetracking/EmployeeTimeTracking";
import VisitingCardForm from "./form/VisitingCardForm";
import ViewGoals from "./pages/PerformanceManagement/ViewGoals";
import EmployeeTravelExpenses from "./pages/TravelExpenses/EmployeeTravelExpenses";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChangePassword from "./pages/Login/ChangePassword";
import TravelExpenseApproval from "./pages/TravelExpenses/TravelExpenseApproval";
import TravelExpenseSubmission from "./pages/TravelExpenses/TravelExpensesSubmission";
import ViewEmployeeDetails from "./pages/EmployeeManagement/ViewEmployeeDetails";
import EmployeePreviewPage from "./pages/EmployeeManagement/EmployeePreviewPage";
import EmployeeIdCards from "./pages/Cards/EmployeeIdCards";
import EmployeeVisitingCard from "./pages/Cards/EmployeeVisitingCard";
import AnnualCalendar from "./pages/HolidayCalendar/AnnualCalendar";
import EmployeeAvgHours from "./pages/AttendanceManagement/EmployeeAvgHours";

const App = () => {
  return (
    <GoogleOAuthProvider clientId="https://www.googleapis.com/auth/userinfo.profile">
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

        <Routes>
          <Route path="/login" element={<Login />} />
          {/* <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} /> */}
          <Route path="/change-password" element={<ChangePassword />} />

          <Route
            element={
              <ProtectedRoute
                allowedRoles={[
                  "super_admin",
                  "hr",
                  "dept_head",
                  "manager",
                  "employee",
                ]}
              />
            }
          >
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route
                element={
                  <ProtectedRoute
                    allowedRoles={["super_admin", "hr", "manager", "dept_head"]}
                  />
                }
              >
                <Route
                  path="/admin/view-employees"
                  element={<ViewEmployeeDetails />}
                />
                <Route
                  path="/admin/working-hours"
                  element={<EmployeeAvgHours />}
                />

                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/employees" element={<Employee />} />
                <Route
                  path="/admin/assign-employee"
                  element={<AssignEmployee />}
                />
                <Route path="/admin/attendance" element={<Attendance />} />
                <Route path="/admin/payroll" element={<Payroll />} />
                <Route
                  path="/admin/generate-payroll"
                  element={<GeneratePayroll />}
                />
                <Route path="/pay-history" element={<PayrollHistory />} />
                <Route path="/admin/payslip" element={<Payslip />} />
                <Route
                  path="/admin/payslip-generator/:id"
                  element={<PayslipGenerator />}
                />
                <Route
                  path="/admin/payslip/payslip-form"
                  element={<PayslipForm />}
                />
                <Route path="/admin/performance" element={<Performance />} />
                <Route
                  path="/admin/add-performance"
                  element={<AddEmployeeReview />}
                />
                <Route path="/admin/leave-tracker" element={<LeaveTracker />} />
                <Route path="/admin/visitingcards" element={<VisitingCard />} />
                <Route path="/admin/time-tracking" element={<TimeTracking />} />
                <Route path="/admin/admin-form" element={<AdminForm />} />
                <Route
                  path="/admin/travel-expense"
                  element={<TravelExpenseApproval />}
                />
                <Route
                  path="/admin/travel-expsense/details"
                  element={<TravelExpenseSubmission />}
                />
                <Route
                  path="/admin/employees/preview/:id"
                  element={<EmployeePreviewPage />}
                />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={["employee"]} />}>
                <Route path="/emp-dashboard" element={<EmployeeDashboard />} />

                <Route path="/employee-payslip" element={<EmployeePayslip />} />
                <Route path="/employee/viewgoals" element={<ViewGoals />} />

                <Route
                  path="/employee/leave-dashboard"
                  element={<LeaveDashboard />}
                />

                <Route
                  path="/employee/employee-visitingcards"
                  element={<EmployeeVisitingCard />}
                />
                {/* <Route
                  path="/employee/employee-details"
                  element={<EmployeeDetails />}
                /> */}
                <Route
                  path="/employee/emp-timetracking"
                  element={<EmployeeTimeTracking />}
                />
                <Route
                  path="/employee/travel-expenses"
                  element={<EmployeeTravelExpenses />}
                />
              </Route>

              <Route
                element={
                  <ProtectedRoute
                    allowedRoles={["employee", "dept_head", "manager", "hr"]}
                  />
                }
              >
                <Route
                  path="/employee/employee-details"
                  element={<EmployeeDetails />}
                />
                <Route
                  path="/leave-application"
                  element={<LeaveApplication />}
                />
              </Route>

              <Route
                element={
                  <ProtectedRoute
                    allowedRoles={[
                      "super_admin",
                      "hr",
                      "employee",
                      "manager",
                      "dept_head",
                    ]}
                  />
                }
              >
                <Route
                  path="/employee/employee-attendance"
                  element={<EmployeeAttendance />}
                />
                <Route
                  path="/admin/calendar"
                  element={<CalendarIntegration />}
                />
                <Route
                  path="/admin/annual-calendar"
                  element={<AnnualCalendar />}
                />
              </Route>

              <Route path="/userprofile" element={<UserProfile />} />
              <Route path="/profile" element={<EditProfile />} />
              <Route path="/idcard/" element={<ViewIdCard />} />
              <Route path="/visitingcard-form" element={<VisitingCardForm />} />
            </Route>
          </Route>

          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

export default App;
