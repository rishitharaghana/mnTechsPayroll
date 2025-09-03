import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchEmployees } from "../../redux/slices/employeeSlice.js";

const ViewIdCard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { employees, loading, error } = useSelector((state) => state.employee);

  const [card, setCard] = useState(null);
  const [selectedId, setSelectedId] = useState("");

  // ✅ Get role & employee_id from localStorage
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
        if (self) setCard(self);
      }
    });
  }, [dispatch, role, loggedInEmployeeId]);

  // Handle dropdown change
  const handleSelectChange = (e) => {
    const empId = e.target.value;
    setSelectedId(empId);
    const selectedEmployee = employees.find((emp) => String(emp.id) === empId);
    setCard(selectedEmployee || null);
  };

  if (loading) {
    return <p className="p-6 text-slate-500">Loading...</p>;
  }

  return (
    <div className="p-6 pt-10 w-full bg-white shadow-xl rounded-xl min-h-screen">
      <h2 className="text-2xl font-bold text-slate-700 mb-5">
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
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Choose Employee
          </label>
          {employees.length > 0 ? (
            <select
              value={selectedId}
              onChange={handleSelectChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-600"
            >
              <option value="">-- Select Employee --</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.full_name} ({emp.employee_id})
                </option>
              ))}
            </select>
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
            {/* Employee Photo */}
            <div className="absolute top-32 left-1/2 transform -translate-x-1/2 z-30">
              <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-slate-700 shadow-lg">
                <img
                  src={card.photo_url || "/assets/default-avatar.png"}
                  alt="Employee"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/assets/default-avatar.png";
                  }}
                />
              </div>
            </div>

            {/* Employee Details */}
            <div className="absolute top-72 left-0 right-0 z-20 px-8">
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-blue-900 mb-1 tracking-wider">
                  {card.full_name}
                </h2>
                <p className="text-gray-600 text-sm font-medium">
                  {card.designation_name}
                </p>
                <p className="text-gray-500 text-xs">{card.department_name}</p>
              </div>

              <div className="space-y-4 text-left">
                <div className="flex justify-between items-center">
                  <span className="w-1/2 text-gray-700 font-medium text-sm">
                    ID No
                  </span>
                  <span className="w-1/2 text-blue-900 font-bold text-sm">
                    : {card.employee_id}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="w-1/2 text-gray-700 font-medium text-sm">
                    Blood Group
                  </span>
                  <span className="w-1/2 text-blue-900 font-bold text-sm">
                    : {card.blood_group}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="w-1/2 text-gray-700 font-medium text-sm">
                    Emergency Contact
                  </span>
                  <span className="w-1/2 text-blue-900 font-bold text-sm">
                    : {card.emergency_phone}
                  </span>
                </div>
              </div>

              {/* Barcode */}
              <div className="mt-7 flex justify-center">
                <div className="bg-white p-2 rounded">
                  <img
                    src="/assets/barcode.png"
                    alt="Barcode"
                    className="h-6 w-40 object-contain"
                  />
                  <p className="text-center text-[8px] text-gray-600">
                    {card.employee_id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        !error && <p className="text-slate-500">Please select an employee.</p>
      )}

      {/* Back Button */}
      <div className="flex justify-end">
        <button
          onClick={() => navigate("/idcard")}
          className="mb-6 bg-slate-700 mt-4 rounded-lg text-white px-6 py-2 shadow-md hover:bg-teal-700 transition duration-300 font-medium"
        >
          ← Back to List
        </button>
      </div>
    </div>
  );
};

export default ViewIdCard;
