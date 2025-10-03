import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  applyLeave,
  fetchMyLeaves,
  fetchRecipientOptions,
  fetchLeaveBalances,
  allocateMonthlyLeaves,
  clearState,
} from "../../redux/slices/leaveSlice";
import { Calendar, List, Send, RefreshCw, ChevronDown } from "lucide-react";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";
import DatePicker from "../../Components/ui/date/DatePicker";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LeaveApplication = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    leaves = [],
    recipients = [],
    leaveBalances = { paid: 0 },
    loading,
    error,
    successMessage,
  } = useSelector((state) => state.leaves);
  const { role, token, employee_id } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    reason: "",
    leave_status: "Paid",
    leave_category: "casual",
    recipient_id: "",
  });
  const [isLeaveStatusOpen, setIsLeaveStatusOpen] = useState(false);
  const [isLeaveCategoryOpen, setIsLeaveCategoryOpen] = useState(false);
  const [isRecipientOpen, setIsRecipientOpen] = useState(false);

  const leaveCategories = [
    { value: "casual", label: "Casual Leave" },
    { value: "sick", label: "Sick Leave" },
    { value: "vacation", label: "Vacation Leave" },
    { value: "emergency", label: "Emergency Leave" },
    { value: "maternity", label: "Maternity Leave" },
    { value: "paternity", label: "Paternity Leave" },
    { value: "unpaid", label: "Unpaid Leave" }, // Added to match leave_type
  ];

  // Map full_name to employee_id for super_admin recipients when role is hr
  const recipientIdMap = {
    "Super Admin": "MO-EMP-000",
  };

  // Convert date to IST and return YYYY-MM-DD format
  const convertToIST = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const istOffset = 5.5 * 60; // +5:30 hours
    const istDate = new Date(date.getTime() + istOffset * 60000);
    const yyyy = istDate.getFullYear();
    const mm = String(istDate.getMonth() + 1).padStart(2, "0");
    const dd = String(istDate.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    if (!token || !localStorage.getItem("userToken")) {
      navigate("/login");
      return;
    }
    try {
      const { token: parsedToken } = JSON.parse(
        localStorage.getItem("userToken")
      );
      if (parsedToken !== token) {
        navigate("/login");
        return;
      }
    } catch (error) {
      navigate("/login");
        return;
    }

    dispatch(fetchMyLeaves());
    dispatch(fetchRecipientOptions());
    dispatch(fetchLeaveBalances());
    const interval = setInterval(() => {
      dispatch(fetchMyLeaves());
      dispatch(fetchLeaveBalances());
    }, 60000);
    return () => clearInterval(interval);
  }, [dispatch, navigate, token]);

  useEffect(() => {
    console.log("Updated recipients:", recipients);
    console.log("Selected recipient_id:", formData.recipient_id);
    if (recipients.length > 0 && !formData.recipient_id) {
      setFormData((prev) => ({
        ...prev,
        recipient_id: recipients[0].value,
      }));
    }
  }, [recipients, formData.recipient_id]);

  useEffect(() => {
    if (error) toast.error(error);
    if (successMessage) toast.success(successMessage);
    if (successMessage || error) {
      const timer = setTimeout(() => dispatch(clearState()), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.leave_status === "Paid" && leaveBalances.paid <= 0) {
      toast.error("No paid leave balance available");
      return;
    }
    if (new Date(formData.end_date) < new Date(formData.start_date)) {
      toast.error("End date cannot be before start date");
      return;
    }
    if (!formData.recipient_id) {
      toast.error("Please select a recipient");
      return;
    }
    if (!recipients.find((r) => r.value === formData.recipient_id)) {
      toast.error("Invalid recipient selected");
      return;
    }

    const mappedRecipientId =
      role === "hr" && recipientIdMap[formData.recipient_id]
        ? recipientIdMap[formData.recipient_id]
        : formData.recipient_id;

    const payload = {
      ...formData,
      employee_id,
      start_date: convertToIST(formData.start_date),
      end_date: convertToIST(formData.end_date),
      recipient_id: mappedRecipientId,
    };

    console.log("Submitting leave with payload:", payload);

    dispatch(applyLeave(payload)).then((result) => {
      if (result.error) {
        toast.error(result.error.message);
        if (result.error.message.includes("No authentication token")) {
          navigate("/login");
        }
      } else if (result.meta.requestStatus === "fulfilled") {
        setFormData({
          start_date: "",
          end_date: "",
          reason: "",
          leave_status: "Paid",
          leave_category: "casual",
          recipient_id: recipients.length > 0 ? recipients[0].value : "",
        });
        dispatch(fetchMyLeaves());
        dispatch(fetchLeaveBalances());
      }
    });
  };

  // Map recipient_id to label for display
  const getRecipientLabel = (leave) => {
    if (Array.isArray(leave.recipients) && leave.recipients.length > 0) {
      return leave.recipients
        .map((r) => (typeof r === "string" ? r : r.full_name || r.name || "Unknown"))
        .join(", ");
    } else if (typeof leave.recipients === "string") {
      return leave.recipients.split(",").join(", ");
    } else if (leave.recipient_id || leave.approved_by) {
      const idToCheck = leave.recipient_id || leave.approved_by;
      const mappedId = role === "hr" && recipientIdMap[idToCheck]
        ? recipientIdMap[idToCheck]
        : idToCheck;
      const recipient = recipients.find((r) => r.value === idToCheck) ||
                        recipients.find((r) => r.value === mappedId);
      return recipient ? recipient.label : "Pending";
    }
    return "Pending";
  };

  return (
    <div className="w-full mt-4 sm:mt-0">
      <style>{`
        .custom-select-container {
          position: relative;
          width: 100%;
        }
        .custom-select {
          width: 100%;
          padding: 10px;
          border: 1px solid #0f766e;
          border-radius: 8px;
          background: white;
          color: #1e293b;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .custom-select:hover {
          border-color: #0d9488;
        }
        .custom-select-options {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #0f766e;
          border-radius: 8px;
          margin-top: 4px;
          max-height: 200px;
          overflow-y: auto;
          z-index: 10;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .leave-status-option {
          padding: 8px 12px;
          font-size: 14px;
          color: #1e293b;
          cursor: pointer;
        }
        .leave-status-option:hover {
          background: #ccfbf1;
          color: #0f766e;
        }
        .leave-status-option:disabled {
          color: #a0aec0;
          background: #f7fafc;
          cursor: not-allowed;
        }
        .leave-category-option {
          padding: 8px 12px;
          font-size: 14px;
          color: #1e293b;
          cursor: pointer;
        }
        .leave-category-option:hover {
          background: #e0f2fe;
          color: #0369a1;
        }
        .recipient-option {
          padding: 8px 12px;
          font-size: 14px;
          color: #1e293b;
          cursor: pointer;
        }
        .recipient-option:hover {
          background: #fef3c7;
          color: #b45309;
        }
        textarea {
          min-height: 45px;
          max-height: 500px;
          resize: vertical;
          overflow-y: auto;
        }
        table {
          border-collapse: collapse;
          width: 100%;
        }
        th, td {
          border: 1px solid #0f766e;
          padding: 8px 12px;
        }
        @media (max-width: 640px) {
          .table-container {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          th, td {
            padding: 6px 8px;
            font-size: 12px;
            min-width: 100px;
          }
        }
      `}</style>

      <div className="hidden sm:flex sm:justify-end sm:items-center">
        <PageMeta
          title="Leave Application"
          description="Apply for a leave and view your leave history"
        />
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/emp-dashboard" },
            { label: "Leave Application", link: "/employee/leave-application" },
          ]}
        />
      </div>

      <div className="p-4 sm:p-6 space-y-6 bg-white rounded-2xl min-h-screen font-sans">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar size={24} className="text-teal-700" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-700">
                Leave Application
              </h1>
              <p className="text-slate-700 mt-1 text-sm sm:text-base">
                Submit your leave request
              </p>
            </div>
          </div>
        </div>

        <div aria-live="polite">
          {loading && <p className="text-slate-700">Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {successMessage && <p className="text-teal-700">{successMessage}</p>}
        </div>

        <div className="text-slate-700 mb-4 text-sm sm:text-base">
          <p>Available Paid Leave: {leaveBalances.paid} days</p>
        </div>

        {role === "super_admin" ? (
          <p className="text-red-500 text-sm sm:text-base">
            Super admins cannot apply for leaves.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-md"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <DatePicker
                  name="start_date"
                  title="Start Date"
                  value={formData.start_date}
                  onChange={(date) => handleInputChange("start_date", date)}
                  icon={<Calendar size={20} className="text-teal-700" />}
                />
              </div>
              <div>
                <DatePicker
                  name="end_date"
                  title="End Date"
                  value={formData.end_date}
                  onChange={(date) => handleInputChange("end_date", date)}
                  icon={<Calendar size={20} className="text-teal-700" />}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Leave Status
                </label>
                <div className="custom-select-container">
                  <div
                    className="custom-select"
                    onClick={() => setIsLeaveStatusOpen(!isLeaveStatusOpen)}
                  >
                    <span>
                      {formData.leave_status || "Select Leave Status"}
                    </span>
                    <span>
                      <ChevronDown size={16} className="text-slate-400" />
                    </span>
                  </div>
                  {isLeaveStatusOpen && (
                    <div className="custom-select-options">
                      <div
                        className="leave-status-option"
                        onClick={() => {
                          if (leaveBalances.paid > 0) {
                            handleInputChange("leave_status", "Paid");
                            setIsLeaveStatusOpen(false);
                          }
                        }}
                        style={{
                          cursor:
                            leaveBalances.paid <= 0 ? "not-allowed" : "pointer",
                        }}
                      >
                        Paid ({leaveBalances.paid} days)
                      </div>
                      <div
                        className="leave-status-option"
                        onClick={() => {
                          handleInputChange("leave_status", "unpaid");
                          setIsLeaveStatusOpen(false);
                        }}
                      >
                        Unpaid
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Leave Category
                </label>
                <div className="custom-select-container">
                  <div
                    className="custom-select"
                    onClick={() => setIsLeaveCategoryOpen(!isLeaveCategoryOpen)}
                  >
                    <span>
                      {leaveCategories.find(
                        (cat) => cat.value === formData.leave_category
                      )?.label || "Select Leave Category"}
                    </span>
                    <span>
                      <ChevronDown size={16} className="text-slate-400" />
                    </span>
                  </div>
                  {isLeaveCategoryOpen && (
                    <div className="custom-select-options">
                      {leaveCategories.map((category) => (
                        <div
                          key={category.value}
                          className="leave-category-option"
                          onClick={() => {
                            handleInputChange("leave_category", category.value);
                            setIsLeaveCategoryOpen(false);
                          }}
                        >
                          {category.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Recipient
                </label>
                <div className="custom-select-container">
                  <div
                    className="custom-select"
                    onClick={() => setIsRecipientOpen(!isRecipientOpen)}
                  >
                    <span>
                      {recipients.find((r) => r.value === formData.recipient_id)
                        ?.label || "Select Recipient"}
                    </span>
                    <span>
                      <ChevronDown size={16} className="text-slate-400" />
                    </span>
                  </div>
                  {isRecipientOpen && (
                    <div className="custom-select-options">
                      {recipients.length > 0 ? (
                        recipients.map((recipient) => (
                          <div
                            key={recipient.value}
                            className="recipient-option"
                            onClick={() => {
                              handleInputChange(
                                "recipient_id",
                                recipient.value
                              );
                              setIsRecipientOpen(false);
                            }}
                          >
                            {recipient.label}
                          </div>
                        ))
                      ) : (
                        <div
                          className="recipient-option"
                          style={{ cursor: "not-allowed" }}
                        >
                          No recipients available
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Reason
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={(e) => handleInputChange("reason", e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-teal-700 bg-white py-2.5 px-3 text-slate-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-teal-700 transition duration-150 ease-in-out"
                  placeholder="Enter reason for leave"
                  required
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-3 flex flex-col sm:flex-row justify-end gap-2">
                {["super_admin", "hr"].includes(role) && (
                  <button
                    type="button"
                    onClick={() =>
                      dispatch(allocateMonthlyLeaves()).then(() =>
                        dispatch(fetchLeaveBalances())
                      )
                    }
                    className="px-3 py-2 bg-teal-700 text-white rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-700 transition duration-150 ease-in-out flex items-center gap-2 w-full sm:w-auto"
                  >
                    <RefreshCw size={16} />
                    <span>Allocate Leaves</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => dispatch(fetchMyLeaves())}
                  className="px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700 transition duration-150 ease-in-out flex items-center gap-2 w-full sm:w-auto"
                >
                  <RefreshCw size={16} />
                  <span>Refresh</span>
                </button>
                <button
                  type="submit"
                  disabled={
                    loading ||
                    !formData.recipient_id ||
                    !formData.leave_category ||
                    (formData.leave_status === "Paid" &&
                      leaveBalances.paid <= 0)
                  }
                  className="flex items-center gap-2 bg-teal-700 text-white px-3 py-2 rounded-lg hover:bg-slate-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-teal-700 transition duration-150 ease-in-out w-full sm:w-auto"
                >
                  <Send size={16} />
                  <span>{loading ? "Submitting..." : "Submit"}</span>
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="mt-7 bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <List size={24} className="text-teal-700" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-700">
              Leave History
            </h2>
          </div>
          {loading && leaves.length === 0 ? (
            <p className="text-slate-700 text-center text-sm sm:text-base">
              Loading leave history...
            </p>
          ) : leaves.length > 0 ? (
            <div className="table-container overflow-x-auto">
              <table className="min-w-full divide-y divide-teal-700">
                <thead className="bg-teal-700/10">
                  <tr>
                    <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase whitespace-nowrap">
                      Start Date
                    </th>
                    <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase whitespace-nowrap">
                      End Date
                    </th>
                    <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase whitespace-nowrap">
                      Days
                    </th>
                    <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase whitespace-nowrap">
                      Category
                    </th>
                    <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase whitespace-nowrap">
                      Reason
                    </th>
                    <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase whitespace-nowrap">
                      Recipients
                    </th>
                    <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase whitespace-nowrap">
                      Approval
                    </th>
                    <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase whitespace-nowrap">
                      Approved At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-teal-700">
                  {leaves.map((leave) => (
                    <tr key={leave.id}>
                      <td className="px-2 sm:px-6 py-4 text-sm text-slate-700 whitespace-nowrap">
                        {new Date(leave.start_date).toLocaleDateString() || "N/A"}
                      </td>
                      <td className="px-2 sm:px-6 py-4 text-sm text-slate-700 whitespace-nowrap">
                        {new Date(leave.end_date).toLocaleDateString() || "N/A"}
                      </td>
                      <td className="px-2 sm:px-6 py-4 text-sm text-slate-700 whitespace-nowrap">
                        {leave.total_days || "N/A"}
                      </td>
                      <td className="px-2 sm:px-6 py-4 text-sm text-slate-700 whitespace-nowrap">
                        {leaveCategories.find((cat) => cat.value === leave.leave_type)?.label || 
                         (leave.leave_type ? leave.leave_type.charAt(0).toUpperCase() + leave.leave_type.slice(1) : "N/A")}
                      </td>
                      <td className="px-2 sm:px-6 py-4 text-sm text-slate-700 whitespace-nowrap">
                        {leave.status ? leave.status.charAt(0).toUpperCase() + leave.status.slice(1) : "N/A"}
                      </td>
                      <td className="px-2 sm:px-6 py-4 text-sm text-slate-700 truncate max-w-[120px] sm:max-w-[200px]">
                        {leave.reason || "N/A"}
                      </td>
                      <td className="px-2 sm:px-6 py-4 text-sm text-slate-700 truncate max-w-[120px] sm:max-w-[200px]">
                        {getRecipientLabel(leave)}
                      </td>
                      <td className="px-2 sm:px-6 py-4 text-sm whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            leave.status?.toLowerCase() === "approved"
                              ? "bg-teal-700/20 text-teal-700"
                              : leave.status?.toLowerCase() === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {leave.status ? leave.status.charAt(0).toUpperCase() + leave.status.slice(1) : "Unknown"}
                        </span>
                      </td>
                      <td className="px-2 sm:px-6 py-4 text-sm text-slate-700 whitespace-nowrap">
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
            <p className="text-slate-700 text-center text-sm sm:text-base">
              No leave requests found.
            </p>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LeaveApplication;