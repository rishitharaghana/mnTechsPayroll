import React, { useState, useEffect } from "react";
import { Eye, User, Building, Archive } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUserProfile } from "../../redux/slices/employeeSlice.js";
import VisitCardPreview from "./VisitCardPreview"; // Assuming this component exists
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";

// Card styles (same as in VisitingCard)
const cardStyles = [
  {
    id: "modern",
    name: "Modern Template",
    image: "/assets/ModernTempFront.png",
  },
  {
    id: "classic",
    name: "Classic Template",
    image: "/assets/ClassicTempFront.png",
  },
  {
    id: "minimal",
    name: "Minimal Template",
    image: "/assets/MinimalTempFront.png",
  },
  {
    id: "corporate",
    name: "Corporate Template",
    image: "/assets/CorporateTempFront.png",
  },
];

// CardStylePopup Component (reused from VisitingCard)
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

const EmployeeVisitingCard = () => {
  const dispatch = useDispatch();
  // Fix: Select 'profile' instead of 'employees'
  const { profile, loading, error } = useSelector((state) => state.employee);

  const [selectedStyle, setSelectedStyle] = useState("modern");
  const [showPreview, setShowPreview] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupStyle, setPopupStyle] = useState(null);

  // Fetch current user profile on mount
  useEffect(() => {
    console.log("Dispatching getCurrentUserProfile");
    dispatch(getCurrentUserProfile());
  }, [dispatch]);

  // Debug log to confirm Redux state
  console.log("Redux state in component:", { profile, loading, error });

  // Use profile directly as currentEmployee
  const currentEmployee = profile;

  const handleGenerateSingle = () => {
    if (!currentEmployee) return;
    alert(
      `✅ Single card generated!\n\nEmployee: ${currentEmployee.full_name}\nStyle: ${selectedStyle}`
    );
  };

  const handleGenerateDepartment = () => {
    alert("This feature is available only to administrators.");
  };

  const handleBulkExport = () => {
    alert("This feature is available only to administrators.");
  };

  const handleStyleClick = (styleId) => {
    setPopupStyle(styleId);
    setShowPopup(true);
  };

  return (
    <div className="w-full px-4 sm:px-0">
      <div className="min-h-screen">
        {showPreview ? (
          <VisitCardPreview
            employee={currentEmployee}
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
            <div className="flex justify-end">
              <PageBreadcrumb
                items={[
                  { label: "Home", link: "/dashboard" },
                  {
                    label: "My Visiting Card",
                    link: "/employee/visiting-card",
                  },
                ]}
              />
              <PageMeta title="My Visiting Card" />
            </div>

            <div className="w-full bg-white rounded-2xl px-4 sm:px-6 lg:px-8 py-8">
              {/* Controls */}
              <div className="bg-white border rounded-2xl shadow-md p-6 mb-8">
                <div className="mb-9">
                  <h1 className="text-2xl font-bold text-slate-700 mb-1">
                    My Visiting Card
                  </h1>
                  <p className="text-gray-400">
                    Create your personalized business card
                  </p>
                </div>

                {loading ? (
                  <div className="text-slate-500 flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-gray-600"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Loading your details...
                  </div>
                ) : error ? (
                  <div className="text-red-500 flex justify-between items-center bg-red-100 p-2 rounded">
                    {error}
                    <button
                      onClick={() => dispatch(getCurrentUserProfile())}
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      Retry
                    </button>
                  </div>
                ) : !currentEmployee ? (
                  <p className="text-slate-500 text-center">
                    No employee data available. Please ensure your profile is
                    complete.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Employee Info (Read-only) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Details
                      </label>
                      <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100">
                        {currentEmployee.full_name} -{" "}
                        {currentEmployee.designation_name} (
                        {currentEmployee.department_name})
                      </div>
                    </div>

                    {/* Style Dropdown */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Card Style
                      </label>
                      <select
                        value={selectedStyle}
                        onChange={(e) => setSelectedStyle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 bg-white shadow-sm"
                      >
                        {cardStyles.map((style) => (
                          <option key={style.id} value={style.id}>
                            {style.name}
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
                )}
              </div>

              {/* Card Styles Grid */}
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
                      <h3 className="font-semibold text-gray-900">
                        {style.name}
                      </h3>
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
                {/* Single Card */}
                <div className="bg-white border rounded-lg shadow-sm p-6 text-center hover:shadow-md">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Generate Your Card
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Generate a high-quality card with your details
                  </p>
                  <button
                    onClick={handleGenerateSingle}
                    className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2 px-4 rounded-lg"
                    disabled={!currentEmployee}
                  >
                    Generate Card
                  </button>
                </div>

                {/* Department Cards (Disabled for Employees) */}
                <div className="bg-white border rounded-lg shadow-sm p-6 text-center opacity-50">
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
                    className="w-full bg-green-100 text-green-700 font-medium py-2 px-4 rounded-lg opacity-50 cursor-not-allowed"
                    disabled
                  >
                    Generate Batch
                  </button>
                </div>

                {/* Bulk Export (Disabled for Employees) */}
                <div className="bg-white border rounded-lg shadow-sm p-6 text-center opacity-50">
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
                    className="w-full bg-purple-100 text-purple-700 font-medium py-2 px-4 rounded-lg opacity-50 cursor-not-allowed"
                    disabled
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
};

export default EmployeeVisitingCard;
