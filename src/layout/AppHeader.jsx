import { Clock, Menu, X, Users, CircleUser } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AppHeader = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="backdrop-blur-md bg-white/80 border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-200"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 color: bg-teal-600 rounded-xl flex items-center justify-center">
                <Users className="text-white" size={20} />
              </div>
              {/* <h1 className="text-xl font-bold bg-slate from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Payroll
              </h1> */}
              <h1 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-slate-700 bg-clip-text text-transparent">
                Payroll
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <Clock size={16} />
              <span>{currentTime.toLocaleTimeString()}</span>
            </div>
            <div className="relative">
              <ul>
                <li>
                  <Link
                    to="/userprofile"
                    className="p-2 rounded-lg bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-200"
                  >
                    <CircleUser size={25} />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
