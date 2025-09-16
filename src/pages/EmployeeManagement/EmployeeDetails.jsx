import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
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
  updateEmployeePersonalDetails, // New thunk
  updateEducationDetails, // New thunk
  updateBankDetails, // New thunk
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
    panCard: "",
    aadharCard: "",
    image: null,
    presentAddress: "",
    previousAddress: "",
    positionType: "",
    employerIdName: "",
    positionTitle: "",
    employmentType: "",
    joiningDate: "",
    contractEndDate: "",
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
    dob: "",
    bloodGroup: "",
    basicSalary: "",
    allowances: "",
    bonuses: "",
    department: "",
    position: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      try {
        console.log("Dispatching profile, progress, and details fetches");
        dispatch(getCurrentUserProfile());
        dispatch(getEmployeeProgress());
        const { employee_id } = JSON.parse(userToken);
        dispatch(fetchEmployeePersonalDetails(employee_id));
        dispatch(fetchEmployeeEducationDetails(employee_id));
        dispatch(fetchEmployeeDocuments(employee_id));
        dispatch(fetchEmployeeBankDetails(employee_id));
      } catch (err) {
        setErrors({
          general: "Failed to fetch user data. Please log in again.",
        });
      }
    } else {
      setErrors({ general: "No authentication token found. Please log in." });
    }
  }, [dispatch]);

  useEffect(() => {
    if (progress) {
      let stepIndex = 0;
      if (progress.personalDetails) stepIndex = 1;
      if (progress.educationDetails) stepIndex = 2;
      if (progress.documents) stepIndex = 3;
      if (progress.bankDetails) stepIndex = 4;
      setCurrentStep(stepIndex);
    }
  }, [progress]);

  useEffect(() => {
    console.log("Redux state in component:", {
      profile,
      personalDetails,
      educationDetails,
      documents,
      bankDetails,
      loading,
      error,
      progress,
    });
    if (profile || personalDetails || educationDetails || documents || bankDetails) {
      const updatedFormData = {
        ...formData,
        // From profile (hrms_users)
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
        // From personal_details
        fatherName: personalDetails?.father_name || "",
        motherName: personalDetails?.mother_name || "",
        presentAddress: personalDetails?.present_address || "",
        previousAddress: personalDetails?.previous_address || "",
        positionType: personalDetails?.position_type || "",
        employerIdName: personalDetails?.employer_id_name || "",
        positionTitle: personalDetails?.position_title || "",
        employmentType: personalDetails?.employment_type || "",
        joiningDate: personalDetails?.joining_date || "",
        contractEndDate: personalDetails?.contract_end_date || "",
        panCard: personalDetails?.pan_number || "",
        aadharCard: personalDetails?.adhar_number || "",
        // From education_details
        tenthClassName: educationDetails?.tenth_class_name || "",
        tenthClassMarks: educationDetails?.tenth_class_marks || "",
        intermediateName: educationDetails?.intermediate_name || "",
        intermediateMarks: educationDetails?.intermediate_marks || "",
        graduationName: educationDetails?.graduation_name || "",
        graduationMarks: educationDetails?.graduation_marks || "",
        postgraduationName: educationDetails?.postgraduation_name || "",
        postgraduationMarks: educationDetails?.postgraduation_marks || "",
        // From bank_details
        ifscNumber: bankDetails?.ifsc_number || "",
        bankACnumber: bankDetails?.bank_account_number || "",
        // From documents
        tenthClassDoc: documents?.find(doc => doc.document_type === "tenth_class")?.file_path || null,
        intermediateDoc: documents?.find(doc => doc.document_type === "intermediate")?.file_path || null,
        graduationDoc: documents?.find(doc => doc.document_type === "graduation")?.file_path || null,
        postgraduationDoc: documents?.find(doc => doc.document_type === "postgraduation")?.file_path || null,
        aadharDoc: documents?.find(doc => doc.document_type === "aadhar")?.file_path || null,
        panDoc: documents?.find(doc => doc.document_type === "pan")?.file_path || null,
      };
      setFormData(updatedFormData);
      console.log("Updated formData:", updatedFormData);
    }
  }, [profile, personalDetails, educationDetails, documents, bankDetails]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    console.log("handleChange:", {
      name,
      value,
      type,
      files: files ? files[0] : null,
    });
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
      if (name === "joiningDate" && !formData.contractEndDate) {
        const joinDate = new Date(date);
        joinDate.setFullYear(joinDate.getFullYear() + 1);
        updatedFormData.contractEndDate = joinDate.toISOString().split("T")[0];
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
          "panCard",
          "aadharCard",
        ];
        requiredFields.forEach((field) => {
          if (!formData[field]?.trim()) {
            newErrors[field] = `${field
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())} is required`;
          }
        });
        if (
          formData.panCard &&
          !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panCard)
        ) {
          newErrors.panCard = "Invalid PAN card number (e.g., ABCDE1234F)";
        }
        if (formData.aadharCard && !/^\d{12}$/.test(formData.aadharCard)) {
          newErrors.aadharCard = "Invalid Aadhar card number (12 digits)";
        }
        if (formData.positionType === "experienced") {
          const experiencedFields = [
            "employerIdName",
            "positionTitle",
            "employmentType",
            "joiningDate",
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = async () => {
    if (currentStep < steps.length - 1) {
      if (validateStep(currentStep)) {
        const success = await submitStep(currentStep);
        if (success) {
          setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
        }
      }
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const goToStep = async (index) => {
    if (index === steps.length - 1) {
      setIsPreviewOpen(true);
    } else {
      setCurrentStep(index);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      goToStep(index);
    }
  };

  const submitStep = async (stepIndex) => {
    try {
      switch (stepIndex) {
        case 0: {
          const personalData = {
            employee_id: profile?.employee_id || formData.employee_id,
            fullName: formData.fullName,
            fatherName: formData.fatherName,
            motherName: formData.motherName,
            phone: formData.phone,
            email: formData.email,
            gender: formData.gender,
            panCard: formData.panCard,
            aadharCard: formData.aadharCard,
            presentAddress: formData.presentAddress,
            previousAddress: formData.previousAddress,
            positionType: formData.positionType,
            employerIdName: formData.employerIdName,
            positionTitle: formData.positionTitle,
            employmentType: formData.employmentType,
            joiningDate: formData.joiningDate,
            contractEndDate: formData.contractEndDate,
            dob: formData.dob,
            bloodGroup: formData.bloodGroup,
          };
          console.log("Submitting personal details:", personalData);
          if (progress?.personalDetails) {
            await dispatch(updateEmployeePersonalDetails(personalData)).unwrap();
            setErrors({ general: "Personal details updated successfully!" });
          } else {
            await dispatch(createEmployeePersonalDetails(personalData)).unwrap();
            setErrors({ general: "Personal details saved successfully!" });
          }
          return true;
        }
        case 1: {
          const educationData = {
            employee_id: profile?.employee_id || formData.employee_id,
            tenthClassName: formData.tenthClassName,
            tenthClassMarks: formData.tenthClassMarks,
            intermediateName: formData.intermediateName,
            intermediateMarks: formData.intermediateMarks,
            graduationName: formData.graduationName,
            graduationMarks: formData.graduationMarks,
            postgraduationName: formData.postgraduationName,
            postgraduationMarks: formData.postgraduationMarks,
          };
          console.log("Submitting education details:", educationData);
          if (progress?.educationDetails) {
            await dispatch(updateEducationDetails(educationData)).unwrap();
            setErrors({ general: "Education details updated successfully!" });
          } else {
            await dispatch(createEducationDetails(educationData)).unwrap();
            setErrors({ general: "Education details saved successfully!" });
          }
          return true;
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
          for (const { field, documentType } of docFields) {
            if (formData[field]) {
              console.log("Submitting document:", {
                documentType,
                file: formData[field],
              });
              await dispatch(
                createDocuments({
                  employeeId: profile?.employee_id || formData.employee_id,
                  documentType,
                  file: formData[field],
                })
              ).unwrap();
            }
          }
          setErrors({ general: "Documents saved successfully!" });
          return true;
        }
        case 3: {
          const bankData = {
            employee_id: profile?.employee_id || formData.employee_id,
            bankAccountNumber: formData.bankACnumber,
            ifscCode: formData.ifscNumber,
          };
          console.log("Submitting bank details:", bankData);
          if (progress?.bankDetails) {
            await dispatch(updateBankDetails(bankData)).unwrap();
            setErrors({ general: "Bank details updated successfully!" });
          } else {
            await dispatch(createBankDetails(bankData)).unwrap();
            setErrors({ general: "Bank details saved successfully!" });
          }
          return true;
        }
        default:
          return true;
      }
    } catch (err) {
      setErrors({ general: err.message || "Failed to submit step" });
      console.error("Submission error:", err);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile?.employee_id) {
      setErrors({ general: "Please log in to submit details." });
      return;
    }
    if (validateStep(currentStep)) {
      const success = await submitStep(currentStep);
      if (success) {
        setIsPreviewOpen(true); // Move to preview instead of resetting
      }
    }
  };



  const openPreview = () => {
    console.log("Opening preview with formData:", formData);
    setIsPreviewOpen(true);
  };

  const closePreview = () => setIsPreviewOpen(false);

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
                    dispatch(getCurrentUserProfile());
                    const userToken = JSON.parse(localStorage.getItem("userToken"));
                    dispatch(fetchEmployeePersonalDetails(userToken.employee_id));
                    dispatch(fetchEmployeeEducationDetails(userToken.employee_id));
                    dispatch(fetchEmployeeDocuments(userToken.employee_id));
                    dispatch(fetchEmployeeBankDetails(userToken.employee_id));
                  }}
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Retry
                </button>
              </div>
            )
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