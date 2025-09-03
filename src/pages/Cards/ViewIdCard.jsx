import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchEmployees } from "../../redux/slices/employeeSlice.js";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb.jsx";
import PageMeta from "../../Components/common/PageMeta.jsx";
import Select from "react-select";

const ViewIdCard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { employees, loading, error } = useSelector((state) => state.employee);

  const [card, setCard] = useState(null);
  const [selectedId, setSelectedId] = useState("");

  // Get role & employee_id from localStorage
  const stored = localStorage.getItem("userToken");
  const authData = stored ? JSON.parse(stored) : null;
  const role = authData?.role;
  const loggedInEmployeeId = authData?.employee_id;

  // Fetch employees
  useEffect(() => {
    dispatch(fetchEmployees()).then((res) => {
      if (role === "employee") {
        const data = res.payload || [];
        const self = data.find(
          (emp) => String(emp.employee_id) === String(loggedInEmployeeId)
        );
        if (self) {
          setCard(self);
          setSelectedId(String(self.id)); // Sync selectedId for consistency
        }
      }
    });
  }, [dispatch, role, loggedInEmployeeId]);

  // Handle dropdown change
  const handleSelectChange = (selectedOption) => {
    const empId = selectedOption ? String(selectedOption.value) : "";
    setSelectedId(empId);
    const selectedEmployee = employees.find((emp) => String(emp.id) === empId);
    setCard(selectedEmployee || null);
  };

  // Memoize employee options for performance
  const employeeOptions = useMemo(
    () =>
      employees.map((emp) => ({
        value: String(emp.id), // Ensure value is a string for consistency
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
    <div className="w-78/100">
      <div className="flex justify-end">
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "ID Card", link: "/view-id-card" },
          ]}
        />
        <PageMeta title="View ID Card" description="View ID Card" />
      </div>
      <div className="p-8 bg-white shadow-md rounded-2xl min-h-screen">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-10 tracking-tight">
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
                value={employeeOptions.find(
                  (option) => option.value === selectedId
                ) || null}
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
                    zIndex:"9999",
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
                isSearchable // Enables search functionality
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
          <div className="flex flex-col items-center">
            <div
              id="id-card"
              className="w-96 h-[600px] rounded-sm shadow-2xl overflow-hidden relative border border-gray-200 bg-cover bg-center"
              style={{ backgroundImage: "url(/assets/IDCardTemplate.png)" }}
            >
              {/* Employee Photo with Initials Fallback */}
              <div className="absolute top-[130px] left-1/2 transform -translate-x-1/2 z-30">
                <div className="w-36 h-36 rounded-full overflow-hidden relative flex items-center justify-center">
                  {card.photo_url ? (
                    <img
                      src={card.photo_url}
                      alt={`${card.full_name || "Employee"}'s profile`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none"; // Hide image on error
                        e.target.nextSibling.style.display = "flex"; // Show initials
                      }}
                    />
                  ) : null}
                  <div
                    className="absolute inset-0 flex items-center justify-center text-slate-700 text-5xl font-bold tracking-wider"
                    style={{ display: card.photo_url ? "none" : "flex" }}
                  >
                    {getInitials(card.full_name)}
                  </div>
                </div>
              </div>

              {/* Employee Details */}
              <div className="absolute top-74 left-0 right-0 z-20 px-8">
                <div className="text-center mb-7">
                  <h2 className="text-xl font-bold text-blue-900 mb-1 tracking-wider">
                    {card.full_name || "Unknown"}
                  </h2>
                  <p className="text-gray-600 text-sm font-medium">
                    {card.designation_name || "N/A"}
                  </p>
                </div>

                <div className="space-y-4 text-left">
                  <div className="flex justify-between items-center">
                    <span className="w-1/2 text-gray-700 font-medium text-sm">
                      ID No
                    </span>
                    <span className="w-1/2 text-blue-900 font-medium text-sm">
                      : {card.employee_id || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="w-1/2 text-gray-700 font-medium text-sm">
                      Blood Group
                    </span>
                    <span className="w-1/2 text-blue-900 font-medium text-sm">
                      : {card.blood_group || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="w-1/2 text-gray-700 font-medium text-sm">
                      Emergency Contact
                    </span>
                    <span className="w-1/2 text-blue-900 font-medium text-sm">
                      : {card.emergency_phone || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Barcode */}
                <div className="mt-5 flex justify-center">
                  <div className="bg-white p-2 rounded">
                    <img
                      src="/assets/barcode.png"
                      alt="Barcode"
                      className="h-6 w-40 object-contain"
                    />
                    <p className="text-center text-[8px] text-gray-600">
                      {card.employee_id || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          !error && <p className="text-slate-500"></p>
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