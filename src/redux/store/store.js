import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import leaveReducer from '../slices/leaveSlice';
import employeeReducer from '../slices/employeeSlice';
import payrollReducer from '../slices/payrollSlice'
import payslipReducer from '../slices/payslipSlice';
import userReducer from '../slices/userSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    leaves: leaveReducer,
    employee: employeeReducer,
    payroll: payrollReducer,
    payslip: payslipReducer,
    user: userReducer,
  },
});
export default store;

