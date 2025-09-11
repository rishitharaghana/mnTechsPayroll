import React, { useState } from "react";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import { Outlet } from "react-router-dom";

const AppLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="max-w-[1536px] mx-auto bg-gradient-to-br from-indigo-50 via-purple-50 to-teal-50 flex flex-col">
      <AppHeader
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <div className="flex flex-1">
        <AppSidebar
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        <main
          className={`
            flex-1 p-4 sm:p-6 md:p-8 
            lg:ml-64 sm:ml-0 
            transition-all duration-300
            max-w-full
          `}
        >
          <Outlet />
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;