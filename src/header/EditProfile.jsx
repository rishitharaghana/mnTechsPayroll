import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  User,
  Briefcase,
  GraduationCap,
  FileText,
  Banknote,
} from "lucide-react";
import PageBreadcrumb from "../Components/common/PageBreadcrumb";
import PageMeta from "../Components/common/PageMeta";
import {
  getCurrentUserProfile,
  fetchEmployeePersonalDetails,
  fetchEmployeeEducationDetails,
  fetchEmployeeDocuments,
  fetchEmployeeBankDetails,
  fetchEmployeeById,
  clearState,
} from "../redux/slices/employeeSlice";

const EditProfile = () => {
  const dispatch = useDispatch();
  const {
    profile,
    personalDetails,
    educationDetails,
    documents,
    bankDetails,
    currentEmployee,
    loading,
    employeeId,
  } = useSelector((state) => state.employee);
  const [activeTab, setActiveTab] = useState(0);
  const [fetchErrors, setFetchErrors] = useState({});
  const hasClearedState = useRef(false);

  useEffect(() => {
    dispatch(getCurrentUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (!profile?.employee_id) return;

    const employee_id = profile.employee_id;

    if (employeeId && employeeId !== employee_id && !hasClearedState.current) {
      console.warn("Mismatch detected in employeeId. Clearing stale state.", {
        reduxEmployeeId: employeeId,
        profileEmployeeId: employee_id,
      });
      dispatch(clearState());
      hasClearedState.current = true;
    }

    console.log("Dispatching employee details fetches", { employee_id });

    Promise.all([
      dispatch(fetchEmployeeById(employee_id))
        .unwrap()
        .catch((err) => {
          console.error("fetchEmployeeById failed:", err);
          setFetchErrors((prev) => ({
            ...prev,
            position: err.status === 404 ? null : err.message || "Unable to fetch position information.",
          }));
          return null;
        }),
      dispatch(fetchEmployeePersonalDetails(employee_id))
        .unwrap()
        .catch((err) => {
          console.error("fetchEmployeePersonalDetails failed:", err);
          setFetchErrors((prev) => ({
            ...prev,
            personal: err.status === 404 ? null : err.message || "Unable to fetch personal details.",
          }));
          return null;
        }),
      dispatch(fetchEmployeeEducationDetails(employee_id))
        .unwrap()
        .catch((err) => {
          console.error("fetchEmployeeEducationDetails failed:", err);
          setFetchErrors((prev) => ({
            ...prev,
            education: err.status === 404 ? null : err.message || "Education details not found.",
          }));
          return null;
        }),
      dispatch(fetchEmployeeDocuments(employee_id))
        .unwrap()
        .catch((err) => {
          console.error("fetchEmployeeDocuments failed:", err);
          setFetchErrors((prev) => ({
            ...prev,
            documents: err.status === 404 ? null : err.message || "Unable to fetch documents.",
          }));
          return [];
        }),
      dispatch(fetchEmployeeBankDetails(employee_id))
        .unwrap()
        .catch((err) => {
          console.error("fetchEmployeeBankDetails failed:", err);
          let errorMessage = err.status === 404 ? null : "Bank details not found. Please add them.";
          if (err.status === 403 || err.message?.includes("Access denied")) {
            errorMessage = "Access denied: You can only view your own bank details.";
          }
          setFetchErrors((prev) => ({
            ...prev,
            bank: errorMessage,
          }));
          return null;
        }),
    ]).then(() => {
      console.log("All fetches completed");
    });
  }, [dispatch, profile?.employee_id]);

  const steps = [
    {
      title: "Personal Details",
      icon: <User size={18} />,
      details: personalDetails
        ? {
            Image: profile?.photo_url || "https://via.placeholder.com/150",
            "Full Name": personalDetails.full_name || "N/A",
            "Date of Birth": personalDetails.dob || "N/A",
            "Father’s Name": personalDetails.father_name || "N/A",
            "Mother’s Name": personalDetails.mother_name || "N/A",
            Phone: personalDetails.phone || "N/A",
            Email: profile?.email || "N/A",
            Gender: personalDetails.gender || "N/A",
            "Present Address": personalDetails.present_address || "N/A",
            "Previous Address": personalDetails.previous_address || "N/A",
            "PAN Card Number": personalDetails.pan_number || "N/A",
            "Aadhar Card Number": personalDetails.aadhar_number || "N/A",
          }
        : {},
    },
    {
      title: "Position Information",
      icon: <Briefcase size={18} />,
      details: currentEmployee
        ? {
            "Employee ID": currentEmployee.employee_id || "N/A",
            "Position Title": currentEmployee.designation || "N/A",
            "Joining Date": currentEmployee.join_date || "N/A",
            "Position Type": currentEmployee.position_type || "N/A",
            "Employment Type": currentEmployee.employment_type || "N/A",
            "Contract End Date": currentEmployee.contract_end_date || "N/A",
          }
        : {},
    },
    {
      title: "Education Details",
      icon: <GraduationCap size={18} />,
      details: educationDetails
        ? {
            "10th Class Name": educationDetails.tenth_class_name || "N/A",
            "10th Class Marks": educationDetails.tenth_class_marks || "N/A",
            "Intermediate Name": educationDetails.intermediate_name || "N/A",
            "Intermediate Marks": educationDetails.intermediate_marks || "N/A",
            "Graduation Name": educationDetails.graduation_name || "N/A",
            "Graduation Marks": educationDetails.graduation_marks || "N/A",
            "Postgraduation Name": educationDetails.postgraduation_name || "N/A",
            "Postgraduation Marks": educationDetails.postgraduation_marks || "N/A",
          }
        : {},
    },
    {
      title: "Documents",
      icon: <FileText size={18} />,
      details: documents && documents.length > 0
        ? documents.reduce((acc, doc) => {
            acc[doc.document_type] = doc.document_url || "N/A";
            return acc;
          }, {})
        : {},
    },
    {
      title: "Bank Details",
      icon: <Banknote size={18} />,
      details: bankDetails
        ? {
            "IFSC Number": bankDetails.ifsc_number || "N/A",
            "Bank Account Number": bankDetails.bank_account_number || "N/A",
          }
        : {},
    },
  ];

  const renderDetails = () => {
    const currentStep = steps[activeTab];

    if (loading) {
      return <div className="text-center text-gray-600">Loading...</div>;
    }

    const tabErrors = {
      0: fetchErrors.personal,
      1: fetchErrors.position,
      2: fetchErrors.education,
      3: fetchErrors.documents,
      4: fetchErrors.bank,
    };

    if (tabErrors[activeTab]) {
      return (
        <div className="text-center text-red-600">
          {tabErrors[activeTab]}
        </div>
      );
    }

    if (!currentStep.details || Object.keys(currentStep.details).length === 0) {
      return (
        <div className="text-center text-gray-600">
          No data available
        </div>
      );
    }

    if (activeTab === 0) {
      return (
        <div className="space-y-6">
          <div className="flex justify-start">
            <img
              src={currentStep.details.Image}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-md"
            />
          </div>
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
      return (
        <div className="grid sm:grid-cols-2 gap-6">
          {Object.entries(currentStep.details).map(([key, value], idx) => (
            <div
              key={idx}
              className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-md border border-gray-200"
            >
              <div className="w-12 h-14 bg-red-100 border border-red-300 rounded-md flex items-center justify-center text-red-600 font-bold text-xs">
                PDF
              </div>
              <div>
                <dt className="text-sm font-bold text-slate-700">{key}</dt>
                <dd className="text-sm text-gray-500 truncate w-40">
                  {value.split("/").pop() || "N/A"}
                </dd>
              </div>
            </div>
          ))}
        </div>
      );
    }

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
    <div className="w-full">
      <div className="hidden md:flex md:justify-end md:items-center mb-6">
        <PageMeta title="Employee Profile" />
        <PageBreadcrumb
          items={[
            { label: "Home", path: "/" },
            { label: "Employee Profile", path: "/profile", active: true },
          ]}
        />
      </div>
      <div className="min-h-screen bg-gray-50 shadow-lg rounded-2xl p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          {profile?.fullName
            ? `${profile.fullName}'s Profile`
            : "Employee Profile"}
        </h2>
        <div className="bg-white rounded-2xl shadow-xl p-4 mb-6">
          <ul className="flex flex-wrap gap-2" role="tablist">
            {steps.map((step, index) => (
              <li key={index} role="presentation">
                <button
                  onClick={() => setActiveTab(index)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                    ${
                      activeTab === index
                        ? "bg-teal-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  role="tab"
                  aria-selected={activeTab === index}
                  aria-controls={`panel-${index}`}
                  id={`tab-${index}`}
                >
                  {step.icon}
                  {step.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <main>
          <div
            className="bg-white rounded-2xl shadow-xl p-6"
            role="tabpanel"
            id={`panel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
          >
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