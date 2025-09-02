import React, { useState } from "react";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import { Outlet } from "react-router-dom";

const AppLayout = ({ children }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-teal-50">
      <AppHeader
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <div className="flex">
        <AppSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        <main className="w-full justify-items-end p-4 lg:p-8">
           <Outlet /> 
          <div className="w-fulll m-auto ">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
