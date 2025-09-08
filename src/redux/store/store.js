import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import leaveReducer from '../slices/leaveSlice';
import employeeReducer from '../slices/employeeSlice';
import payrollReducer from '../slices/payrollSlice'
import payslipReducer from '../slices/payslipSlice';
import userReducer from '../slices/userSlice';
import attendanceReducer from '../slices/attendanceSlice';
import travelExpensesReducer from '../slices/travelExpensesSlice';
import performanceReducer from '../slices/performanceSlice';
import siteVisitReducer from '../slices/siteVisitSlice';
import companyReducer from '../slices/companySlice';
import dashboardReducer from '../slices/dashboardSlice';
import visitingCardReducer from '../slices/visitingCardSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    leaves: leaveReducer,
    employee: employeeReducer,
    payroll: payrollReducer,
    payslip: payslipReducer,
    user: userReducer,
    attendance: attendanceReducer,
    travelExpenses: travelExpensesReducer,
    performance: performanceReducer,
    siteVisit : siteVisitReducer,
    company : companyReducer,
    dashboard: dashboardReducer,
    visitingCard : visitingCardReducer,
  },
});
export default store;

