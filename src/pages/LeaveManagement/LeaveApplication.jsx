import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  applyLeave,
  fetchMyLeaves,
  fetchRecipientOptions,
  fetchLeaveBalances,
  clearState,
} from "../../redux/slices/leaveSlice";
import { Calendar, List, Send, RefreshCw } from "lucide-react"; // Added Lucide icons
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";
import DatePicker from "../../Components/ui/date/DatePicker"; // Custom DatePicker

const LeaveApplication = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    leaves = [],
    recipients = [],
    leaveBalances = { vacation: 0, sick: 0, casual: 0, maternity: 0 },
    loading,
    error,
    successMessage,
  } = useSelector((state) => state.leaves);
  const { role, token } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    reason: "",
    leave_type: "",
    recipient_id: "",
  });

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (!token || !userToken) {
      console.log("No token found, redirecting to login");
      navigate("/login");
      return;
    }
    try {
      const { token: parsedToken } = JSON.parse(userToken);
      if (parsedToken !== token) {
        console.warn("Token mismatch between Redux and localStorage");
        navigate("/login");
        return;
      }
    } catch (error) {
      console.error("Error parsing userToken:", error);
      navigate("/login");
      return;
    }

    console.log("Fetching leaves, recipient options, and balances");
    dispatch(fetchMyLeaves());
    dispatch(fetchRecipientOptions());
    dispatch(fetchLeaveBalances());

    const interval = setInterval(() => {
      console.log("Polling fetchMyLeaves");
      dispatch(fetchMyLeaves());
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch, navigate, token]);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        console.log("Clearing state due to success or error");
        dispatch(clearState());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting leave request:", formData);
    dispatch(applyLeave(formData)).then((result) => {
      if (result.error) {
        console.error("applyLeave error:", result.error.message);
        if (result.error.message.includes("No authentication token")) {
          navigate("/login");
        }
      } else if (result.meta.requestStatus === "fulfilled") {
        console.log("Leave applied successfully, resetting form");
        setFormData({
          start_date: "",
          end_date: "",
          reason: "",
          leave_type: "",
          recipient_id: "",
        });
        dispatch(fetchMyLeaves());
        dispatch(fetchLeaveBalances());
      }
    });
  };

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen font-sans">
      <style jsx>{`
        select option {
          background-color: #ffffff;
          color: #1e293b; /* slate-700 */
          padding: 8px;
          font-size: 14px;
          font-family: inherit;
        }
        select option:hover,
        select option:focus {
          background-color: #ccfbf1; /* teal-100 for contrast */
          color: #0f766e; /* teal-700 */
        }
      `}</style>
      <div className="flex justify-end">
        <PageMeta
          title="Leave Application"
          description="Apply for a leave and view your leave history"
        />
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "Leave Application", link: "/leave-application" },
          ]}
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar size={24} className="text-teal-700" />
          <div>
            <h1 className="text-3xl font-bold text-slate-700">
              Leave Application
            </h1>
            <p className="text-slate-700 mt-1">Submit your leave request</p>
          </div>
        </div>
      </div>

      <div aria-live="polite">
        {loading && <p className="text-slate-700">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {successMessage && <p className="text-teal-700">{successMessage}</p>}
      </div>

      {role === "super_admin" ? (
        <p className="text-red-500">Super admins cannot apply for leaves.</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white/90 p-6 rounded-2xl border border-teal-700/50 shadow-sm"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <DatePicker
                name="start_date"
                title="Start Date"
                value={formData.start_date}
                onChange={(date) => handleInputChange("start_date", date)}
                icon={<Calendar size={20} className="text-teal-700" />}
              />
            </div>
            <div className="col-span-1">
              <DatePicker
                name="end_date"
                title="End Date"
                value={formData.end_date}
                onChange={(date) => handleInputChange("end_date", date)}
                icon={<Calendar size={20} className="text-teal-700" />}
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Leave Type
              </label>
              <select
                name="leave_type"
                value={formData.leave_type}
                onChange={(e) => handleInputChange("leave_type", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-teal-700 bg-white py-2.5 px-3 text-slate-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-teal-700 transition duration-150 ease-in-out"
                required
              >
                <option value="" disabled>
                  Select Leave Type
                </option>
                <option value="vacation">Vacation ({leaveBalances.vacation} days)</option>
                <option value="sick">Sick ({leaveBalances.sick} days)</option>
                <option value="casual">Casual ({leaveBalances.casual} days)</option>
                <option value="maternity">Maternity ({leaveBalances.maternity} days)</option>
              </select>
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Recipient
              </label>
              <select
                name="recipient_id"
                value={formData.recipient_id}
                onChange={(e) => handleInputChange("recipient_id", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-teal-700 bg-white py-2.5 px-3 text-slate-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-teal-700 transition duration-150 ease-in-out"
                required
              >
                <option value="" disabled>
                  Select Recipient
                </option>
                {recipients.map((recipient) => (
                  <option key={recipient.employee_id} value={recipient.employee_id}>
                    {recipient.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Reason
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={(e) => handleInputChange("reason", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-teal-700 bg-white py-2.5 px-3 text-slate-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-teal-700 transition duration-150 ease-in-out resize-none"
                rows="4"
                placeholder="Enter reason for leave"
                required
              />
            </div>
            <div className="md:col-span-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  console.log("Manual refresh leaves");
                  dispatch(fetchMyLeaves());
                }}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700 transition duration-150 ease-in-out flex items-center gap-2"
              >
                <RefreshCw size={20} />
                <span>Refresh</span>
              </button>
              <button
                type="submit"
                disabled={loading || !formData.recipient_id}
                className="flex items-center gap-2 bg-teal-700 text-white px-6 py-3 rounded-xl hover:bg-slate-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-teal-700 transition duration-150 ease-in-out"
              >
                <Send size={20} />
                <span>{loading ? "Submitting..." : "Submit"}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="mt-8 bg-white/90 p-6 rounded-2xl border border-teal-700/50 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <List size={24} className="text-teal-700" />
          <h2 className="text-xl font-bold text-slate-700">Leave History</h2>
        </div>
        {loading && leaves.length === 0 ? (
          <p className="text-slate-700 text-center">Loading leave history...</p>
        ) : leaves.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-teal-700">
              <thead className="bg-teal-700/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                    End Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                    Days
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                    Recipients
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                    Approved At
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-teal-700">
                {leaves.map((leave) => (
                  <tr key={leave.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      {new Date(leave.start_date).toLocaleDateString() || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      {new Date(leave.end_date).toLocaleDateString() || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      {leave.total_days || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      {leave.leave_type || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {leave.reason || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {leave.recipients?.join(", ") || "Pending"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          leave.status?.toLowerCase() === "approved"
                            ? "bg-teal-700/20 text-teal-700"
                            : leave.status?.toLowerCase() === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {leave.status || "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      {leave.approved_at
                        ? new Date(leave.approved_at).toLocaleString()
                        : "Pending"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-700 text-center">No leave requests found.</p>
        )}
      </div>
    </div>
  );
};

export default LeaveApplication;