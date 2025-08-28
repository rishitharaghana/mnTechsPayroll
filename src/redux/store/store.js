import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import leaveReducer from '../slices/leaveSlice';
import employeeReducer from '../slices/employeeSlice';
import payrollReducer from '../slices/payrollSlice'
import payslipReducer from '../slices/payslipSlice';
import userReducer from '../slices/userSlice';
import attendanceReducer from '../slices/attendanceSlice';
import employeeDetailsReducer from '../slices/employeeDetailsSlice';
import travelExpensesReducer from '../slices/travelExpensesSlice';
import performanceReducer from '../slices/performanceSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    leaves: leaveReducer,
    employee: employeeReducer,
    payroll: payrollReducer,
    payslip: payslipReducer,
    user: userReducer,
    attendance: attendanceReducer,
    employeeDetails: employeeDetailsReducer,
    travelExpenses: travelExpensesReducer,
    performance: performanceReducer,
  },
});
export default store;

