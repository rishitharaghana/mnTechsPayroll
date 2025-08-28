import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchTravelExpenses, updateTravelExpenseStatus, clearState } from "../../redux/slices/travelExpensesSlice";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";

const TravelExpenseApproval = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { submissions, loading, error, successMessage } = useSelector((state) => state.travelExpenses);
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  const [showToast, setShowToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    if (isAuthenticated && ['hr', 'super_admin', 'dept_head'].includes(role)) {
      dispatch(fetchTravelExpenses());
    }
  }, [dispatch, isAuthenticated, role]);

  useEffect(() => {
    if (error) {
      setShowToast({ show: true, message: error, type: "error" });
      setTimeout(() => {
        setShowToast({ show: false, message: "", type: "" });
        dispatch(clearState());
      }, 2000);
    }
    if (successMessage) {
      setShowToast({ show: true, message: successMessage, type: "success" });
      setTimeout(() => {
        setShowToast({ show: false, message: "", type: "" });
        dispatch(clearState());
      }, 2000);
    }
  }, [error, successMessage, dispatch]);

  const handleStatusUpdate = (submissionId, status, adminComment) => {
    dispatch(updateTravelExpenseStatus({ id: submissionId, status, admin_comment: adminComment }));
  };

  const viewSubmission = (submission) => {
    navigate(`/admin/expense-approval/${submission.id}`, {
      state: { submission, handleStatusUpdate },
    });
  };

  if (!isAuthenticated || !['hr', 'super_admin', 'dept_head'].includes(role)) {
    return <div>You are not authorized to view this page.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-end">
        <PageMeta title="Expense Approval" />
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "Expense Approval", link: "/admin/expense-approval" },
          ]}
        />
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-slate-700 mb-6">Travel Expense Approvals</h2>

        {loading && <div>Loading submissions...</div>}
        {!loading && submissions.length === 0 && <div>No pending submissions found.</div>}
        {!loading && submissions.length > 0 && (
          <table className="w-full border mt-2 rounded-lg shadow-sm bg-white">
            <thead className="bg-teal-700 text-white">
              <tr>
                <th className="border border-teal-800 p-2 text-sm font-medium">Submission ID</th>
                <th className="border border-teal-800 p-2 text-sm font-medium">Employee ID</th>
                <th className="border border-teal-800 p-2 text-sm font-medium">Employee Name</th>
                <th className="border border-teal-800 p-2 text-sm font-medium">Department</th>
                <th className="border border-teal-800 p-2 text-sm font-medium">Submission Date</th>
                <th className="border border-teal-800 p-2 text-sm font-medium">Total Amount</th>
                <th className="border border-teal-800 p-2 text-sm font-medium">Status</th>
                <th className="border border-teal-800 p-2 text-sm font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-teal-50 transition">
                  <td className="border border-teal-200 p-2 text-sm">{sub.id}</td>
                  <td className="border border-teal-200 p-2 text-sm">{sub.employee_id}</td>
                  <td className="border border-teal-200 p-2 text-sm">{sub.employee_name}</td>
                  <td className="border border-teal-200 p-2 text-sm">{sub.department_name}</td>
                  <td className="border border-teal-200 p-2 text-sm">
                    {new Date(sub.created_at).toLocaleDateString()}
                  </td>
                  <td className="border border-teal-200 p-2 text-sm">₹{parseFloat(sub.total_amount).toFixed(2)}</td>
                  <td className="border border-teal-200 p-2 text-sm">
                    <span
                      className={`px-2 py-1 rounded ${
                        sub.status === "Pending"
                          ? "bg-yellow-200 text-yellow-800"
                          : sub.status === "Approved"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {sub.status}
                    </span>
                  </td>
                  <td className="border border-teal-200 p-2 text-center">
                    <button
                      onClick={() => viewSubmission(sub)}
                      className="text-teal-600 hover:text-teal-800 transition text-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {showToast.show && (
          <div
            className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300 ${
              showToast.type === "success" ? "bg-teal-700 text-white" : "bg-red-700 text-white"
            }`}
          >
            {showToast.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelExpenseApproval;