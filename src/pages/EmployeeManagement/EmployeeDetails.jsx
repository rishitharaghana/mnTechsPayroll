import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";
import {
  createEmployeePersonalDetails,
  createEducationDetails,
  createDocuments,
  createBankDetails,
  getCurrentUserProfile,
  getEmployeeProgress,
  fetchEmployeePersonalDetails,
  fetchEmployeeEducationDetails,
  fetchEmployeeDocuments,
  fetchEmployeeBankDetails,
  updateEmployeePersonalDetails,
  updateEducationDetails,
  updateBankDetails,
  clearState,
} from "../../redux/slices/employeeSlice";
import StepNavigation from "../../Components/common/StepNavigation";
import EmployeePersonaldetailsForm from "./EmployeePersonaldetailsForm";
import EmployeeEducationDetailsForm from "./EmployeeEducationDetailsForm";
import EmployeeDocuments from "./EmployeeDocuments";
import EmployeeBankDetailsForm from "./EmployeeBankDetailsForm";
import EmployeePreview from "./EmployeePreview";

const steps = [
  "Personal Details",
  "Education Details",
  "Documents",
  "Bank Details",
  "Preview",
];

const EmployeeDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    profile,
    personalDetails,
    educationDetails,
    documents,
    bankDetails,
    loading,
    error,
    successMessage,
    progress,
  } = useSelector((state) => state.employee);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: "",
    fullName: "",
    fatherName: "",
    motherName: "",
    phone: "",
    email: "",
    gender: "",
    pan_number: "",
    aadhar_number: "",
    image: null,
    presentAddress: "",
    previousAddress: "",
    positionType: "",
    employerIdName: "",
    positionTitle: "",
    employmentType: "",
    contractEndDate: "",
    dob: "",
    bloodGroup: "",
    basicSalary: "",
    allowances: "",
    bonuses: "",
    department: "",
    position: "",
    tenthClassName: "",
    tenthClassMarks: "",
    intermediateName: "",
    intermediateMarks: "",
    graduationName: "",
    graduationMarks: "",
    postgraduationName: "",
    postgraduationMarks: "",
    tenthClassDoc: null,
    intermediateDoc: null,
    graduationDoc: null,
    postgraduationDoc: null,
    aadharDoc: null,
    panDoc: null,
    ifscNumber: "",
    bankACnumber: "",
  });
  const [errors, setErrors] = useState({});
  const isInitialFetchDone = useRef(false);

  // Initial data fetch with error handling
  useEffect(() => {
    if (isInitialFetchDone.current) return;

    const userToken = localStorage.getItem("userToken");
    if (!userToken) {
      setErrors({ general: "You are not logged in. Redirecting to login page..." });
      setTimeout(() => navigate("/login"), 2000);
      return;
    }
    try {
      const parsedToken = JSON.parse(userToken);
      const { employee_id, role } = parsedToken;
      const effectiveEmployeeId = employee_id || profile?.employee_id;
      if (!effectiveEmployeeId) {
        setErrors({
          general: "Authentication error: Employee ID is missing. Redirecting to login page...",
        });
        localStorage.removeItem("userToken");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }
      console.log("Dispatching profile, progress, and details fetches", {
        employee_id: effectiveEmployeeId,
        role,
      });

      dispatch(getCurrentUserProfile());
      dispatch(getEmployeeProgress());
      dispatch(fetchEmployeePersonalDetails(effectiveEmployeeId)).catch((err) => {
        console.error("Personal details fetch failed:", err);
        setErrors((prev) => ({
          ...prev,
          personalDetails: "Unable to fetch personal details. Please try again.",
        }));
      });
      Promise.all([
        dispatch(fetchEmployeeEducationDetails(effectiveEmployeeId)).catch((err) => {
          console.error("Education details fetch failed:", err);
          setErrors((prev) => ({
            ...prev,
            educationDetails: "Education details are restricted for your role.",
          }));
        }),
        dispatch(fetchEmployeeDocuments(effectiveEmployeeId)).catch((err) => {
          console.error("Documents fetch failed:", err);
          setErrors((prev) => ({
            ...prev,
            documents: "Unable to fetch documents. Please try again.",
          }));
        }),
        dispatch(fetchEmployeeBankDetails(effectiveEmployeeId)).catch((err) => {
          console.error("Bank details fetch failed:", err);
          setErrors((prev) => ({
            ...prev,
            bankDetails: "Unable to fetch bank details. Please try again.",
          }));
        }),
      ]).then(() => {
        isInitialFetchDone.current = true;
      });
    } catch (err) {
      setErrors({
        general: "Authentication error: Invalid token format. Redirecting to login page...",
      });
      localStorage.removeItem("userToken");
      setTimeout(() => navigate("/login"), 2000);
      console.error("Token parsing error:", err);
    }
  }, [dispatch, navigate, profile]);

  // Populate formData with robust logging
  useEffect(() => {
    if (!profile && !personalDetails && !educationDetails && !documents && !bankDetails) {
      console.log("No data available yet for formData update");
      return;
    }
    console.log("Raw personalDetails:", JSON.stringify(personalDetails, null, 2));
    console.log("personalDetails keys:", Object.keys(personalDetails || {}));
    const newFormData = {
      employee_id: profile?.employee_id || "",
      fullName: profile?.full_name || "",
      email: profile?.email || "",
      phone: profile?.mobile || "",
      gender: profile?.gender || "",
      dob: profile?.dob || "",
      bloodGroup: profile?.blood_group || "",
      department: profile?.department_name || "",
      position: profile?.designation_name || "",
      basicSalary: profile?.basic_salary || "",
      allowances: profile?.allowances || "",
      bonuses: profile?.bonuses || "",
      fatherName: personalDetails?.father_name || "",
      motherName: personalDetails?.mother_name || "",
      presentAddress: personalDetails?.present_address || "",
      previousAddress: personalDetails?.previous_address || "",
      positionType: personalDetails?.position_type || "",
      employerIdName: personalDetails?.employer_id_name || "",
      positionTitle: personalDetails?.position_title || "",
      employmentType: personalDetails?.employment_type || "",
      contractEndDate: personalDetails?.contract_end_date || "",
      pan_number: personalDetails?.pan_number || "",
      aadhar_number: personalDetails?.aadhar_number || "",
      tenthClassName: educationDetails?.tenth_class_name || "",
      tenthClassMarks: educationDetails?.tenth_class_marks || "",
      intermediateName: educationDetails?.intermediate_name || "",
      intermediateMarks: educationDetails?.intermediate_marks || "",
      graduationName: educationDetails?.graduation_name || "",
      graduationMarks: educationDetails?.graduation_marks || "",
      postgraduationName: educationDetails?.postgraduation_name || "",
      postgraduationMarks: educationDetails?.postgraduation_marks || "",
      ifscNumber: bankDetails?.ifsc_number || "",
      bankACnumber: bankDetails?.bank_account_number || "",
      tenthClassDoc: documents?.find(doc => doc.document_type === "tenth_class")?.file_path || null,
      intermediateDoc: documents?.find(doc => doc.document_type === "intermediate")?.file_path || null,
      graduationDoc: documents?.find(doc => doc.document_type === "graduation")?.file_path || null,
      postgraduationDoc: documents?.find(doc => doc.document_type === "postgraduation")?.file_path || null,
      aadharDoc: documents?.find(doc => doc.document_type === "aadhar")?.file_path || null,
      panDoc: documents?.find(doc => doc.document_type === "pan")?.file_path || null,
    };
    if (JSON.stringify(newFormData) !== JSON.stringify(formData)) {
      setFormData(newFormData);
      console.log("Updated formData:", JSON.stringify(newFormData, null, 2));
    }
  }, [profile, personalDetails, educationDetails, documents, bankDetails]);

  // Handle progress navigation only on initial load
  useEffect(() => {
    if (progress && !isInitialFetchDone.current) {
      let stepIndex = 0;
      if (progress.personalDetails) stepIndex = 1;
      if (progress.educationDetails) stepIndex = 2;
      if (progress.documents) stepIndex = 3;
      if (progress.bankDetails) stepIndex = 4;
      console.log("Setting initial step based on progress:", stepIndex);
      setCurrentStep(stepIndex);
    }
  }, [progress]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    console.log("handleChange:", { name, value, type, files: files ? files[0] : null });
    if (type === "file" && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    } else if (type !== "file") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleDateChange = (name, date) => {
    if (date && !isNaN(date)) {
      const updatedFormData = {
        ...formData,
        [name]: date.toISOString().split("T")[0],
      };
      if (name === "contractEndDate") {
        updatedFormData.contractEndDate = date.toISOString().split("T")[0];
      }
      setFormData(updatedFormData);
      setErrors((prev) => ({ ...prev, [name]: "" }));
      console.log("handleDateChange:", { name, date: updatedFormData[name] });
    }
  };

  const validateStep = (stepIndex) => {
    const newErrors = {};
    switch (stepIndex) {
      case 0: {
        const requiredFields = [
          "fullName",
          "fatherName",
          "motherName",
          "presentAddress",
          "positionType",
          "pan_number",
          "aadhar_number",
        ];
        requiredFields.forEach((field) => {
          if (!formData[field]?.trim()) {
            newErrors[field] = `${field
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())} is required`;
          }
        });
        if (
          formData.pan_number &&
          !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan_number)
        ) {
          newErrors.pan_number = "Invalid PAN card number (e.g., ABCDE1234F)";
        }
        if (formData.aadhar_number && !/^\d{12}$/.test(formData.aadhar_number)) {
          newErrors.aadhar_number = "Invalid Aadhar card number (12 digits)";
        }
        if (formData.positionType === "experienced") {
          const experiencedFields = [
            "employerIdName",
            "positionTitle",
            "employmentType",
          ];
          experiencedFields.forEach((field) => {
            if (!formData[field]?.trim()) {
              newErrors[field] = `${field
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())} is required`;
            }
          });
        }
        break;
      }
      case 1: {
        const numericFields = [
          "tenthClassMarks",
          "intermediateMarks",
          "graduationMarks",
          "postgraduationMarks",
        ];
        numericFields.forEach((field) => {
          if (
            formData[field] &&
            (isNaN(formData[field]) ||
              Number(formData[field]) < 0 ||
              Number(formData[field]) > 100)
          ) {
            newErrors[field] = `Invalid ${field
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())} (0-100)`;
          }
        });
        break;
      }
      case 2: {
        const docFields = [
          "tenthClassDoc",
          "intermediateDoc",
          "graduationDoc",
          "postgraduationDoc",
          "aadharDoc",
          "panDoc",
        ];
        docFields.forEach((field) => {
          if (
            formData[field] &&
            !["image/jpeg", "image/png", "application/pdf"].includes(
              formData[field].type
            )
          ) {
            newErrors[field] = "Only JPG, PNG, or PDF files are allowed";
          }
        });
        break;
      }
      case 3: {
        const requiredFields = ["ifscNumber", "bankACnumber"];
        requiredFields.forEach((field) => {
          if (!formData[field]?.trim()) {
            newErrors[field] = `${field
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())} is required`;
          }
        });
        if (
          formData.ifscNumber &&
          !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscNumber)
        ) {
          newErrors.ifscNumber = "Invalid IFSC code";
        }
        break;
      }
      default:
        break;
    }
    console.log("Validation errors:", newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitStep = async (stepIndex) => {
    try {
      const userToken = JSON.parse(localStorage.getItem("userToken"));
      const employee_id = userToken?.employee_id || profile?.employee_id;
      if (!employee_id) {
        setErrors({ general: "Employee ID not found. Please log in again." });
        console.error("submitStep: No employee_id found");
        return false;
      }

      switch (stepIndex) {
        case 0: {
          const personalData = {
            employee_id,
            fullName: formData.fullName,
            fatherName: formData.fatherName,
            motherName: formData.motherName,
            phone: formData.phone,
            email: formData.email,
            gender: formData.gender,
            pan_number: formData.pan_number,
            aadhar_number: formData.aadhar_number,
            presentAddress: formData.presentAddress,
            previousAddress: formData.previousAddress,
            positionType: formData.positionType,
            employerIdName: formData.employerIdName,
            positionTitle: formData.positionTitle,
            employmentType: formData.employmentType,
            contractEndDate: formData.contractEndDate,
            dob: formData.dob,
            bloodGroup: formData.bloodGroup,
          };
          console.log("submitStep: Submitting personal details:", personalData);
          let action;
          if (progress?.personalDetails) {
            console.log("submitStep: Updating personal details");
            action = await dispatch(updateEmployeePersonalDetails(personalData)).unwrap();
          } else {
            console.log("submitStep: Creating personal details");
            action = await dispatch(createEmployeePersonalDetails(personalData)).unwrap();
          }
          console.log("submitStep: Submission response:", action);
          await dispatch(fetchEmployeePersonalDetails(employee_id)).unwrap();
          setErrors({ general: action.message });
          return true;
        }
        case 1: {
          try {
            const educationData = {
              employee_id,
              tenthClassName: formData.tenthClassName,
              tenthClassMarks: formData.tenthClassMarks,
              intermediateName: formData.intermediateName,
              intermediateMarks: formData.intermediateMarks,
              graduationName: formData.graduationName,
              graduationMarks: formData.graduationMarks,
              postgraduationName: formData.postgraduationName,
              postgraduationMarks: formData.postgraduationMarks,
            };
            console.log("submitStep: Submitting education details:", educationData);
            let action;
            if (progress?.educationDetails) {
              action = await dispatch(updateEducationDetails(educationData)).unwrap();
            } else {
              action = await dispatch(createEducationDetails(educationData)).unwrap();
            }
            await dispatch(fetchEmployeeEducationDetails(employee_id)).unwrap();
            setErrors({ general: action.message });
            return true;
          } catch (err) {
            console.error("submitStep: Education submission error:", err);
            if (err.message?.includes("Access denied")) {
              setErrors({
                general: "Education details are restricted. Proceeding to Documents step.",
              });
              return true; // Allow progression to next step
            }
            throw err;
          }
        }
        case 2: {
          const docFields = [
            { field: "tenthClassDoc", documentType: "tenth_class" },
            { field: "intermediateDoc", documentType: "intermediate" },
            { field: "graduationDoc", documentType: "graduation" },
            { field: "postgraduationDoc", documentType: "postgraduation" },
            { field: "aadharDoc", documentType: "aadhar" },
            { field: "panDoc", documentType: "pan" },
          ];
          let hasNewDocuments = false;
          for (const { field, documentType } of docFields) {
            if (formData[field] && formData[field] instanceof File) {
              console.log("submitStep: Submitting document:", { documentType, file: formData[field] });
              await dispatch(
                createDocuments({
                  employeeId: employee_id,
                  documentType,
                  file: formData[field],
                })
              ).unwrap();
              hasNewDocuments = true;
            }
          }
          if (hasNewDocuments) {
            await dispatch(fetchEmployeeDocuments(employee_id)).unwrap();
            setErrors({ general: "Documents saved successfully!" });
          } else {
            setErrors({ general: "No new documents to submit." });
          }
          return true;
        }
        case 3: {
          const bankData = {
            employee_id,
            bankAccountNumber: formData.bankACnumber,
            ifscCode: formData.ifscNumber,
          };
          console.log("submitStep: Submitting bank details:", bankData);
          let action;
          if (progress?.bankDetails) {
            action = await dispatch(updateBankDetails(bankData)).unwrap();
          } else {
            action = await dispatch(createBankDetails(bankData)).unwrap();
          }
          await dispatch(fetchEmployeeBankDetails(employee_id)).unwrap();
          setErrors({ general: action.message });
          return true;
        }
        default:
          return true;
      }
    } catch (err) {
      const errorMessage = err.message || "Failed to submit step";
      setErrors({ general: errorMessage });
      console.error("submitStep: Submission error:", err);
      return false;
    }
  };
const nextStep = async () => {
  console.log("nextStep: Starting for currentStep", currentStep, "with formData keys:", Object.keys(formData));
  if (currentStep >= steps.length - 1) {
    console.log("nextStep: Already at last step");
    return;
  }

  const isValid = validateStep(currentStep);
  console.log("nextStep: Validation passed?", isValid, "Errors:", errors);
  if (!isValid) return;

  const success = await submitStep(currentStep);
  console.log("nextStep: submitStep success?", success);
  if (success) {
    const nextStepIndex = currentStep + 1;
    if (nextStepIndex === 1) { // Special handling for Education
      try {
        const employee_id = JSON.parse(localStorage.getItem("userToken"))?.employee_id || profile?.employee_id;
        console.log("nextStep: Fetching education for employee_id", employee_id);
        await dispatch(fetchEmployeeEducationDetails(employee_id)).unwrap();
        setCurrentStep(nextStepIndex);
      } catch (err) {
        console.warn("nextStep: Education fetch failed, skipping to step 2:", err.message);
        setErrors({
          general: "Education details are restricted. Proceeding to Documents step.",
        });
        setCurrentStep(2); // Skip to Documents
        return;
      }
    } else {
      setCurrentStep(nextStepIndex);
    }
    
    // Refresh progress after advance
    try {
      await dispatch(getEmployeeProgress()).unwrap();
      console.log("nextStep: Progress refreshed");
    } catch (progressErr) {
      console.warn("nextStep: Progress refresh failed (non-blocking):", progressErr);
    }
    
    console.log("nextStep: Advanced to step", nextStepIndex);
  } else {
    console.log("nextStep: Blocked due to submission failure");
    // Optional: Auto-retry once after 1s for transient errors (e.g., network)
    // if (!errors.general?.includes("network") && !errors.general?.includes("server")) {
    //   setTimeout(() => {
    //     console.log("nextStep: Auto-retrying...");
    //     nextStep();
    //   }, 1000);
    // }
  }
};

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const goToStep = async (index) => {
    if (index === steps.length - 1) {
      setIsPreviewOpen(true);
    } else {
      if (currentStep !== index && validateStep(currentStep)) {
        const success = await submitStep(currentStep);
        if (success) {
          if (index === 1) {
            try {
              const employee_id = JSON.parse(localStorage.getItem("userToken"))?.employee_id || profile?.employee_id;
              console.log("goToStep: Fetching education details for employee_id", employee_id);
              await dispatch(fetchEmployeeEducationDetails(employee_id)).unwrap();
              setCurrentStep(index);
            } catch (err) {
              console.warn("goToStep: Cannot navigate to Education Details due to access restriction:", err);
              setErrors({
                general: "Education details are restricted. Please select another step.",
              });
              return;
            }
          } else {
            setCurrentStep(index);
          }
        }
      } else {
        setCurrentStep(index);
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      goToStep(index);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const employee_id = profile?.employee_id || formData.employee_id;
    if (!employee_id) {
      setErrors({ general: "Please log in to submit details." });
      return;
    }
    if (validateStep(currentStep)) {
      const success = await submitStep(currentStep);
      if (success) {
        setIsPreviewOpen(true);
      }
    }
  };

  const openPreview = () => {
    console.log("Opening preview with formData:", formData);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
  };

  return (
    <div className="w-full mt-4 sm:mt-0">
      <style>
        {`
          .react-datepicker-wrapper {
            width: 100%;
          }
          .react-datepicker__input-container {
            position: relative;
          }
          .react-datepicker__input-container input {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            transition: all 0.3s ease;
          }
          .react-datepicker__input-container input:focus {
            outline: none;
            border-color: #14b8a6;
            box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.2);
          }
          .animate-fade-in {
            animation: fadeIn 0.5s ease-in-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .readonly-field {
            background-color: #f3f4f6;
            color: #4b5563;
            cursor: not-allowed;
          }
        `}
      </style>
      <div className="hidden sm:flex sm:justify-end sm:items-center">
        <PageMeta
          title="Employee Details"
          description="Add or update employee details"
        />
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/emp-dashboard" },
            { label: "Employee Details", link: "/employee/employee-details" },
          ]}
        />
      </div>
      <div className="w-full flex items-center justify-center">
        <div className="w-full bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-8 tracking-tight">
            Employee Details Form
          </h2>
          {errors.general && errors.general.includes("successfully") ? (
            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg text-center">
              {errors.general}
            </div>
          ) : (
            errors.general && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex justify-between items-center">
                {errors.general}
                <button
                  onClick={() => {
                    const userToken = JSON.parse(localStorage.getItem("userToken"));
                    const effectiveEmployeeId = userToken?.employee_id || profile?.employee_id;
                    if (effectiveEmployeeId) {
                      dispatch(getCurrentUserProfile());
                      dispatch(fetchEmployeePersonalDetails(effectiveEmployeeId));
                      dispatch(fetchEmployeeEducationDetails(effectiveEmployeeId));
                      dispatch(fetchEmployeeDocuments(effectiveEmployeeId));
                      dispatch(fetchEmployeeBankDetails(effectiveEmployeeId));
                      setErrors({});
                    } else {
                      navigate("/login");
                    }
                  }}
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Retry
                </button>
              </div>
            )
          )}
          {errors.personalDetails && (
            <div className="mb-4 p-4 bg-yellow-100 text-yellow-700 rounded-lg text-center">
              {errors.personalDetails}
            </div>
          )}
          {errors.educationDetails && (
            <div className="mb-4 p-4 bg-yellow-100 text-yellow-700 rounded-lg text-center">
              {errors.educationDetails}
            </div>
          )}
          {errors.documents && (
            <div className="mb-4 p-4 bg-yellow-100 text-yellow-700 rounded-lg text-center">
              {errors.documents}
            </div>
          )}
          {errors.bankDetails && (
            <div className="mb-4 p-4 bg-yellow-100 text-yellow-700 rounded-lg text-center">
              {errors.bankDetails}
            </div>
          )}
          {loading && (
            <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-3 text-blue-600"
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
              Loading...
            </div>
          )}
          {!loading && !error && !profile && (
            <div className="mb-4 p-4 bg-yellow-100 text-yellow-700 rounded-lg text-center">
              No employee data available. Please ensure you are logged in.
            </div>
          )}
          <StepNavigation
            steps={steps}
            currentStep={currentStep}
            goToStep={goToStep}
            handleKeyDown={handleKeyDown}
          />
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="step-transition" key={currentStep}>
              {currentStep === 0 && (
                <EmployeePersonaldetailsForm
                  formData={formData}
                  errors={errors}
                  handleChange={handleChange}
                  handleDateChange={handleDateChange}
                />
              )}
              {currentStep === 1 && (
                <EmployeeEducationDetailsForm
                  formData={formData}
                  errors={errors}
                  handleChange={handleChange}
                />
              )}
              {currentStep === 2 && (
                <EmployeeDocuments
                  formData={formData}
                  errors={errors}
                  handleChange={handleChange}
                />
              )}
              {currentStep === 3 && (
                <EmployeeBankDetailsForm
                  formData={formData}
                  errors={errors}
                  handleChange={handleChange}
                />
              )}
              {currentStep === 4 && (
                <div className="col-span-2 flex justify-center items-center">
                  <button
                    type="button"
                    onClick={openPreview}
                    className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 hover:scale-105 transition-all duration-300 text-sm font-medium"
                    disabled={!profile}
                  >
                    View Preview
                  </button>
                </div>
              )}
            </div>
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 text-sm font-medium"
                aria-label="Previous step"
              >
                Back
              </button>
              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={loading || !profile}
                  className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  aria-label="Next step"
                >
                  {loading ? "Processing..." : "Next"}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || !profile}
                  className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  aria-label="Submit form"
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      {isPreviewOpen && (
        <EmployeePreview
          formData={formData}
          error={error}
          successMessage={successMessage}
          closePreview={closePreview}
        />
      )}
    </div>
  );
};

export default EmployeeDetails;