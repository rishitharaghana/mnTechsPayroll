import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  fetchEmployees,
  fetchEmployeePersonalDetails,
  fetchEmployeeEducationDetails,
  fetchEmployeeDocuments,
  fetchEmployeeBankDetails,
} from "../../redux/slices/employeeSlice";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";

const ViewEmployeeDetails = () => {
  const dispatch = useDispatch();
  const { employees, personalDetails, educationDetails, documents, bankDetails, loading, error } = useSelector(
    (state) => state.employee
  );
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      dispatch(fetchEmployees()).catch((err) => {
        console.error("Failed to fetch employees:", err);
      });
    } else {
      console.error("No authentication token found. Please log in.");
    }
  }, [dispatch]);

  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    dispatch(fetchEmployeePersonalDetails(employee.employee_id));
    dispatch(fetchEmployeeEducationDetails(employee.employee_id));
    dispatch(fetchEmployeeDocuments(employee.employee_id));
    dispatch(fetchEmployeeBankDetails(employee.employee_id));
  };

  const closeDetails = () => {
    setSelectedEmployee(null);
    dispatch({ type: "employee/clearState" }); // Clear detailed data
  };

  const EmployeeDetailsPopup = ({ employee }) => {
    const stepGroups = [
      {
        title: "Personal Details",
        fields: [
          { label: "Full Name", value: personalDetails?.full_name || "N/A" },
          { label: "Father’s Name", value: personalDetails?.father_name || "N/A" },
          { label: "Mother’s Name", value: personalDetails?.mother_name || "N/A" },
          { label: "Phone", value: personalDetails?.phone || "N/A" },
          { label: "Alternate Phone", value: personalDetails?.alternate_phone || "N/A" },
          { label: "Email", value: personalDetails?.email || "N/A" },
          { label: "Gender", value: personalDetails?.gender || "N/A" },
          {
            label: "Photo",
            value: employee?.photo_url ? (
              <img
                src={employee.photo_url}
                alt="Employee"
                className="w-24 h-24 rounded-lg"
                style={{ maxHeight: "100px", objectFit: "cover" }}
              />
            ) : (
              "N/A"
            ),
          },
          { label: "Present Address", value: personalDetails?.present_address || "N/A" },
          { label: "Previous Address", value: personalDetails?.previous_address || "N/A" },
        ],
      },
      {
        title: "Position Information",
        fields: [
          { label: "Position Type", value: personalDetails?.position_type || "N/A" },
          { label: "Employer ID/Name", value: personalDetails?.employer_id_name || "N/A" },
          { label: "Position Title", value: personalDetails?.position_title || "N/A" },
          { label: "Employment Type", value: personalDetails?.employment_type || employee?.employment_type || "N/A" },
          { label: "Joining Date", value: personalDetails?.joining_date || employee?.join_date || "N/A" },
          { label: "Contract End Date", value: personalDetails?.contract_end_date || "N/A" },
          { label: "Department", value: employee?.department_name || "N/A" },
          { label: "Designation", value: employee?.designation_name || "N/A" },
          { label: "Basic Salary", value: employee?.basic_salary ? `₹${employee.basic_salary}` : "N/A" },
          { label: "Allowances", value: employee?.allowances ? `₹${employee.allowances}` : "N/A" },
        ],
      },
      {
        title: "Education Details",
        fields: [
          { label: "10th Class Name", value: educationDetails?.tenth_class_name || "N/A" },
          { label: "10th Class Marks", value: educationDetails?.tenth_class_marks ? `${educationDetails.tenth_class_marks}%` : "N/A" },
          { label: "Intermediate Name", value: educationDetails?.intermediate_name || "N/A" },
          { label: "Intermediate Marks", value: educationDetails?.intermediate_marks ? `${educationDetails.intermediate_marks}%` : "N/A" },
          { label: "Graduation Name", value: educationDetails?.graduation_name || "N/A" },
          { label: "Graduation Marks", value: educationDetails?.graduation_marks ? `${educationDetails.graduation_marks}%` : "N/A" },
          { label: "Postgraduation Name", value: educationDetails?.postgraduation_name || "N/A" },
          { label: "Postgraduation Marks", value: educationDetails?.postgraduation_marks ? `${educationDetails.postgraduation_marks}%` : "N/A" },
        ],
      },
      {
        title: "Documents",
        fields: documents.map((doc) => ({
          label: doc.document_type.replace(/_/g, " ").toUpperCase(),
          value: (
            <div className="flex flex-col items-center">
              {doc.file_type === "image" ? (
                <img
                  src={doc.file_path}
                  alt={doc.document_type}
                  className="w-24 h-24 rounded-lg"
                  style={{ maxHeight: "100px", objectFit: "cover" }}
                />
              ) : (
                <div className="flex flex-col items-center">
                  <svg
                    className="w-10 h-10 text-red-500"
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
                    href={doc.file_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm mt-2"
                  >
                    View PDF
                  </a>
                </div>
              )}
            </div>
          ),
        })),
      },
      {
        title: "Bank Details",
        fields: [
          { label: "Bank Account Number", value: bankDetails?.bank_account_number || "N/A" },
          { label: "IFSC Code", value: bankDetails?.ifsc_number || "N/A" },
        ],
      },
    ];

    return (
      <div className="fixed inset-0 bg-gradient-to-br from-teal-500 to-blue-600 bg-opacity-80 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 relative shadow-2xl">
          <button
            onClick={closeDetails}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close details"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <h3 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">
            Employee Details - {employee.full_name || "N/A"}
          </h3>
          {loading && (
            <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded-lg">
              Loading details...
            </div>
          )}
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          <div className="space-y-8">
            {stepGroups.map((group, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-6 shadow-sm animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <h4 className="text-lg font-semibold text-teal-600 mb-4">
                  {group.title}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                  {group.fields.map((field, idx) => (
                    <p key={idx} className="flex flex-col gap-2">
                      <strong>{field.label}:</strong> {field.value}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={closeDetails}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-300 text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-78/100">
      <div className="flex justify-end">
        <PageMeta
          title="Employee List"
          description="View all employee details"
        />
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/ehr-dashboard" },
            { label: "Employee List", link: "/ehr/employee-list" },
          ]}
        />
      </div>
    <div className="w-full">
      <style>
        {`
          .animate-fade-in {
            animation: fadeIn 0.5s ease-in-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
      <div className="w-full bg-white rounded-2xl shadow-md border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8 tracking-tight">
          Employee List
        </h2>
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {loading && (
          <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded-lg">
            Loading...
          </div>
        )}
        {employees.length === 0 && !loading && (
          <div className="mb-4 p-4 bg-yellow-100 text-yellow-700 rounded-lg">
            No employees found.
          </div>
        )}
        {employees.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-teal-600 text-white">
                  <th className="px-4 py-2 text-left">Employee ID</th>
                  <th className="px-4 py-2 text-left">Full Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Phone</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.employee_id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-2">{employee.employee_id}</td>
                    <td className="px-4 py-2">{employee.full_name || "N/A"}</td>
                    <td className="px-4 py-2">{employee.email || "N/A"}</td>
                    <td className="px-4 py-2">{employee.mobile || "N/A"}</td>
                    <td className="px-4 py-2">{employee.role || "N/A"}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleViewDetails(employee)}
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-300 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {selectedEmployee && <EmployeeDetailsPopup employee={selectedEmployee} />}
    </div>
    </div>
  );
};

export default ViewEmployeeDetails;