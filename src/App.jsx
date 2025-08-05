// App.jsx
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './Components/dashboard/Dashboard';
import Home from './pages/HomePage/home';
import AppLayout from './layout/AppLayout';
import Attendance from './pages/AttendanceManagement/Attendance';
import Payroll from './pages/PayrollManagement/Payroll';
import Performance from "./pages/PerformanceManagement/Performance"

const App = () => {
  return (
    <BrowserRouter>
   <AppLayout >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='/attendance' element={<Attendance/>}/>
        <Route path='/payroll' element={<Payroll/>}/>
         <Route path='/performance' element={<Performance/>}/>
        


      </Routes>
    </AppLayout>
    </BrowserRouter>
  );
};

export default App;
