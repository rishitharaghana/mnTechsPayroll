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
  clearState,
  getEmployeeProgress,
} from "../../redux/slices/employeeSlice";
import StepNavigation from "../../Components/common/StepNavigation";
import EmployeePersonaldetailsForm from "./EmployeePersonaldetailsForm";
import EmployeeEducationDetailsForm from "./EmployeeEducationDetailsForm";
import EmployeeDocuments from "./EmployeeDocuments";
import EmployeeBankDetailsForm from "./EmployeeBankDetailsForm";
import EmployeePreview from "./EmployeePreview";

const steps = ["Personal Details", "Education Details", "Documents", "Bank Details", "Preview"];

const EmployeeDetails = () => {
  const dispatch = useDispatch();
  const { loading, error, successMessage, employeeId, employees, progress } = useSelector(
    (state) => state.employee
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [formData, setFormData] = useState({
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
        dispatch(getCurrentUserProfile());
        dispatch(getEmployeeProgress());
      } catch (err) {
        setErrors({ general: "Failed to fetch user profile or progress. Please log in again." });
      }
    } else {
      setErrors({ general: "No authentication token found. Please log in." });
    }
  }, [dispatch]);

  useEffect(() => {
    if (employees.length > 0 && employeeId) {
      const employee = employees.find((emp) => emp.employee_id === employeeId);
      if (employee) {
        setFormData((prev) => ({
          ...prev,
          employee_id: employee.employee_id || employeeId,
          fullName: employee.full_name || "",
          email: employee.email || "",
          phone: employee.mobile || "",
          gender: employee.gender || "",
          panCard: employee.pan_card || "", // Added
          aadharCard: employee.aadhar_card || "", // Added
          dob: employee.dob || "",
          bloodGroup: employee.blood_group || "",
          joiningDate: employee.join_date || "",
          employmentType: employee.employment_type || "",
          department: employee.department_name || "",
          position: employee.designation_name || "",
          basicSalary: employee.basic_salary || "",
          allowances: employee.allowances || "",
          bonuses: employee.bonuses || "",
        }));
      }
    }
    if (progress) {
      if (progress.bankDetails) {
        setCurrentStep(4);
      } else if (progress.documents) {
        setCurrentStep(3);
      } else if (progress.educationDetails) {
        setCurrentStep(2);
      } else if (progress.personalDetails) {
        setCurrentStep(1);
      } else {
        setCurrentStep(0);
      }
    }
  }, [employees, employeeId, progress]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
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
      setFormData((prev) => ({
        ...prev,
        [name]: date.toISOString().split("T")[0],
      }));
      if (name === "joiningDate" && !formData.contractEndDate) {
        const joinDate = new Date(date);
        joinDate.setFullYear(joinDate.getFullYear() + 1);
        setFormData((prev) => ({
          ...prev,
          contractEndDate: joinDate.toISOString().split("T")[0],
        }));
      }
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep = (stepIndex) => {
    const newErrors = {};
    switch (stepIndex) {
      case 0: {
        const requiredFields = [
          "fatherName",
          "motherName",
          "presentAddress",
          "positionType",
          "panCard", // Added
          "aadharCard", // Added
        ];
        requiredFields.forEach((field) => {
          if (!formData[field]?.trim()) {
            newErrors[field] = `${field
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())} is required`;
          }
        });
        if (formData.panCard && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panCard)) {
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
            (isNaN(formData[field]) || Number(formData[field]) < 0 || Number(formData[field]) > 100)
          ) {
            newErrors[field] = `Invalid ${field
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())}`;
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
            !["image/jpeg", "image/png", "application/pdf"].includes(formData[field].type)
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
        if (formData.ifscNumber && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscNumber)) {
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
    } else if (index > currentStep) {
      if (validateStep(currentStep)) {
        const success = await submitStep(currentStep);
        if (success) {
          setCurrentStep(index);
        }
      }
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
            employee_id: employeeId,
            fullName: formData.fullName,
            fatherName: formData.fatherName,
            motherName: formData.motherName,
            phone: formData.phone,
            email: formData.email,
            gender: formData.gender,
            panCard: formData.panCard, // Added
            aadharCard: formData.aadharCard, // Added
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
          await dispatch(createEmployeePersonalDetails(personalData)).unwrap();
          return true;
        }
        case 1: {
          const educationData = {
            employee_id: employeeId,
            tenthClassName: formData.tenthClassName,
            tenthClassMarks: formData.tenthClassMarks,
            intermediateName: formData.intermediateName,
            intermediateMarks: formData.intermediateMarks,
            graduationName: formData.graduationName,
            graduationMarks: formData.graduationMarks,
            postgraduationName: formData.postgraduationName,
            postgraduationMarks: formData.postgraduationMarks,
          };
          await dispatch(createEducationDetails(educationData)).unwrap();
          return true;
        }
        case 2: {
          const docFields = [
            { field: "tenthClassDoc", documentType: "tenthClassDoc" },
            { field: "intermediateDoc", documentType: "intermediateDoc" },
            { field: "graduationDoc", documentType: "graduationDoc" },
            { field: "postgraduationDoc", documentType: "postgraduationDoc" },
            { field: "aadharDoc", documentType: "aadharDoc" },
            { field: "panDoc", documentType: "panDoc" },
          ];
          for (const { field, documentType } of docFields) {
            if (formData[field]) {
              await dispatch(
                createDocuments({
                  employeeId,
                  documentType,
                  file: formData[field],
                })
              ).unwrap();
            }
          }
          return true;
        }
        case 3: {
          const bankData = {
            employee_id: employeeId,
            bankAccountNumber: formData.bankACnumber,
            ifscCode: formData.ifscNumber,
          };
          await dispatch(createBankDetails(bankData)).unwrap();
          return true;
        }
        default:
          return true;
      }
    } catch (err) {
      setErrors({ general: err.message || "Failed to submit step" });
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employeeId) {
      setErrors({ general: "Please log in to submit details." });
      return;
    }
    if (validateStep(currentStep)) {
      const success = await submitStep(currentStep);
      if (success) {
        dispatch(clearState());
        setFormData({
          fullName: "",
          fatherName: "",
          motherName: "",
          phone: "",
          email: "",
          gender: "",
          panCard: "", // Added
          aadharCard: "", // Added
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
        setCurrentStep(0);
        setIsPreviewOpen(false);
      }
    }
  };

  const openPreview = () => setIsPreviewOpen(true);
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
        <PageMeta title="Employee Details" description="Add new employee details" />
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
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error === "Access denied: Insufficient permissions"
                ? "You do not have permission to add bank details. Please contact HR."
                : error}
            </div>
          )}
          {loading && (
            <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded-lg">Loading...</div>
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
                  disabled={loading}
                  className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  aria-label="Next step"
                >
                  {loading ? "Processing..." : "Next"}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
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