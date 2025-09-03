import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees } from "../../redux/slices/employeeSlice.js";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";

const IdCard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { employees, loading, error } = useSelector((state) => state.employee);
  const [selectedId, setSelectedId] = useState("");

  // ✅ Fetch employees on mount
  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  // ✅ Log for debugging
  useEffect(() => {
    console.log("Employees data from backend:", employees);
  }, [employees]);

  // ✅ Dropdown handler
  const handleSelectChange = (e) => {
    setSelectedId(e.target.value);
  };

  // ✅ Filter based on dropdown
  const filteredCards = selectedId
    ? employees.filter((emp) => String(emp.id) === selectedId)
    : employees;

  return (
    <div className="w-78/100">
      <div className="flex justify-end">
        <PageMeta title="ID Cards" description="Manage employee ID cards" />
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/admin/dashboard" },
            { label: "ID Cards", link: "/idcard" },
          ]}
        />
      </div>

      <div className="min-h-screen bg-white rounded-2xl p-6">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mt-2">ID Cards</h1>
              <p className="text-slate-600">Manage and generate employee ID cards</p>
            </div>
            <button
              onClick={() => navigate("/idcard/idcard-form")}
              className="bg-slate-700 text-white px-6 py-2.5 rounded-lg shadow-md hover:scale-105 transition-all"
            >
              Generate ID Card
            </button>
          </div>

          {/* Dropdown Filter */}
          <div className="mb-6 w-full max-w-sm">
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Select Employee
            </label>
            <select
              value={selectedId}
              onChange={handleSelectChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600"
            >
              <option value="">-- All Employees --</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.full_name} ({emp.employee_id})
                </option>
              ))}
            </select>
          </div>

          {/* Content */}
          {loading ? (
            <p className="text-center text-slate-500">Loading...</p>
          ) : error ? (
            <div className="text-center text-red-500 py-12">{error}</div>
          ) : filteredCards.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-slate-500">No ID cards found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCards.map((card) => (
                <div
                  key={card.id}
                  className="relative bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 w-full"
                  style={{ height: "400px", maxWidth: "320px" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-600/10 to-blue-500/10 rounded-xl" />
                  <div className="relative z-10 flex flex-col items-center p-6 h-full">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-slate-700 shadow-lg mb-4">
                      <img
                        src={card.photo_url}
                        alt={card.full_name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    <div className="text-center space-y-2 flex-1">
                      <h2 className="text-xl font-semibold text-teal-900">{card.full_name}</h2>
                      <p className="text-sm text-slate-600">
                        <span className="font-medium">Designation:</span> {card.designation_name}
                      </p>
                      <p className="text-sm text-slate-600">
                        <span className="font-medium">ID No:</span> {card.employee_id}
                      </p>
                      <p className="text-sm text-slate-600">
                        <span className="font-medium">Blood Group:</span> {card.blood_group}
                      </p>
                      <p className="text-sm text-slate-600">
                        <span className="font-medium">Mobile:</span> {card.mobile}
                      </p>
                    </div>

                    <button
                      onClick={() => navigate(`/idcard/${card.id}`)}
                      className="mt-4 w-full flex items-center justify-center bg-slate-700 text-white py-2.5 rounded-lg hover:scale-105 transition-all"
                    >
                      <Eye size={18} className="mr-2" />
                      View ID Card
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IdCard;
