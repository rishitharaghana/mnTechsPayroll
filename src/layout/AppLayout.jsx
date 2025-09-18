import React, { useState } from "react";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import { Outlet } from "react-router-dom";

const AppLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="max-w-[1536px] min-h-screen mx-auto bg-gradient-to-br from-indigo-50 via-purple-50 to-teal-50 flex flex-col">
      <AppHeader
        className="max-w"
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <div className="flex justify-between w-full">
        <div className="lg:w-[19%] xl:w-[18%] 2xl:w-[16%] lg:mr-8 xl:mr-3 2xl:mr-0">
          <AppSidebar
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
        </div>
        <div className="lg:w-[79%] xl:w-[82%] 2xl:w-[84%] w-full">
          <main
            className={`
            flex-1 p-4 sm:p-6 md:p-8 
            transition-all duration-300
            max-w-full
          `}
          >
            <Outlet />
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
