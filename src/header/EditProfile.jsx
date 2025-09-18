import React, { useState } from "react";
import {
  User,
  Briefcase,
  GraduationCap,
  FileText,
  Banknote,
} from "lucide-react";

const EditProfile = () => {
  const [activeTab, setActiveTab] = useState(0);

  const steps = [
    {
      title: "Personal Details",
      icon: <User size={18} />,
      details: {
        Image: "https://via.placeholder.com/150",
        "Full Name": "John Doe",
        "Date of Birth": "15-03-1990",
        "Father’s Name": "Robert Doe",
        "Mother’s Name": "Jane Doe",
        Phone: "+91 98765 43210",
        Email: "john.doe@example.com",
        Gender: "Male",
        "Present Address": "123, MG Road, Bangalore, Karnataka, India",
        "Previous Address": "456, Park Street, Mumbai, Maharashtra, India",
        "PAN Card Number": "ABCDE1234F",
        "Aadhar Card Number": "1234 5678 9012",
      },
    },
    {
      title: "Position Information",
      icon: <Briefcase size={18} />,
      details: {
        "Employer ID/Name": "EMP12345 / TechCorp Inc.",
        "Position Title": "Senior Software Engineer",
        "Joining Date": "10-06-2018",
        "Position Type": "Technical",
        "Employment Type": "Full-Time",
        "Contract End Date": "N/A",
      },
    },
    {
      title: "Education Details",
      icon: <GraduationCap size={18} />,
      details: {
        "10th Class Name": "XYZ High School",
        "10th Class Marks": "85%",
        "Intermediate Name": "ABC Junior College",
        "Intermediate Marks": "90%",
        "Graduation Name": "B.Tech, Computer Science",
        "Graduation Marks": "8.5 CGPA",
        "Postgraduation Name": "M.Tech, Data Science",
        "Postgraduation Marks": "9.0 CGPA",
      },
    },
    {
      title: "Documents",
      icon: <FileText size={18} />,
      details: {
        "10th Class Document": "10th_certificate.pdf",
        "Intermediate Document": "intermediate_certificate.pdf",
        "Graduation Document": "btech_degree.pdf",
        "Postgraduation Document": "mtech_degree.pdf",
        "Aadhar Document": "aadhar_card.pdf",
        "PAN Document": "pan_card.pdf",
      },
    },
    {
      title: "Bank Details",
      icon: <Banknote size={18} />,
      details: {
        "IFSC Number": "SBIN0001234",
        "Bank Account Number": "123456789012",
      },
    },
  ];

  const renderDetails = () => {
    const currentStep = steps[activeTab];

    if (activeTab === 0) {
      // Personal Details Layout
      return (
        <div className="space-y-6">
          {/* Image Section */}
          <div className="flex justify-start">
            <img
              src={currentStep.details.Image}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-md"
            />
          </div>

          {/* Other details in grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {Object.entries(currentStep.details)
              .filter(([key]) => key !== "Image")
              .map(([key, value], idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                >
                  <dt className="text-md font-bold text-slate-700">{key}</dt>
                  <dd className="mt-1 text-sm text-gray-500">{value}</dd>
                </div>
              ))}
          </div>
        </div>
      );
    }

    if (activeTab === 3) {
      // Documents Layout
      return (
        <div className="grid sm:grid-cols-2 gap-6">
          {Object.entries(currentStep.details).map(([key, value], idx) => (
            <div
              key={idx}
              className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-md border border-gray-200"
            >
              {/* Fake PDF preview box */}
              <div className="w-12 h-14 bg-red-100 border border-red-300 rounded-md flex items-center justify-center text-red-600 font-bold text-xs">
                PDF
              </div>
              <div>
                <dt className="text-sm font-bold text-slate-700">{key}</dt>
                <dd className="text-sm text-gray-500 truncate w-40">{value}</dd>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Default Layout for Position, Education, Bank (2 per row)
    return (
      <div className="grid sm:grid-cols-2 gap-6">
        {Object.entries(currentStep.details).map(([key, value], idx) => (
          <div
            key={idx}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <dt className="text-sm font-bold text-slate-700">{key}</dt>
            <dd className="mt-1 text-sm text-gray-500">{value}</dd>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 shadow-lg rounded-2xl">
      <h2 className="text-lg p-10 pb-0 font-bold text-gray-800">Profile Sections</h2>
      <div className="flex justify-start items-start gap-8 p-5">
        <aside className="w-64">
            <ul className="space-y-2 min-screen bg-white rounded-2xl shadow-xl p-6 hidden md:block">
              {steps.map((step, index) => (
                <li key={index}>
                  <button
                    onClick={() => setActiveTab(index)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left text-sm font-medium transition-all duration-300
                  ${
                    activeTab === index
                      ? "bg-teal-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  >
                    {step.icon}
                    {step.title}
                  </button>
                </li>
              ))}
            </ul>
        </aside>

        {/* Content Area */}
        <main className="flex-1">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {steps[activeTab].title}
            </h2>
            {renderDetails()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditProfile;