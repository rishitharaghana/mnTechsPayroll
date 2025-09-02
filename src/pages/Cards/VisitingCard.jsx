import React, { useState } from "react";
import { Eye, User, Building, Archive, X } from "lucide-react";
import VisitCardPreview from "./VisitCardPreview";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";
// import VisitingCardForm from "../../form/VisitingCardForm";

// Employee data
const employees = [
  {
    id: 1,
    name: "Jeevan Sekhar",
    position: "Associate Software Engineer",
    department: "Tech Team",
    email: "jeevan@company.com",
    phone: "6301234567",
    website: "www.jeevan.com",
    address: "Jeevan Nagar, Tech City, State 12345",
  },
  {
    id: 2,
    name: "Rishitha",
    position: "Associate Software Engineer",
    department: "Tech Team",
    email: "rishitha@company.com",
    phone: "9876543210",
    website: "www.rishitha.com",
    address: "Rishitha Nagar, Tech City, State 12345",
  },
  {
    id: 3,
    name: "Arun",
    position: "Graphic Designer",
    department: "Design Team",
    email: "arun@company.com",
    phone: "6305012345",
    website: "www.arun.com",
    address: "Arun Nagar, Design City, State 12345",
  },
  {
    id: 4,
    name: "Prasanth Kumar",
    position: "Digital Marketing",
    department: "Marketing Team",
    email: "prasanth@company.com",
    phone: "7301234567",
    website: "www.prasanth.com",
    address: "Prasanth Nagar, Marketing City, State 12345",
  },
  {
    id: 5,
    name: "Nayudu",
    position: "Frontend Developer",
    department: "Tech Team",
    email: "nayudu@company.com",
    phone: "9515012345",
    website: "www.nayudu.com",
    address: "Nayudu Nagar, Tech City, State 12345",
  },
];

const cardStyles = [
  {
    id: "modern",
    name: "Modern Template",
    image: "../assets/ModernTempFront.png",
  },
  {
    id: "classic",
    name: "Classic Template",
    image: "../assets/ClassicTempFront.png",
  },
  {
    id: "minimal",
    name: "Minimal Template",
    image: "../assets/MinimalTempFront.png",
  },
  {
    id: "corporate",
    name: "Corporate Template",
    image: "../assets/CorporateTempFront.png",
  },
];

// CardStylePopup Component (Integrated)
const CardStylePopup = ({ style, onClose }) => {
  // Map card styles to local image paths
  const cardImages = {
    modern: {
      front: "../assets/ModernTempFront.png",
      back: "../assets/ModernTempBack.png",
      name: "Modern",
      description: "Gradient with clean typography",
    },
    classic: {
      front: "../assets/ClassicTempFront.png",
      back: "../assets/ClassicTempBack.png",
      name: "Classic",
      description: "Traditional business card design",
    },
    minimal: {
      front: "../assets/MinimalTempFront.png",
      back: "../assets/MinimalTempBack.png",
      name: "Minimal",
      description: "Clean and simple layout",
    },
    corporate: {
      front: "../assets/CorporateTempFront.png",
      back: "../assets/CorporateTempBack.png",
      name: "Corporate",
      description: "Professional business theme",
    },
  };

  const selectedCard = cardImages[style];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-xl font-semibold text-slate-700">
            {selectedCard.name} Template
          </h2>
        </div>
        <p className="text-sm text-slate-500 mb-6">
          {selectedCard.description}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Front</h3>
            <img
              src={selectedCard.front}
              alt={`${selectedCard.name} front`}
              className="w-full h-auto rounded-lg shadow-sm transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
            />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Back</h3>
            <img
              src={selectedCard.back}
              alt={`${selectedCard.name} back`}
              className="w-full h-auto rounded-lg shadow-sm transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mt-6 max-w-max bg-slate-700 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

function VisitingCard() {
  const [selectedEmployee, setSelectedEmployee] = useState(employees[0]);
  const [selectedStyle, setSelectedStyle] = useState("modern");
  const [showPreview, setShowPreview] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupStyle, setPopupStyle] = useState(null);

  const handleEmployeeChange = (e) => {
    const employee = employees.find(
      (emp) => emp.id === parseInt(e.target.value)
    );
    if (employee) setSelectedEmployee(employee);
  };

  const handleGenerateSingle = () => {
    const generationSteps = [
      "Preparing card template...",
      "Processing employee data...",
      "Applying selected style...",
      "Generating high-resolution output...",
      "Creating print-ready PDF...",
    ];
    let step = 0;
    const interval = setInterval(() => {
      console.log(generationSteps[step]);
      step++;
      if (step >= generationSteps.length) {
        clearInterval(interval);
        alert(
          `✅ Single card generated successfully!\n\nEmployee: ${selectedEmployee.name}\nStyle: ${selectedStyle}`
        );
      }
    }, 500);
  };

  const handleGenerateDepartment = () => {
    const departmentEmployees = employees.filter(
      (emp) => emp.department === selectedEmployee.department
    );
    const batchSteps = [
      `Collecting ${departmentEmployees.length} employees from ${selectedEmployee.department} department...`,
      "Creating batch template...",
      "Processing employee data in bulk...",
      "Generating individual cards...",
      "Packaging into ZIP file...",
    ];
    let step = 0;
    const interval = setInterval(() => {
      console.log(batchSteps[step]);
      step++;
      if (step >= batchSteps.length) {
        clearInterval(interval);
        alert(
          `✅ Department cards generated successfully!\n\nDepartment: ${selectedEmployee.department}\nCards Generated: ${departmentEmployees.length}`
        );
      }
    }, 600);
  };

  const handleBulkExport = () => {
    const bulkData = {
      totalEmployees: employees.length,
      departments: [...new Set(employees.map((emp) => emp.department))],
    };
    const bulkSteps = [
      `Processing ${employees.length} employees across ${bulkData.departments.length} departments...`,
      "Creating master template set...",
      "Generating individual cards...",
      "Creating department-wise folders...",
      "Generating CSV employee list...",
      "Creating print layout sheets...",
      "Packaging complete export...",
    ];
    let step = 0;
    const interval = setInterval(() => {
      console.log(bulkSteps[step]);
      step++;
      if (step >= bulkSteps.length) {
        clearInterval(interval);
        alert(
          `✅ Bulk export completed successfully!\n\nTotal Cards: ${
            employees.length
          }\nDepartments: ${bulkData.departments.join(", ")}`
        );
      }
    }, 700);
  };

  const handleStyleClick = (styleId) => {
    setPopupStyle(styleId);
    setShowPopup(true);
  };

  return (
    <div className="w-78/100">
      <div className="min-h-screen">
        {showPreview ? (
          <VisitCardPreview
            employee={selectedEmployee}
            style={selectedStyle}
            onBack={() => setShowPreview(false)}
          />
        ) : showPopup ? (
          <CardStylePopup
            style={popupStyle}
            onClose={() => setShowPopup(false)}
          />
        ) : (
          <>
            {/* Header */}
            <div className="flex justify-end ">
              <PageBreadcrumb
                items={[
                  { label: "Home", href: "/" },
                  { label: "Visiting Card", href: "/admin/visitingcards" },
                ]}
              />
              <PageMeta title="Visiting Card" />
            </div>

            <div className="w-full bg-white rounded-2xl px-4 sm:px-6 lg:px-8 py-8">
              {/* Controls */}
              <div className="bg-white border-1 border-gray-200 rounded-2xl shadow-md p-6 mb-8">
                <div className="mb-9">
                  <h1 className="text-2xl font-bold text-slate-700 mb-1">
                    Visiting Card Generator
                  </h1>
                  <p className="text-gray-400">
                    Create professional business cards for employees
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Employee Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Employee
                    </label>
                    <select
                      value={selectedEmployee.id}
                      onChange={handleEmployeeChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {employees.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                          {employee.name} - {employee.position}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Style Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Card Style
                    </label>
                    <select
                      value={selectedStyle}
                      onChange={(e) => setSelectedStyle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white shadow-sm"
                    >
                      {cardStyles.map((style) => (
                        <option key={style.id} value={style.id}>
                          {style.name} {style.description}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Preview Button */}
                  <div className="flex items-end">
                    <button
                      onClick={() => setShowPreview(true)}
                      className="w-full bg-slate-700 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center space-x-2"
                    >
                      <Eye size={20} />
                      <span>Preview Card</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Styles Grid */}
              <div className="bg-white  rounded-2xl shadow-md border-1 border-gray-200 p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Card Styles
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {cardStyles.map((style) => (
                    <div
                      key={style.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                        selectedStyle === style.id
                          ? "border-slate-500 bg-slate-50 hover:border-teal-500 hover:bg-teal-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleStyleClick(style.id)}
                    >
                      <div className="mb-4">
                        <img
                          src={style.image}
                          alt={`${style.name} template`}
                          className="w-full h-auto rounded-lg shadow-sm"
                        />
                      </div>
                      <h3 className="font-semibold text-gray-900">
                        {style.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {style.description}
                      </p>
                      {selectedStyle === style.id && (
                        <div className="mt-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Selected
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Generation Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border-1 border-gray-200 rounded-lg shadow-sm p-6 text-center hover:shadow-md">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Single Card
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Generate high-quality print-ready card
                  </p>
                  <button
                    onClick={handleGenerateSingle}
                    className="w-full bg-blue-100 border-1 border-gray-200 hover:bg-blue-200 text-blue-700 font-medium py-2 px-4 rounded-lg"
                  >
                    Generate Card
                  </button>
                </div>

                <div className="bg-white border-1 border-gray-200 rounded-lg shadow-sm p-6 text-center hover:shadow-md">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Department Cards
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Generate cards for all employees in the department
                  </p>
                  <button
                    onClick={handleGenerateDepartment}
                    className="w-full bg-green-100 hover:bg-green-200 text-green-700 font-medium py-2 px-4 rounded-lg"
                  >
                    Generate Batch
                  </button>
                </div>

                <div className="bg-white border-1 border-gray-200 rounded-lg shadow-sm p-6 text-center hover:shadow-md">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Archive className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Bulk Export
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Export all employees with layouts and data
                  </p>
                  <button
                    onClick={handleBulkExport}
                    className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium py-2 px-4 rounded-lg"
                  >
                    Export All
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default VisitingCard;
