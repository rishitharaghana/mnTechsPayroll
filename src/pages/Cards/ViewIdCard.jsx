import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchEmployees,
  getCurrentUserProfile,
} from "../../redux/slices/employeeSlice.js";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb.jsx";
import PageMeta from "../../Components/common/PageMeta.jsx";
import Select from "react-select";

const ViewIdCard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { employees, currentEmployee, loading, error } = useSelector(
    (state) => state.employee
  );
  console.log("employees:", employees, "currentEmployee:", currentEmployee);

  const [card, setCard] = useState(null);
  const [selectedId, setSelectedId] = useState("");

  // Get role & employee_id from localStorage
  const stored = localStorage.getItem("userToken");
  const authData = stored ? JSON.parse(stored) : null;
  const role = authData?.role;
  const loggedInEmployeeId = authData?.employee_id;

  useEffect(() => {
    if (role === "employee") {
      // Fetch only the current user's profile
      dispatch(getCurrentUserProfile()).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          const self = res.payload?.data;
          if (self) {
            setCard(self);
            setSelectedId(String(self.id));
          }
        }
      });
    } else if (["super_admin", "hr"].includes(role)) {
      // Fetch all employees for admin roles
      dispatch(fetchEmployees()).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          const data = Array.isArray(res.payload)
            ? res.payload
            : res.payload?.data || [];
          // Optionally set default card (e.g., first employee)
          if (data.length > 0) {
            setCard(data[0]);
            setSelectedId(String(data[0].id));
          }
        }
      });
    }
  }, [dispatch, role, loggedInEmployeeId]);

  // Handle dropdown change (for super_admin/hr)
  const handleSelectChange = (selectedOption) => {
    const empId = selectedOption ? String(selectedOption.value) : "";
    setSelectedId(empId);
    const selectedEmployee = employees.find((emp) => String(emp.id) === empId);
    setCard(selectedEmployee || null);
  };

  // Memoize employee options for performance (for super_admin/hr)
  const employeeOptions = useMemo(
    () =>
      employees.map((emp) => ({
        value: String(emp.id),
        label: `${emp.full_name || "Unknown"} (${emp.employee_id || "N/A"})`,
      })),
    [employees]
  );

  // Function to get first two letters of the employee's name
  const getInitials = (name) => {
    if (!name) return "NA";
    const initials = name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
    return initials || "NA";
  };

  if (loading) {
    return <p className="p-6 text-slate-500">Loading...</p>;
  }

  return (
    <div className="w-full mt-4 sm:mt-0">
      <div className="hidden sm:flex sm:justify-end sm:items-center">
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "ID Card", link: "/view-id-card" },
          ]}
        />
        <PageMeta title="View ID Card" description="View ID Card" />
      </div>
      <div className="p-8 bg-white shadow-md rounded-2xl max-h-screen overflow-y-auto">
        <h2 className="text-2xl font-bold text-center text-gray-900 sm:mb-8 mb-6  tracking-tight">
          {role === "employee" ? "My ID Card" : "Select Employee ID Card"}
        </h2>

        {/* Error message */}
        {error && (
          <p className="mb-4 text-red-600 font-medium bg-red-100 p-2 rounded">
            {error}
          </p>
        )}

        {/* Employee Dropdown (HR/Superadmin only) */}
        {role !== "employee" && (
          <div className="max-w-sm mb-6">
            <label className="block text-lg font-bold text-left text-gray-900 tracking-tight mb-2">
              Choose Employee :
            </label>
            {employees.length > 0 ? (
              <Select
                options={employeeOptions}
                value={
                  employeeOptions.find(
                    (option) => option.value === selectedId
                  ) || null
                }
                onChange={handleSelectChange}
                placeholder="Select Employee"
                className="w-full"
                classNamePrefix="react-select"
                menuPlacement="auto"
                maxMenuHeight={200}
                classNames={{
                  input: () => "text-sm font-bold text-gray-900",
                }}
                styles={{
                  control: (base) => ({
                    ...base,
                    padding: "0.2rem",
                    borderRadius: "0.5rem",
                    borderColor: "#d1d5db",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                    zIndex: "9999",
                    "&:hover": { borderColor: "#14b8a6" },
                  }),
                  menu: (base) => ({
                    ...base,
                    maxHeight: "200px",
                    overflowY: "auto",
                    borderRadius: "0.5rem",
                  }),
                  option: (base, { isFocused, isSelected }) => ({
                    ...base,
                    padding: "0.4rem 2rem",
                    borderRadius: "0.5rem",
                    backgroundColor: isSelected
                      ? "#14b8a6"
                      : isFocused
                      ? "#e0f2fe"
                      : "white",
                    color: isSelected ? "white" : "#1f2937",
                    "&:hover": {
                      backgroundColor: isSelected ? "#14b8a6" : "#e0f2fe",
                    },
                  }),
                }}
                isSearchable
                filterOption={(option, inputValue) =>
                  option.label.toLowerCase().includes(inputValue.toLowerCase())
                }
              />
            ) : (
              <p className="text-slate-500">No employees found.</p>
            )}
          </div>
        )}

        {/* Show card */}
        {card ? (
          <div className="flex justify-center">
            {/* Responsive container */}
            <div className="w-full max-w-md aspect-[3/4] relative">
              {/* Scaling wrapper */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  id="id-card"
                  className="shadow-2xl bg-white relative sm:w-[340px] w-[256px] sm:h-[530px] h-[400px] bg-center bg-contain bg-no-repeat"
                  style={{ backgroundImage: "url(/assets/IDCardTemplate.png)" }}
                >
                  {/* Employee Photo */}
                  <div className="absolute sm:top-[22%] top-[19%] left-1/2 -translate-x-1/2">
                    <div className="w-[120px] h-[120px] rounded-full overflow-hidden relative flex items-center justify-center">
                      {card.photo_url ? (
                        <img
                          src={card.photo_url}
                          alt={`${card.full_name || "Employee"}'s profile`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className="absolute inset-0 flex items-center justify-center text-slate-700 text-4xl font-bold"
                        style={{ display: card.photo_url ? "none" : "flex" }}
                      >
                        {getInitials(card.full_name)}
                      </div>
                    </div>
                  </div>

                  {/* Employee Details */}
                  <div className="absolute sm:top-[51%] top-[50%] left-0 right-0 sm:px-8 px-5">
                    <div className="text-center sm:mb-4 mb-3">
                      <h2 className="sm:text-lg md:text-xl text-md font-bold text-blue-900 mb-1">
                        {card.full_name || "Unknown"}
                      </h2>
                      <p className="text-gray-600 text-xs sm:text-md font-medium">
                        {card.designation_name || "N/A"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="w-1/2 text-gray-700 sm:text-md text-xs font-medium">
                          ID No
                        </span>
                        <span className="w-1/2 text-blue-900 sm:text-md text-xs font-medium">
                          : {card.employee_id || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="w-1/2 text-gray-700 sm:text-md text-xs font-medium">
                          Blood Group
                        </span>
                        <span className="w-1/2 text-blue-900 sm:text-md text-xs font-medium">
                          : {card.blood_group || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="w-1/2 text-gray-700 sm:text-md text-xs font-medium">
                          Mobile Number
                        </span>
                        <span className="w-1/2 text-blue-900 sm:text-md text-xs font-medium">
                          : +91 {card.emergency_phone || "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Barcode */}
                    <div className="sm:mt-5 mt-3 flex justify-center">
                      <div>
                        <img
                          src="/assets/barcode.png"
                          alt="Barcode"
                          className="sm:h-6 h-5 sm:w-40 w-30 object-contain"
                        />
                        <p className="text-center text-[8px] sm:text-[10px] text-gray-600">
                          {card.employee_id || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          !error && <p className="text-slate-500">Please select an employee.</p>
        )}

        {/* <div className="flex justify-end">
          <button
            onClick={() => navigate("/idcard")}
            className="mb-6 bg-slate-700 mt-4 rounded-lg text-white px-6 py-2 shadow-md hover:bg-teal-700 transition duration-300 font-medium"
          >
            Back
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default ViewIdCard;
