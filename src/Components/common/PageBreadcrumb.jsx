import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Clock, User, ChevronRight, Users, Calendar, CreditCard, FileChartColumnIncreasing,
     TrendingUp, RefreshCcw, IdCard, IdCardLanyard, BookText, CalendarDays, HandCoins, Target } from 'lucide-react';

const PageBreadcrumb = ({ items = [] }) => {
  const iconMap = {
    'Home': <Home className="h-4 w-4" />,
    'Attendance': <Clock className="h-4 w-4" />,
    'Employees': <Users className="h-4 w-4" />,
    'AddEmployee': <User className="h-4 w-4" />,
    'Leave Tracker': <CalendarDays className="h-4 w-4" />,
    'Generate Payroll': <HandCoins className="h-4 w-4" />,
    'Payroll': <CreditCard className="h-4 w-4" />,
    'Payslip': <FileChartColumnIncreasing className="h-4 w-4" />,
    'Calendar': <Calendar className="h-4 w-4" />,
    'Performance': <TrendingUp className="h-4 w-4" />,
    'Add Employee Review': <Target className="h-4 w-4" />,
    'Visiting Card': <IdCard className="h-4 w-4" />,
    'ID Cards': <IdCardLanyard className="h-4 w-4" />,
    'Generate ID Card': <IdCardLanyard className="h-4 w-4" />,
    'IdCardForm': <BookText className="h-4 w-4" />,
  };

  return (
    <nav aria-label="breadcrumb" className="flex items-center space-x-2 text-sm mb-4 p-2 rounded">
      {items.map((item, index) => {
        const isActive = index === items.length - 1;
        const textColor = isActive ? 'text-teal-600' : 'text-slate-700';
        const iconColor = isActive ? 'text-teal-600' : 'text-slate-700';

        // Fallback to a default icon or null if label is not in iconMap
        const icon = iconMap[item.label] || <Home className="h-4 w-4 text-gray-400" />;

        // Debugging: Log to check if icon is correctly mapped
        if (!iconMap[item.label]) {
          console.log(`Icon not found for label: ${item.label}`);
        }

        return (
          <div key={index} className="flex gap-2 items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-1 text-slate-700" />}
            {item.link ? (
              <Link
                to={item.link}
                className={`flex items-center transition-colors duration-200 ${textColor}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {React.cloneElement(icon, { className: `h-4 w-4 ${iconColor}` })}
                <span className="ml-1">{item.label}</span>
              </Link>
            ) : (
              <span className={`flex items-center font-medium ${textColor}`} aria-current={isActive ? 'page' : undefined}>
                {React.cloneElement(icon, { className: `h-4 w-4 ${iconColor}` })}
                <span className="ml-1">{item.label}</span>
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default PageBreadcrumb;