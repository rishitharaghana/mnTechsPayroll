import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import leaveReducer from '../slices/leaveSlice';
import employeeReducer from '../slices/employeeSlice';
import payrollReducer from '../slices/payrollSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    leave: leaveReducer,
    employee: employeeReducer,
    payroll: payrollReducer,
  },
});
export default store;

