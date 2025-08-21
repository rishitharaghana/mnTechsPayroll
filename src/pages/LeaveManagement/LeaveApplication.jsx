import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { applyLeave, fetchMyLeaves, fetchRecipientOptions, clearState } from "../../redux/slices/leaveSlice";
import { FileText, Calendar } from "lucide-react";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";

const LeaveApplication = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { leaves = [], recipients = [], loading, error, successMessage } = useSelector((state) => state.leaves);
  const { role, token } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    reason: "",
    leave_type: "",
    recipient_id: "",
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      dispatch(fetchMyLeaves());
      dispatch(fetchRecipientOptions());
      const interval = setInterval(() => dispatch(fetchMyLeaves()), 30000); // Poll every 30s
      return () => clearInterval(interval);
    }
  }, [dispatch, navigate, token]);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => dispatch(clearState()), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(applyLeave(formData)).then((result) => {
      if (result.error && result.error.message.includes("No authentication token")) {
        navigate("/login");
      }
    });
    setFormData({ start_date: "", end_date: "", reason: "", leave_type: "", recipient_id: "" });
  };

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen font-sans">
      <div className="flex justify-end">
        <PageMeta title="Leave Application" description="Apply for a leave and view your leave history" />
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "Leave Application", link: "/leave-application" },
          ]}
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-slate-700 bg-clip-text text-transparent">
            Leave Application
          </h1>
          <p className="text-gray-600 mt-1">Submit your leave request</p>
        </div>
      </div>

      <div aria-live="polite">
        {loading && <p className="text-gray-600">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {successMessage && <p className="text-green-600">{successMessage}</p>}
      </div>

      {role === "super_admin" ? (
        <p className="text-red-500">Super admins cannot apply for leaves.</p>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white/90 p-6 rounded-2xl border border-teal-200/50 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-teal-200 focus:ring-teal-600"
                required
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-teal-200 focus:ring-teal-600"
                required
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">Leave Type</label>
              <select
                name="leave_type"
                value={formData.leave_type}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-teal-200 focus:ring-teal-600"
                required
              >
                <option value="">Select Leave Type</option>
                <option value="vacation">Vacation</option>
                <option value="sick">Sick</option>
                <option value="casual">Casual</option>
                <option value="maternity">Maternity</option>
              </select>
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Reason</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-teal-200 focus:ring-teal-600"
                rows="4"
                required
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">Recipient</label>
              <select
                name="recipient_id"
                value={formData.recipient_id}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-teal-200 focus:ring-teal-600"
                required
              >
                <option value="">Select Recipient</option>
                {recipients.map((recipient) => (
                  <option key={recipient.employee_id} value={recipient.employee_id}>
                    {recipient.name} ({recipient.employee_id})
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => dispatch(fetchMyLeaves())}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Refresh Leaves
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 bg-gradient-to-r from-teal-600 to-slate-700 text-white px-6 py-3 rounded-xl hover:from-teal-700 hover:to-slate-800 disabled:opacity-50"
              >
                <FileText size={20} />
                <span>{loading ? "Submitting..." : "Submit Leave Request"}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="mt-8 bg-white/90 p-6 rounded-2xl border border-teal-200/50 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Leave History</h2>
        {leaves.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-teal-200">
              <thead className="bg-teal-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipients</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-teal-200">
                {leaves.map((leave) => (
                  <tr key={leave.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(leave.start_date).toLocaleDateString() || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(leave.end_date).toLocaleDateString() || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.days || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.leave_type || "N/A"}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{leave.reason || "N/A"}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{leave.recipients?.join(", ") || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          leave.status?.toLowerCase() === "approved"
                            ? "bg-green-100 text-green-700"
                            : leave.status?.toLowerCase() === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {leave.status || "Unknown"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 text-center">No leave requests found.</p>
        )}
      </div>
    </div>
  );
};

export default LeaveApplication;