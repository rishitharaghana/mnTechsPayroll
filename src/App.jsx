// App.jsx
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './Components/dashboard/Dashboard';
import Home from './pages/HomePage/home';
import AppLayout from './layout/AppLayout';
;

const App = () => {
  return (
    <BrowserRouter>
   <AppLayout >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </AppLayout>
    </BrowserRouter>
  );
};

export default App;
