import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEmployeePersonalDetails,
  fetchEmployeeEducationDetails,
  fetchEmployeeDocuments,
  fetchEmployeeBankDetails,
} from "../../redux/slices/employeeSlice";
import EmployeePreview from "./EmployeePreview";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";

const EmployeePreviewPage = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    personalDetails,
    educationDetails,
    documents,
    bankDetails,
    loading,
    error,
  } = useSelector((state) => state.employee);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (!state?.employee) {
      dispatch(fetchEmployeePersonalDetails(id));
      dispatch(fetchEmployeeEducationDetails(id));
      dispatch(fetchEmployeeDocuments(id));
      dispatch(fetchEmployeeBankDetails(id));
    }
  }, [dispatch, id, state]);

  const formData = state?.employee
    ? {
        fullName: state.employee.full_name || state.employee.name || "N/A",
        fatherName: state.employee.father_name || "N/A",
        motherName: state.employee.mother_name || "N/A",
        phone: state.employee.mobile || "N/A",
        email: state.employee.email || "N/A",
        gender: state.employee.gender || "N/A",
        image: state.employee.photo_url || null,
        presentAddress: state.employee.present_address || "N/A",
        previousAddress: state.employee.previous_address || "N/A",
        positionType:
          state.employee.position_type ||
          (state.employee.role === "employee" ||
          state.employee.role === "manager"
            ? "experienced"
            : "N/A"),
        employerIdName: state.employee.employee_id || "N/A",
        positionTitle: state.employee.designation_name || "N/A",
        employmentType: state.employee.employment_type || "N/A",
        joiningDate: state.employee.join_date || "N/A",
        contractEndDate: state.employee.contract_end_date || "N/A",
        tenthClassName: state.employee.tenth_class_name || "N/A",
        tenthClassMarks: state.employee.tenth_class_marks || null,
        intermediateName: state.employee.intermediate_name || "N/A",
        intermediateMarks: state.employee.intermediate_marks || null,
        graduationName: state.employee.graduation_name || "N/A",
        graduationMarks: state.employee.graduation_marks || null,
        postgraduationName: state.employee.postgraduation_name || "N/A",
        postgraduationMarks: state.employee.postgraduation_marks || null,
        tenthClassDoc: state.employee.tenth_class_doc || null,
        intermediateDoc: state.employee.intermediate_doc || null,
        graduationDoc: state.employee.graduation_doc || null,
        postgraduationDoc: state.employee.postgraduation_doc || null,
        aadharDoc: state.employee.aadhar_doc || null,
        panDoc: state.employee.pan_doc || null,
        ifscNumber: state.employee.ifsc_number || "N/A",
        bankACnumber: state.employee.bank_account_number || "N/A",
      }
    : {
        fullName: personalDetails?.full_name || "N/A",
        fatherName: personalDetails?.father_name || "N/A",
        motherName: personalDetails?.mother_name || "N/A",
        phone: personalDetails?.phone || "N/A",
        email: personalDetails?.email || "N/A",
        gender: personalDetails?.gender || "N/A",
        image: personalDetails?.photo_url || null,
        presentAddress: personalDetails?.present_address || "N/A",
        previousAddress: personalDetails?.previous_address || "N/A",
        positionType: personalDetails?.position_type || "N/A",
        employerIdName: personalDetails?.employer_id_name || id || "N/A",
        positionTitle: personalDetails?.position_title || "N/A",
        employmentType: personalDetails?.employment_type || "N/A",
        joiningDate: personalDetails?.joining_date || "N/A",
        contractEndDate: personalDetails?.contract_end_date || "N/A",
        tenthClassName: educationDetails?.tenth_class_name || "N/A",
        tenthClassMarks: educationDetails?.tenth_class_marks || null,
        intermediateName: educationDetails?.intermediate_name || "N/A",
        intermediateMarks: educationDetails?.intermediate_marks || null,
        graduationName: educationDetails?.graduation_name || "N/A",
        graduationMarks: educationDetails?.graduation_marks || null,
        postgraduationName: educationDetails?.postgraduation_name || "N/A",
        postgraduationMarks: educationDetails?.postgraduation_marks || null,
        tenthClassDoc:
          documents?.find((doc) => doc.document_type === "tenth_class")
            ?.file_path || null,
        intermediateDoc:
          documents?.find((doc) => doc.document_type === "intermediate")
            ?.file_path || null,
        graduationDoc:
          documents?.find((doc) => doc.document_type === "graduation")
            ?.file_path || null,
        postgraduationDoc:
          documents?.find((doc) => doc.document_type === "postgraduation")
            ?.file_path || null,
        aadharDoc:
          documents?.find((doc) => doc.document_type === "aadhar")?.file_path ||
          null,
        panDoc:
          documents?.find((doc) => doc.document_type === "pan")?.file_path ||
          null,
        ifscNumber: bankDetails?.ifsc_number || "N/A",
        bankACnumber: bankDetails?.bank_account_number || "N/A",
      };

  const tabs = [
    "Personal Details",
    "Position Information",
    "Education Details",
    "Documents",
    "Bank Details",
  ];

  const closePreview = () => {
    navigate("/admin/employees");
  };

  return (
    <div className="w-full">
      <div className="hidden md:flex md:justify-end">
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "Employees", link: "/admin/employees" },
            { label: "Employee Preview", link: "#" },
          ]}
        />
        <PageMeta
          title="Employee Information"
          description="View detailed employee information."
        />
      </div>
      <div className="">
        <h3 className="text-2xl font-bold text-left text-gray-900 mb-3 tracking-tight">
          Employee Information
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

        <div>
          {loading ? (
            <div className="text-center text-gray-600 animate-pulse">
              Loading employee details...
            </div>
          ) : error ? (
            <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">
              {error}
            </div>
          ) : (
            <EmployeePreview
              formData={formData}
              activeTab={activeTab}
              closePreview={closePreview}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeePreviewPage;
