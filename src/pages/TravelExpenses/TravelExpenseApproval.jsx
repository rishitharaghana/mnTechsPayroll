import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Download } from "lucide-react";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";

const TravelExpenseApproval = () => {
  const [submissions, setSubmissions] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubmissions = async () => {
      const mockSubmissions = [
        {
          id: "1",
          employeeId: "EMP123",
          submissionDate: "2025-08-25T10:00:00Z",
          status: "pending",
          totalAmount: 1500.75,
          expenses: [
            {
              date: "2025-08-20",
              category: "Transportation",
              purpose: "Flight to conference",
              amount: "1000.00",
              receipt: { name: "flight_receipt.pdf" },
            },
            {
              date: "2025-08-21",
              category: "Meals",
              purpose: "Client dinner",
              amount: "500.75",
              receipt: { name: "dinner_receipt.jpg" },
            },
          ],
          travelDate: "2025-08-20",
          destination: "New York",
          purpose: "Annual Tech Conference",
          department: "Engineering",
          comments: [],
        },
      ];
      setSubmissions(mockSubmissions);
    };
    fetchSubmissions();
  }, []);

  const handleStatusUpdate = (submissionId, status, adminComment) => {
    const updatedSubmissions = submissions.map((sub) =>
      sub.id === submissionId
        ? { ...sub, status, comments: [...sub.comments, adminComment] }
        : sub
    );
    setSubmissions(updatedSubmissions);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const viewSubmission = (submission) => {
    navigate(`/admin/expense-approval/${submission.id}`, {
      state: { submission, handleStatusUpdate },
    });
  };

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
        <h2 className="text-2xl font-semibold text-slate-700 mb-6">
          Travel Expense Approvals
        </h2>

        <table className="w-full border mt-2 rounded-lg shadow-sm bg-white">
          <thead className="bg-teal-700 text-white">
            <tr>
              <th className="border border-teal-800 p-2 text-sm font-medium">Submission ID</th>
              <th className="border border-teal-800 p-2 text-sm font-medium">Employee ID</th>
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
                <td className="border border-teal-200 p-2 text-sm">{sub.employeeId}</td>
                <td className="border border-teal-200 p-2 text-sm">
                  {new Date(sub.submissionDate).toLocaleDateString()}
                </td>
                <td className="border border-teal-200 p-2 text-sm">₹{sub.totalAmount.toFixed(2)}</td>
                <td className="border border-teal-200 p-2 text-sm">
                  <span
                    className={`px-2 py-1 rounded ${
                      sub.status === "pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : sub.status === "approved"
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

        {showToast && (
          <div className="fixed bottom-4 right-4 bg-teal-700 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300">
            ✅ Submission status updated.
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelExpenseApproval;