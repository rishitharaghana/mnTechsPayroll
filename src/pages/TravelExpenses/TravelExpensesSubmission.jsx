import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Download } from "lucide-react";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";

const TravelExpenseSubmission = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { submission, handleStatusUpdate } = location.state || {};
  const [adminComment, setAdminComment] = useState("");

  if (!submission || !handleStatusUpdate) {
    return <div className="p-6 text-center">No submission data found.</div>;
  }

  const onStatusUpdate = (status) => {
    handleStatusUpdate(submission.id, status, adminComment);
    navigate("/admin/expense-approval");
  };

  const handleDownload = (fileUrl) => {
    window.open(`http://localhost:3007/${fileUrl}`, "_blank");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-end">
        <PageMeta title={`Submission ${submission.id}`} />
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "Expense Approval", link: "/admin/expense-approval" },
            { label: `Submission ${submission.id}`, link: "#" },
          ]}
        />
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-slate-700 mb-4">
          Submission Details - {submission.id}
        </h3>
        <div className="space-y-4">
          <div>
            <p><strong>Employee ID:</strong> {submission.employeeId}</p>
            <p><strong>Travel Date:</strong> {submission.travelDate}</p>
            <p><strong>Destination:</strong> {submission.destination}</p>
            <p><strong>Purpose:</strong> {submission.purpose}</p>
            <p><strong>Total Amount:</strong> ₹{submission.totalAmount.toFixed(2)}</p>
          </div>
          <table className="w-full border rounded-lg shadow-sm bg-white">
            <thead className="bg-teal-700 text-white">
              <tr>
                <th className="border border-teal-800 p-2 text-sm font-medium">Date</th>
                <th className="border border-teal-800 p-2 text-sm font-medium">Category</th>
                <th className="border border-teal-800 p-2 text-sm font-medium">Purpose</th>
                <th className="border border-teal-800 p-2 text-sm font-medium">Amount</th>
                <th className="border border-teal-800 p-2 text-sm font-medium">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {submission.expenses.map((exp, index) => (
                <tr key={index} className="hover:bg-teal-50 transition">
                  <td className="border border-teal-200 p-2 text-sm">{exp.date}</td>
                  <td className="border border-teal-200 p-2 text-sm">{exp.category}</td>
                  <td className="border border-teal-200 p-2 text-sm">{exp.purpose}</td>
                  <td className="border border-teal-200 p-2 text-sm">₹{parseFloat(exp.amount).toFixed(2)}</td>
                  <td className="border border-teal-200 p-2 text-sm">
                    {exp.receipt ? (
                      <button
                        onClick={() => handleDownload(exp.receipt.file_url)}
                        className="text-teal-600 hover:text-teal-800 transition flex items-center gap-1"
                      >
                        <Download size={16} /> {exp.receipt.file_name}
                      </button>
                    ) : (
                      "N/A"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <label className="text-md font-semibold text-slate-700 mb-1 block">
              Admin Comments
            </label>
            <textarea
              className="w-full border border-slate-300 shadow-sm p-2 rounded text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-700 transition"
              placeholder="Enter comments for approval/rejection"
              value={adminComment}
              onChange={(e) => setAdminComment(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => onStatusUpdate("approved")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg text-sm shadow-md hover:from-green-700 hover:to-green-900 transition"
              disabled={submission.status !== "pending"}
            >
              <CheckCircle size={16} /> Approve
            </button>
            <button
              onClick={() => onStatusUpdate("rejected")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg text-sm shadow-md hover:from-red-700 hover:to-red-900 transition"
              disabled={submission.status !== "pending"}
            >
              <XCircle size={16} /> Reject
            </button>
            <button
              onClick={() => navigate("/admin/expense-approval")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-lg text-sm shadow-md hover:from-gray-700 hover:to-gray-900 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelExpenseSubmission;