// src/components/EmployeePreview.jsx
import React from "react";

const EmployeePreview = ({ formData, error, successMessage, closePreview, activeTab }) => {
  const tabGroups = [
    {
      title: "Personal Details",
      fields: [
        { label: "Full Name", value: formData.fullName || "N/A" },
        { label: "Father’s Name", value: formData.fatherName || "N/A" },
        { label: "Mother’s Name", value: formData.motherName || "N/A" },
        { label: "Phone", value: formData.phone || "N/A" },
        { label: "Email", value: formData.email || "N/A" },
        { label: "Gender", value: formData.gender || "N/A" },
        {
          label: "Image",
          value: formData.image ? (
            <div className="flex flex-col items-center">
              <img
                src={typeof formData.image === "string" ? formData.image : URL.createObjectURL(formData.image)}
                alt="Employee"
                className="w-32 h-32 rounded-lg shadow-md object-cover"
              />
            </div>
          ) : (
            "N/A"
          ),
        },
        { label: "Present Address", value: formData.presentAddress || "N/A" },
        { label: "Previous Address", value: formData.previousAddress || "N/A" },
      ],
    },
    {
      title: "Position Information",
      fields: [
        { label: "Position Type", value: formData.positionType || "N/A" },
        ...(formData.positionType === "experienced"
          ? [
              { label: "Employer ID/Name", value: formData.employerIdName || "N/A" },
              { label: "Position Title", value: formData.positionTitle || "N/A" },
              { label: "Employment Type", value: formData.employmentType || "N/A" },
              { label: "Joining Date", value: formData.joiningDate || "N/A" },
              { label: "Contract End Date", value: formData.contractEndDate || "N/A" },
            ]
          : []),
      ],
    },
    {
      title: "Education Details",
      fields: [
        { label: "10th Class Name", value: formData.tenthClassName || "N/A" },
        { label: "10th Class Marks", value: formData.tenthClassMarks ? `${formData.tenthClassMarks}%` : "N/A" },
        { label: "Intermediate Name", value: formData.intermediateName || "N/A" },
        { label: "Intermediate Marks", value: formData.intermediateMarks ? `${formData.intermediateMarks}%` : "N/A" },
        { label: "Graduation Name", value: formData.graduationName || "N/A" },
        { label: "Graduation Marks", value: formData.graduationMarks ? `${formData.graduationMarks}%` : "N/A" },
        { label: "Postgraduation Name", value: formData.postgraduationName || "N/A" },
        { label: "Postgraduation Marks", value: formData.postgraduationMarks ? `${formData.postgraduationMarks}%` : "N/A" },
      ],
    },
    {
      title: "Documents",
      fields: [
        {
          label: "10th Class Document",
          value: formData.tenthClassDoc ? (
            formData.tenthClassDoc.includes(".jpg") || formData.tenthClassDoc.includes(".png") ? (
              <img
                src={formData.tenthClassDoc}
                alt="10th Class Document"
                className="w-32 h-32 rounded-lg shadow-md object-cover"
              />
            ) : formData.tenthClassDoc.includes(".pdf") ? (
              <div className="flex flex-col items-center">
                <svg
                  className="w-12 h-12 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <a
                  href={formData.tenthClassDoc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:underline text-sm mt-2"
                >
                  View PDF
                </a>
              </div>
            ) : (
              "Unsupported file type"
            )
          ) : (
            "N/A"
          ),
        },
        {
          label: "Intermediate Document",
          value: formData.intermediateDoc ? (
            formData.intermediateDoc.includes(".jpg") || formData.intermediateDoc.includes(".png") ? (
              <img
                src={formData.intermediateDoc}
                alt="Intermediate Document"
                className="w-32 h-32 rounded-lg shadow-md object-cover"
              />
            ) : formData.intermediateDoc.includes(".pdf") ? (
              <div className="flex flex-col items-center">
                <svg
                  className="w-12 h-12 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <a
                  href={formData.intermediateDoc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:underline text-sm mt-2"
                >
                  View PDF
                </a>
              </div>
            ) : (
              "Unsupported file type"
            )
          ) : (
            "N/A"
          ),
        },
        {
          label: "Graduation Document",
          value: formData.graduationDoc ? (
            formData.graduationDoc.includes(".jpg") || formData.graduationDoc.includes(".png") ? (
              <img
                src={formData.graduationDoc}
                alt="Graduation Document"
                className="w-32 h-32 rounded-lg shadow-md object-cover"
              />
            ) : formData.graduationDoc.includes(".pdf") ? (
              <div className="flex flex-col items-center">
                <svg
                  className="w-12 h-12 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <a
                  href={formData.graduationDoc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:underline text-sm mt-2"
                >
                  View PDF
                </a>
              </div>
            ) : (
              "Unsupported file type"
            )
          ) : (
            "N/A"
          ),
        },
        {
          label: "Postgraduation Document",
          value: formData.postgraduationDoc ? (
            formData.postgraduationDoc.includes(".jpg") || formData.postgraduationDoc.includes(".png") ? (
              <img
                src={formData.postgraduationDoc}
                alt="Postgraduation Document"
                className="w-32 h-32 rounded-lg shadow-md object-cover"
              />
            ) : formData.postgraduationDoc.includes(".pdf") ? (
              <div className="flex flex-col items-center">
                <svg
                  className="w-12 h-12 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <a
                  href={formData.postgraduationDoc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:underline text-sm mt-2"
                >
                  View PDF
                </a>
              </div>
            ) : (
              "Unsupported file type"
            )
          ) : (
            "N/A"
          ),
        },
        {
          label: "Aadhar Document",
          value: formData.aadharDoc ? (
            formData.aadharDoc.includes(".jpg") || formData.aadharDoc.includes(".png") ? (
              <img
                src={formData.aadharDoc}
                alt="Aadhar Document"
                className="w-32 h-32 rounded-lg shadow-md object-cover"
              />
            ) : formData.aadharDoc.includes(".pdf") ? (
              <div className="flex flex-col items-center">
                <svg
                  className="w-12 h-12 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <a
                  href={formData.aadharDoc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:underline text-sm mt-2"
                >
                  View PDF
                </a>
              </div>
            ) : (
              "Unsupported file type"
            )
          ) : (
            "N/A"
          ),
        },
        {
          label: "PAN Document",
          value: formData.panDoc ? (
            formData.panDoc.includes(".jpg") || formData.panDoc.includes(".png") ? (
              <img
                src={formData.panDoc}
                alt="PAN Document"
                className="w-32 h-32 rounded-lg shadow-md object-cover"
              />
            ) : formData.panDoc.includes(".pdf") ? (
              <div className="flex flex-col items-center">
                <svg
                  className="w-12 h-12 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <a
                  href={formData.panDoc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:underline text-sm mt-2"
                >
                  View PDF
                </a>
              </div>
            ) : (
              "Unsupported file type"
            )
          ) : (
            "N/A"
          ),
        },
      ],
    },
    {
      title: "Bank Details",
      fields: [
        { label: "IFSC Number", value: formData.ifscNumber || "N/A" },
        { label: "Bank Account Number", value: formData.bankACnumber || "N/A" },
      ],
    },
  ];

  // ✅ Fix applied: ensure activeTab is valid
  const currentTab = tabGroups[activeTab] || tabGroups[0];

  return (
    <div className="relative">
      {/* Error and Success Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg shadow-md animate-fade-in">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg shadow-md animate-fade-in">
          {successMessage}
        </div>
      )}

      {/* Content Area with Animation */}
      <div
        className="bg-white rounded-lg p-6 shadow-md transition-all duration-300 animate-fade-in"
        style={{ animationDelay: `${activeTab * 100}ms` }}
      >
        <h4 className="text-xl font-semibold text-teal-600 mb-6">{currentTab.title}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
          {currentTab.fields.map((field, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <strong className="text-sm font-medium text-gray-900">{field.label}:</strong>
              <div className="text-sm">{field.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-6">
        <button
          onClick={closePreview}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 text-sm font-medium"
        >
          Back to Employees
        </button>
      </div>
    </div>
  );
};

export default EmployeePreview;
