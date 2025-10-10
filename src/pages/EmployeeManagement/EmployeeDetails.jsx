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
  const [isSubmitted, setIsSubmitted] = useState(() => {
    const savedEmployeeId = localStorage.getItem("employee_id");
    return savedEmployeeId
      ? localStorage.getItem(`form_submitted_${savedEmployeeId}`) === "true"
      : false;
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [formData, setFormData] = useState(() => {
    const savedEmployeeId = localStorage.getItem("employee_id") || profile?.employee_id || `TEMP_${Date.now()}`;
    localStorage.setItem("employee_id", savedEmployeeId);
    return {
      employee_id: savedEmployeeId,
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
    };
  });
  const [errors, setErrors] = useState({});
  const isInitialFetchDone = useRef(false);

  // Sync isSubmitted with progress
  useEffect(() => {
    if (isInitialFetchDone.current && progress) {
      const isFormComplete =
        progress.personalDetails &&
        progress.educationDetails &&
        progress.documents &&
        progress.bankDetails;
      if (isFormComplete !== isSubmitted) {
        setIsSubmitted(isFormComplete);
        localStorage.setItem(`form_submitted_${formData.employee_id}`, isFormComplete.toString());
        console.log("useEffect: Synced isSubmitted with progress", { isFormComplete, employee_id: formData.employee_id });
      }
    }
  }, [progress, formData.employee_id, isSubmitted]);

  // Auto-hide success message
  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
        console.log("Success message hidden after timeout");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  // Initial data fetch
  useEffect(() => {
    if (isInitialFetchDone.current) return;
    const employee_id = formData.employee_id;
    console.log("Dispatching profile, progress, and details fetches", { employee_id });
    dispatch(getCurrentUserProfile());
    dispatch(getEmployeeProgress());
    dispatch(fetchEmployeePersonalDetails(employee_id)).catch((err) => {
      console.error("Personal details fetch failed:", err);
      setErrors((prev) => ({
        ...prev,
        personalDetails: "Unable to fetch personal details. You can still proceed.",
      }));
    });
    Promise.all([
      dispatch(fetchEmployeeEducationDetails(employee_id)).catch((err) => {
        console.error("Education details fetch failed:", err);
        setErrors((prev) => ({
          ...prev,
          educationDetails: "Education details not found. Please add them.",
        }));
      }),
      dispatch(fetchEmployeeDocuments(employee_id)).catch((err) => {
        console.error("Documents fetch failed:", err);
        setErrors((prev) => ({
          ...prev,
          documents: "Unable to fetch documents. You can still proceed.",
        }));
      }),
      dispatch(fetchEmployeeBankDetails(employee_id)).catch((err) => {
        console.error("Bank details fetch failed:", err);
        setErrors((prev) => ({
          ...prev,
          bankDetails: "Unable to fetch bank details. You can still proceed.",
        }));
      }),
    ]).then(() => {
      isInitialFetchDone.current = true;
    });
  }, [dispatch, formData.employee_id]);

  // Populate formData with fetched data
  useEffect(() => {
    if (!profile && !personalDetails && !educationDetails && !documents && !bankDetails) {
      console.log("No data available yet for formData update");
      return;
    }
    const newFormData = {
      employee_id: profile?.employee_id || formData.employee_id,
      fullName: profile?.full_name || formData.fullName,
      email: profile?.email || formData.email,
      phone: profile?.mobile || formData.phone,
      gender: profile?.gender || formData.gender,
      dob: profile?.dob || formData.dob,
      bloodGroup: profile?.blood_group || formData.bloodGroup,
      department: profile?.department_name || formData.department,
      position: profile?.designation_name || formData.position,
      basicSalary: profile?.basic_salary || formData.basicSalary,
      allowances: profile?.allowances || formData.allowances,
      bonuses: profile?.bonuses || formData.bonuses,
      fatherName: personalDetails?.father_name || formData.fatherName,
      motherName: personalDetails?.mother_name || formData.motherName,
      presentAddress: personalDetails?.present_address || formData.presentAddress,
      previousAddress: personalDetails?.previous_address || formData.previousAddress,
      positionType: personalDetails?.position_type || formData.positionType,
      employerIdName: personalDetails?.employer_id_name || formData.employerIdName,
      positionTitle: personalDetails?.position_title || formData.positionTitle,
      employmentType: personalDetails?.employment_type || formData.employmentType,
      contractEndDate: personalDetails?.contract_end_date || formData.contractEndDate,
      pan_number: personalDetails?.pan_number || formData.pan_number,
      aadhar_number: personalDetails?.aadhar_number || formData.aadhar_number,
      tenthClassName: educationDetails?.tenth_class_name || formData.tenthClassName,
      tenthClassMarks: educationDetails?.tenth_class_marks || formData.tenthClassMarks,
      intermediateName: educationDetails?.intermediate_name || formData.intermediateName,
      intermediateMarks: educationDetails?.intermediate_marks || formData.intermediateMarks,
      graduationName: educationDetails?.graduation_name || formData.graduationName,
      graduationMarks: educationDetails?.graduation_marks || formData.graduationMarks,
      postgraduationName: educationDetails?.postgraduation_name || formData.postgraduationName,
      postgraduationMarks: educationDetails?.postgraduation_marks || formData.postgraduationMarks,
      ifscNumber: bankDetails?.ifsc_number || formData.ifscNumber,
      bankACnumber: bankDetails?.bank_account_number || formData.bankACnumber,
      tenthClassDoc: documents?.find(doc => doc.document_type === "tenth_class")?.file_path || formData.tenthClassDoc,
      intermediateDoc: documents?.find(doc => doc.document_type === "intermediate")?.file_path || formData.intermediateDoc,
      graduationDoc: documents?.find(doc => doc.document_type === "graduation")?.file_path || formData.graduationDoc,
      postgraduationDoc: documents?.find(doc => doc.document_type === "postgraduation")?.file_path || formData.postgraduationDoc,
      aadharDoc: documents?.find(doc => doc.document_type === "aadhar")?.file_path || formData.aadharDoc,
      panDoc: documents?.find(doc => doc.document_type === "pan")?.file_path || formData.panDoc,
    };
    if (JSON.stringify(newFormData) !== JSON.stringify(formData)) {
      setFormData(newFormData);
      console.log("Updated formData:", JSON.stringify(newFormData, null, 2));
    }
  }, [profile, personalDetails, educationDetails, documents, bankDetails]);

  const handleChange = (e) => {
    if (isSubmitted) return;
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
    if (isSubmitted) return;
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
    if (isSubmitted) return true;
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
            formData[field] instanceof File &&
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
    console.log("Validation errors for step", stepIndex, ":", newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitAllSteps = async () => {
    try {
      const employee_id = formData.employee_id;
      if (!employee_id) {
        throw new Error("Employee ID is required and cannot be undefined");
      }

      // Submit Personal Details
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
      let personalAction;
      if (progress?.personalDetails) {
        personalAction = await dispatch(updateEmployeePersonalDetails(personalData)).unwrap();
      } else {
        personalAction = await dispatch(createEmployeePersonalDetails(personalData)).unwrap();
      }

      // Submit Education Details
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
      let educationAction;
      if (progress?.educationDetails) {
        educationAction = await dispatch(updateEducationDetails(educationData)).unwrap();
      } else {
        educationAction = await dispatch(createEducationDetails(educationData)).unwrap();
      }

      // Submit Documents
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

      // Submit Bank Details
      const bankData = {
        employee_id,
        bankAccountNumber: formData.bankACnumber,
        ifscCode: formData.ifscNumber,
      };
      let bankAction;
      if (progress?.bankDetails) {
        bankAction = await dispatch(updateBankDetails(bankData)).unwrap();
      } else {
        bankAction = await dispatch(createBankDetails(bankData)).unwrap();
      }

      // Refresh all data after submission
      await Promise.all([
        dispatch(fetchEmployeePersonalDetails(employee_id)),
        dispatch(fetchEmployeeEducationDetails(employee_id)),
        dispatch(fetchEmployeeDocuments(employee_id)),
        dispatch(fetchEmployeeBankDetails(employee_id)),
        dispatch(getEmployeeProgress()),
      ]);

      // Mark form as submitted and show success message
      setIsSubmitted(true);
      localStorage.setItem(`form_submitted_${employee_id}`, "true");
      setShowSuccessMessage(true);
      setErrors({ general: "All details submitted successfully!" });
      console.log("submitAllSteps: Submission successful");
      return true;
    } catch (err) {
      const errorMessage = err.message || "Failed to submit all details. Please try again.";
      setErrors({ general: errorMessage });
      console.error("submitAllSteps: Submission error:", err);
      return false;
    }
  };

  const nextStep = () => {
    if (isSubmitted && currentStep >= steps.length - 1) {
      console.log("nextStep: Blocked - At last step");
      return;
    }

    if (!isSubmitted) {
      const isValid = validateStep(currentStep);
      if (!isValid) return;
    }

    setCurrentStep(currentStep + 1);
    setShowSuccessMessage(false);
    setErrors({});
    console.log("nextStep: Advanced to step", currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep === 0) {
      console.log("prevStep: Blocked - At first step");
      return;
    }
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    setShowSuccessMessage(false);
    setErrors({});
    console.log("prevStep: Moved to step", Math.max(currentStep - 1, 0));
  };

  const goToStep = (index) => {
    console.log("goToStep: Attempting to navigate to step", index, { isSubmitted, currentStep });

    if (index === steps.length - 1) {
      setIsPreviewOpen(true);
      setCurrentStep(index);
      console.log("goToStep: Opening preview, set currentStep to", index);
      return;
    }

    if (!isSubmitted && currentStep !== index) {
      const isValid = validateStep(currentStep);
      if (!isValid) {
        console.log("goToStep: Validation failed for current step", currentStep);
        return;
      }
    }

    setCurrentStep(index);
    setShowSuccessMessage(false);
    setErrors({});
    console.log("goToStep: Moved to step", index);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      goToStep(index);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit: Starting submission for step", currentStep, { isSubmitted });

    if (isSubmitted && currentStep === steps.length - 1) {
      console.log("handleSubmit: Already submitted, opening preview");
      setIsPreviewOpen(true);
      return;
    }

    if (currentStep !== steps.length - 1) {
      nextStep();
      return;
    }

    if (!isSubmitted) {
      const isValid = validateStep(currentStep);
      if (!isValid) return;

      const success = await submitAllSteps();
      if (success) {
        setIsPreviewOpen(true);
        setCurrentStep(steps.length - 1);
        console.log("handleSubmit: Submission successful, opening preview");
      } else {
        console.log("handleSubmit: Submission failed");
      }
    }
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setCurrentStep(0);
    setShowSuccessMessage(false);
    console.log("closePreview: Preview closed, returned to step 0");
  };

  const handleResetForm = () => {
    const employee_id = formData.employee_id;
    localStorage.removeItem(`form_submitted_${employee_id}`);
    setIsSubmitted(false);
    setFormData({
      employee_id: profile?.employee_id || `TEMP_${Date.now()}`,
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
    dispatch(clearState());
    setErrors({});
    setCurrentStep(0);
    console.log("handleResetForm: Form and localStorage reset", { employee_id });
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
        <PageMeta title="Employee Details" description="Add or update employee details" />
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
          {showSuccessMessage && (
            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg text-center">
              Form has been successfully submitted and is now locked for editing.
            </div>
          )}
          {errors.general && !errors.general.includes("successfully") && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex justify-between items-center">
              {errors.general}
              <button
                onClick={() => {
                  const employee_id = formData.employee_id;
                  dispatch(getCurrentUserProfile());
                  dispatch(fetchEmployeePersonalDetails(employee_id));
                  dispatch(fetchEmployeeEducationDetails(employee_id));
                  dispatch(fetchEmployeeDocuments(employee_id));
                  dispatch(fetchEmployeeBankDetails(employee_id));
                  setErrors({});
                }}
                className="text-blue-600 underline hover:text-blue-800"
              >
                Retry
              </button>
            </div>
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
                  isSubmitted={isSubmitted}
                />
              )}
              {currentStep === 1 && (
                <EmployeeEducationDetailsForm
                  formData={formData}
                  errors={errors}
                  handleChange={handleChange}
                  isSubmitted={isSubmitted}
                />
              )}
              {currentStep === 2 && (
                <EmployeeDocuments
                  formData={formData}
                  errors={errors}
                  handleChange={handleChange}
                  isSubmitted={isSubmitted}
                />
              )}
              {currentStep === 3 && (
                <EmployeeBankDetailsForm
                  formData={formData}
                  errors={errors}
                  handleChange={handleChange}
                  isSubmitted={isSubmitted}
                />
              )}
              {currentStep === 4 && (
                <div className="col-span-2 flex justify-center items-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    {loading ? "Submitting..." : isSubmitted ? "View Preview" : "Submit and Preview"}
                  </button>
                </div>
              )}
            </div>
            {currentStep < steps.length - 1 && (
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
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={loading || currentStep === steps.length - 1}
                  className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  aria-label="Next step"
                >
                  {loading ? "Processing..." : "Next"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
      {isPreviewOpen && (
        <EmployeePreview
          formData={formData}
          // error={error}
          successMessage={successMessage}
          closePreview={closePreview}
        />
      )}
    </div>
  );
};

export default EmployeeDetails;