// App.jsx
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './Components/dashboard/Dashboard';
import Home from './pages/HomePage/home';
import AppLayout from './layout/AppLayout';
import Attendance from './pages/AttendanceManagement/Attendance'
;
import Payslip from './pages/PayslipManagement/Payslip';
import HolidayCalendar from './pages/HolidayCalendar/Calendar';

const App = () => {
  return (
    <BrowserRouter>
   <AppLayout >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='/attendance' element={<Attendance/>}/>
        <Route path = '/payslip' element= {<Payslip/>} />
        <Route path = '/calendar' element={<HolidayCalendar/>} />
      </Routes>
    </AppLayout>
    </BrowserRouter>
  );
};

export default App;
