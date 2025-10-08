import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEmployeePersonalDetails,
  fetchEmployeeEducationDetails,
  fetchEmployeeDocuments,
  fetchEmployeeBankDetails,
  getCurrentUserProfile,
} from "../../redux/slices/employeeSlice";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";

const normalizeData = (personalDetails, educationDetails, documents, bankDetails) => {
  if (!personalDetails) return null;
  return {
    employeeId: personalDetails.employee_id || "N/A",
    fullName: personalDetails.full_name || personalDetails.name || "N/A",
    fatherName: personalDetails.father_name || "N/A",
    motherName: personalDetails.mother_name || "N/A",
    phone: personalDetails.phone || personalDetails.mobile || "N/A",
    email: personalDetails.email || "N/A",
    gender: personalDetails.gender || "N/A",
    panNumber: personalDetails.pan_number || "N/A",
    aadharNumber: personalDetails.aadhar_number || "N/A",
    presentAddress: personalDetails.present_address || personalDetails.address || "N/A",
    previousAddress: personalDetails.previous_address || "N/A",
    positionType: personalDetails.position_type || "fresher",
    employerIdName: personalDetails.employee_id || personalDetails.employer_id_name || "N/A",
    positionTitle: personalDetails.designation_name || personalDetails.position_title || "N/A",
    employmentType: personalDetails.employment_type || "N/A",
    joiningDate: personalDetails.join_date || "N/A",
    contractEndDate: personalDetails.contract_end_date || "N/A",
    dob: personalDetails.dob || personalDetails.date_of_birth || "N/A",
    bloodGroup: personalDetails.blood_group || "N/A",
    department: personalDetails.department_name || personalDetails.department || "N/A",
    position: personalDetails.designation_name || personalDetails.position || "N/A",
    role: personalDetails.role || "employee",
    emergencyPhone: personalDetails.emergency_phone || "N/A",
    photoUrl: personalDetails.photo_url || null,
    tenthClassName: educationDetails?.tenth_class_name || "N/A",
    tenthClassMarks: educationDetails?.tenth_class_marks || "N/A",
    intermediateName: educationDetails?.intermediate_name || "N/A",
    intermediateMarks: educationDetails?.intermediate_marks || "N/A",
    graduationName: educationDetails?.graduation_name || "N/A",
    graduationMarks: educationDetails?.graduation_marks || "N/A",
    postgraduationName: educationDetails?.postgraduation_name || "N/A",
    postgraduationMarks: educationDetails?.postgraduation_marks || "N/A",
    tenthClassDoc:
      documents?.find((doc) => doc.document_type === "tenth_class")?.file_path || null,
    intermediateDoc:
      documents?.find((doc) => doc.document_type === "intermediate")?.file_path || null,
    graduationDoc:
      documents?.find((doc) => doc.document_type === "graduation")?.file_path || null,
    postgraduationDoc:
      documents?.find((doc) => doc.document_type === "postgraduation")?.file_path || null,
    aadharDoc:
      documents?.find((doc) => doc.document_type === "aadhar")?.file_path || null,
    panDoc: documents?.find((doc) => doc.document_type === "pan")?.file_path || null,
    ifscNumber: bankDetails?.ifsc_number || "N/A",
    bankACnumber: bankDetails?.bank_account_number || "N/A",
  };
};

const formatDate = (dateString) => {
  if (!dateString || dateString === "N/A") return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const ViewEmployeeDetails = () => {
  const { employee_id } = useParams(); 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, loading } = useSelector((state) => state.employee);
  const [formData, setFormData] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    "Personal Details",
    "Position Information",
    "Education Details",
    "Documents",
    "Bank Details",
  ];

  useEffect(() => {
    console.log("Fetching profile...");
    dispatch(getCurrentUserProfile()).then((result) => {
      if (result.error) {
        console.error("Profile fetch failed:", result.error);
      } else {
        console.log("Profile fetched:", result.payload);
      }
    });
  }, [dispatch]);

  useEffect(() => {
    const handleViewDetails = async (employeeId) => {
      try {
        console.log("Fetching details for employeeId:", employeeId);
        const [personalDetailsRes, educationDetailsRes, documentsRes, bankDetailsRes] = await Promise.all([
          dispatch(fetchEmployeePersonalDetails(employeeId))
            .unwrap()
            .catch((err) => {
              console.error("Personal details fetch failed:", err);
              throw new Error(`Personal details: ${err.message || "User not found"}`);
            }),
          dispatch(fetchEmployeeEducationDetails(employeeId))
            .unwrap()
            .catch((err) => {
              console.error("Education details fetch failed:", err);
              return {}; 
            }),
          dispatch(fetchEmployeeDocuments(employeeId))
            .unwrap()
            .catch((err) => {
              console.error("Documents fetch failed:", err);
              return [];
            }),
          dispatch(fetchEmployeeBankDetails(employeeId))
            .unwrap()
            .catch((err) => {
              console.error("Bank details fetch failed:", err);
              return {}; 
            }),
        ]);
        console.log("Raw API responses:", {
          personalDetails: personalDetailsRes,
          educationDetails: educationDetailsRes,
          documents: documentsRes,
          bankDetails: bankDetailsRes,
        });
        const normalizedData = normalizeData(
          personalDetailsRes,
          educationDetailsRes,
          documentsRes,
          bankDetailsRes
        );
        console.log("Normalized employee details:", normalizedData);
        if (!normalizedData) {
          throw new Error("Failed to normalize data: No personal details available");
        }
        setFormData(normalizedData);
        setFetchError(null);
      } catch (err) {
        console.error("Failed to fetch employee details:", err);
        setFetchError(err.message || "Failed to fetch employee details");
      }
    };

    if (employee_id) {
      handleViewDetails(employee_id);
    } else {
      setFetchError("Invalid employee ID");
    }
  }, [dispatch, employee_id]);

  useEffect(() => {
    console.log("Current formData:", formData);
  }, [formData]);

  const userRole = profile?.role || "super_admin";

  const canViewEmployee = (employeeRole) => {
    if (userRole === "super_admin") return true;
    if (userRole === "hr" && employeeRole !== "hr") return true;
    return false;
  };

  useEffect(() => {
    if (formData && !canViewEmployee(formData.role)) {
      console.log("Access denied: Redirecting to /admin/employees");
      navigate("/admin/employees");
    }
  }, [formData, navigate]);

  const closeDetails = () => {
    navigate("/admin/employees");
  };

  const tabGroups = [
    {
      title: "Personal Details",
      fields: [
        {
          label: "Photo",
          value: formData?.photoUrl ? (
            <img
              src={formData.photoUrl}
              alt="Employee Photo"
              className="w-32 h-32 rounded-lg shadow-md object-cover"
            />
          ) : (
            "N/A"
          ),
        },
        { label: "Employee ID", value: formData?.employeeId || "N/A" },
        { label: "Full Name", value: formData?.fullName || "N/A" },
        { label: "Father’s Name", value: formData?.fatherName || "N/A" },
        { label: "Mother’s Name", value: formData?.motherName || "N/A" },
        { label: "Phone", value: formData?.phone || "N/A" },
        { label: "Emergency Phone", value: formData?.emergencyPhone || "N/A" },
        { label: "Email", value: formData?.email || "N/A" },
        { label: "Gender", value: formData?.gender || "N/A" },
        { label: "PAN Number", value: formData?.panNumber || "N/A" },
        { label: "Aadhar Number", value: formData?.aadharNumber || "N/A" },
        { label: "Present Address", value: formData?.presentAddress || "N/A" },
        { label: "Previous Address", value: formData?.previousAddress || "N/A" },
        { label: "Date of Birth", value: formatDate(formData?.dob) || "N/A" },
        { label: "Blood Group", value: formData?.bloodGroup || "N/A" },
        { label: "Department", value: formData?.department || "N/A" },
        { label: "Position", value: formData?.position || "N/A" },
      ],
    },
    {
      title: "Position Information",
      fields: [
        { label: "Position Type", value: formData?.positionType || "N/A" },
        { label: "Employer ID/Name", value: formData?.employerIdName || "N/A" },
        { label: "Position Title", value: formData?.positionTitle || "N/A" },
        { label: "Employment Type", value: formData?.employmentType || "N/A" },
        { label: "Joining Date", value: formatDate(formData?.joiningDate) || "N/A" },
        { label: "Contract End Date", value: formatDate(formData?.contractEndDate) || "N/A" },
      ],
    },
    {
      title: "Education Details",
      fields: [
        { label: "10th Class Name", value: formData?.tenthClassName || "N/A" },
        {
          label: "10th Class Marks",
          value: formData?.tenthClassMarks ? `${formData.tenthClassMarks}%` : "N/A",
        },
        { label: "Intermediate Name", value: formData?.intermediateName || "N/A" },
        {
          label: "Intermediate Marks",
          value: formData?.intermediateMarks ? `${formData.intermediateMarks}%` : "N/A",
        },
        { label: "Graduation Name", value: formData?.graduationName || "N/A" },
        {
          label: "Graduation Marks",
          value: formData?.graduationMarks ? `${formData.graduationMarks}%` : "N/A",
        },
        { label: "Postgraduation Name", value: formData?.postgraduationName || "N/A" },
        {
          label: "Postgraduation Marks",
          value: formData?.postgraduationMarks ? `${formData.postgraduationMarks}%` : "N/A",
        },
      ],
    },
    {
      title: "Documents",
      fields: [
        {
          label: "Tenth Class",
          value: formData?.tenthClassDoc ? (
            formData.tenthClassDoc.includes(".jpg") || formData.tenthClassDoc.includes(".png") ? (
              <img
                src={formData.tenthClassDoc}
                alt="Tenth Class Document"
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
                  View Document
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
          label: "Intermediate",
          value: formData?.intermediateDoc ? (
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
                  View Document
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
          label: "Graduation",
          value: formData?.graduationDoc ? (
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
                  View Document
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
          label: "Postgraduation",
          value: formData?.postgraduationDoc ? (
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
                  View Document
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
          label: "Aadhar",
          value: formData?.aadharDoc ? (
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
                  View Document
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
          label: "PAN",
          value: formData?.panDoc ? (
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
                  View Document
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
        { label: "IFSC Code", value: formData?.ifscNumber || "N/A" },
        { label: "Bank Account Number", value: formData?.bankACnumber || "N/A" },
      ],
    },
  ];

  // Ensure activeTab is valid
  const currentTab = tabGroups[activeTab] || tabGroups[0];

  return (
    <div className="w-full">
      <style>
        {`
          .error-message {
            color: #dc2626;
            font-size: 0.875rem;
            margin-top: 1rem;
          }
          .animate-fade-in {
            animation: fadeIn 0.3s ease-in;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
      <div className="hidden md:flex md:justify-end">
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/emp-dashboard" },
            { label: "View Employee Details", link: "/employee/view-details" },
          ]}
        />
        <PageMeta
          title="Employee Information"
          description="View detailed employee information."
        />
      </div>
      <div className="">
        <h3 className="text-2xl font-bold text-left text-gray-900 mb-3 tracking-tight">
          Details for {formData?.fullName || "Employee"}
        </h3>
        <div className="mb-4 overflow-x-auto bg-white/80 backdrop-blur-xl rounded-xl shadow-md border border-gray-200 p-2 sm:p-3 md:p-4">
          <div className="flex space-x-2 min-w-max">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                  activeTab === index
                    ? "bg-teal-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } whitespace-nowrap`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          {loading ? (
            <div className="text-center text-gray-600 animate-pulse">
              Loading employee details...
            </div>
          ) : fetchError ? (
            <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">
              {fetchError}
              <button
                onClick={() => {
                  setFetchError(null);
                  handleViewDetails(employee_id);
                }}
                className="ml-4 text-blue-600 underline hover:text-blue-800"
              >
                Retry
              </button>
            </div>
          ) : !formData ? (
            <div className="error-message">
              No employee details available.
            </div>
          ) : (
            <div
              className="bg-white rounded-lg sm:p-6 p-5 shadow-md transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${activeTab * 100}ms` }}
            >
              <h4 className="text-xl font-bold text-slate-700 mb-6">
                {currentTab.title}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 sm:gap-6 gap-4 text-gray-700">
                {currentTab.fields.map((field, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <strong className="text-sm font-medium text-gray-900 sm:w-40 w-27 shrink-0">
                      {field.label}
                    </strong>
                    <div className="text-sm flex-1">: {field.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {formData && (
            <div className="mt-6 sm:text-left text-center">
              <button
                onClick={closeDetails}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 text-sm font-medium"
              >
                Close Details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewEmployeeDetails;