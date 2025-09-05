import React, { useState, useEffect } from "react";
import { Eye, User, Building, Archive } from "lucide-react";
import Select from "react-select";
import VisitCardPreview from "./VisitCardPreview";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees, updateEmployee } from "../../redux/slices/employeeSlice.js";

const cardStyles = [
  { id: "modern", name: "Modern Template", image: "/assets/ModernTempFront.png" },
  { id: "classic", name: "Classic Template", image: "/assets/ClassicTempFront.png" },
  { id: "minimal", name: "Minimal Template", image: "/assets/MinimalTempFront.png" },
  { id: "corporate", name: "Corporate Template", image: "/assets/CorporateTempFront.png" },
];

const employeeSelectStyles = {
  control: (provided) => ({
    ...provided,
    border: "1px solid #e2e8f0", 
    borderRadius: "0.5rem",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#64748b", 
    },
    fontSize: "0.875rem", 
    fontWeight: "500", 
    backgroundColor: "#f1f5f9", 
    padding: "0.08rem",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "0.3rem",
    border: "1px solid #000000", 
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", 
    maxHeight: "320px", 
    zIndex: 100,
  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: "0.875rem", 
    fontWeight: "500", 
    color: state.isSelected ? "#ffffff" : "#1e293b",
    backgroundColor: state.isSelected
      ? "#475569" 
      : state.isFocused
      ? "#e2e8f0" 
      : "#ffffff",
    "&:hover": {
      backgroundColor: "#e2e8f0", 
    },
    padding: "0.4rem",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#1e293b",
    fontSize: "0.875rem", 
    fontWeight: "500", 
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#64748b", 
    fontSize: "0.875rem", 
    fontWeight: "500", 
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: "#64748b", 
    "&:hover": {
      color: "#475569", 
    },
  }),
};

const cardStyleSelectStyles = {
  control: (provided) => ({
    ...provided,
    border: "1px solid #b2d9d4",
    borderRadius: "0.5rem",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#2dd4bf",
    },
    fontSize: "0.875rem", 
    fontWeight: "500", 
    backgroundColor: "#e6f7f5", 
    padding: "0.08rem",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "0.5rem",
    border: "1px solid #b2d9d4",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    maxHeight: "200px",
    zIndex: 100,
  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: "0.875rem",
    fontWeight: "500", 
    color: state.isSelected ? "#ffffff" : "#1e293b", 
    backgroundColor: state.isSelected
      ? "#0f766e" 
      : state.isFocused
      ? "#b2d9d4" 
      : "#ffffff",
    "&:hover": {
      backgroundColor: "#b2d9d4", 
    },
    padding: "0.5rem 1rem",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#1e293b", 
    fontSize: "0.875rem", 
    fontWeight: "500", 
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#5eead4", 
    fontSize: "0.875rem", 
    fontWeight: "500",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: "#5eead4", 
    "&:hover": {
      color: "#0f766e", 
    },
  }),
};

const CardStylePopup = ({ style, onClose }) => {
  const cardImages = {
    modern: {
      front: "/assets/ModernTempFront.png",
      back: "/assets/ModernTempBack.png",
      name: "Modern",
      description: "Gradient with clean typography",
    },
    classic: {
      front: "/assets/ClassicTempFront.png",
      back: "/assets/ClassicTempBack.png",
      name: "Classic",
      description: "Traditional business card design",
    },
    minimal: {
      front: "/assets/MinimalTempFront.png",
      back: "/assets/MinimalTempBack.png",
      name: "Minimal",
      description: "Clean and simple layout",
    },
    corporate: {
      front: "/assets/CorporateTempFront.png",
      back: "/assets/CorporateTempBack.png",
      name: "Corporate",
      description: "Professional business theme",
    },
  };

  const selectedCard = cardImages[style];

  if (!selectedCard) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-xl font-semibold text-slate-700">
            {selectedCard.name} Template
          </h2>
        </div>
        <p className="text-sm text-slate-500 mb-6">{selectedCard.description}</p>
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
  const dispatch = useDispatch();
  const { employees, loading, error } = useSelector((state) => state.employee);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState("modern");
  const [showPreview, setShowPreview] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupStyle, setPopupStyle] = useState(null);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  useEffect(() => {
    if (employees.length > 0 && !selectedEmployee) {
      setSelectedEmployee(employees[0]);
    }
  }, [employees, selectedEmployee]);

  const employeeOptions = employees.map((emp) => ({
    value: emp.id,
    label: `${emp.full_name} | ${emp.designation_name}`, 
  }));

  const cardStyleOptions = cardStyles.map((style) => ({
    value: style.id,
    label: style.name,
  }));

  const handleGenerateSingle = () => {
    if (!selectedEmployee) return;
    alert(
      `✅ Single card generated!\n\nEmployee: ${selectedEmployee.full_name}\nStyle: ${selectedStyle}`
    );
  };

  const handleGenerateDepartment = () => {
    if (!selectedEmployee) return;
    const departmentEmployees = employees.filter(
      (emp) => emp.department_name === selectedEmployee.department_name
    );
    alert(
      `✅ Department cards generated!\n\nDepartment: ${selectedEmployee.department_name}\nCards: ${departmentEmployees.length}`
    );
  };

  const handleBulkExport = () => {
    const departments = [...new Set(employees.map((emp) => emp.department_name))];
    alert(
      `✅ Bulk export completed!\n\nTotal Employees: ${employees.length}\nDepartments: ${departments.join(", ")}`
    );
  };

  const handleStyleClick = (styleId) => {
    setPopupStyle(styleId);
    setShowPopup(true);
  };

  return (
    <div className="w-full lg:w-[78%]">
      <div className="min-h-screen">
        {showPreview ? (
          <VisitCardPreview
            employee={selectedEmployee}
            style={selectedStyle}
            onBack={() => setShowPreview(false)}
          />
        ) : showPopup ? (
          <CardStylePopup style={popupStyle} onClose={() => setShowPopup(false)} />
        ) : (
          <>
            {/* Header */}
            <div className="flex justify-end">
              <PageBreadcrumb
                items={[
                  { label: "Home", link: "/admin/dashboard" },
                  { label: "Visiting Card", link: "/admin/visitingcards" },
                ]}
              />
              <PageMeta title="Visiting Card" />
            </div>

            <div className="w-full bg-white rounded-2xl px-4 sm:px-6 lg:px-8 py-8">
              {/* Controls */}
              <div className="bg-white border rounded-2xl shadow-md p-6 mb-8">
                <div className="mb-9">
                  <h1 className="text-2xl font-bold text-slate-700 mb-1">
                    Visiting Card Generator
                  </h1>
                  <p className="text-gray-400">
                    Create professional business cards for employees
                  </p>
                </div>

                {loading ? (
                  <p className="text-slate-500">Loading employees...</p>
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : employees.length === 0 ? (
                  <p className="text-slate-500">No employees available.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Employee Selector */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Employee
                      </label>
                      <Select
                        options={employeeOptions}
                        value={employeeOptions.find(
                          (option) => option.value === selectedEmployee?.id
                        )}
                        onChange={(selectedOption) => {
                          const emp = employees.find(
                            (x) => x.id === selectedOption.value
                          );
                          setSelectedEmployee(emp);
                        }}
                        styles={employeeSelectStyles}
                        placeholder="Select an employee"
                        isSearchable
                      />
                    </div>

                    {/* Card Style Selector */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Card Style
                      </label>
                      <Select
                        options={cardStyleOptions}
                        value={cardStyleOptions.find(
                          (option) => option.value === selectedStyle
                        )}
                        onChange={(selectedOption) =>
                          setSelectedStyle(selectedOption.value)
                        }
                        styles={cardStyleSelectStyles}
                        placeholder="Select a card style"
                        isSearchable
                      />
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
                )}
              </div>

              {/* Card Styles Grid (unchanged) */}
              <div className="bg-white rounded-2xl shadow-md border p-6 mb-8">
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
                      <h3 className="font-semibold text-gray-900">{style.name}</h3>
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

              {/* Generation Options (unchanged) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border rounded-lg shadow-sm p-6 text-center hover:shadow-md">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Single Card
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Generate a high-quality card for one employee
                  </p>
                  <button
                    onClick={handleGenerateSingle}
                    className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2 px-4 rounded-lg"
                  >
                    Generate Card
                  </button>
                </div>

                <div className="bg-white border rounded-lg shadow-sm p-6 text-center hover:shadow-md">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Department Cards
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Generate cards for all employees in a department
                  </p>
                  <button
                    onClick={handleGenerateDepartment}
                    className="w-full bg-green-100 hover:bg-green-200 text-green-700 font-medium py-2 px-4 rounded-lg"
                  >
                    Generate Batch
                  </button>
                </div>

                <div className="bg-white border rounded-lg shadow-sm p-6 text-center hover:shadow-md">
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
