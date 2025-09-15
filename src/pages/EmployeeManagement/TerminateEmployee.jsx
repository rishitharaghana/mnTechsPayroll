import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchEmployees, deleteEmployee } from "../../redux/slices/employeeSlice";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TerminateEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { employees, loading, error, successMessage } = useSelector((state) => state.employee);
  const { user } = useSelector((state) => state.auth);
  const [exitType, setExitType] = useState("");
  const [reason, setReason] = useState("");
  const [noticeStartDate, setNoticeStartDate] = useState("");
  const [lastWorkingDate, setLastWorkingDate] = useState("");
  const [checklist, setChecklist] = useState({
    handoverComplete: false,
    assetsReturned: false,
    finalPayrollProcessed: false,
  });

  const employee = employees?.find((emp) => emp.id === parseInt(id));

  useEffect(() => {
    if (!employee) {
      dispatch(fetchEmployees());
    }
  }, [dispatch, employee]);

  // Debug logs
  console.log('Employee:', employee);
  console.log('User:', user);
  console.log('canTerminate:', user ? ["super_admin", "hr"].includes(user.role) : false);

  const canTerminate = user ? ["super_admin", "hr"].includes(user.role) : false;

  const handleTerminate = () => {
    if (!employee || !exitType) {
      console.log('Termination failed: Missing employee or exit type');
      return;
    }
    console.log('Terminating employee:', {
      id: employee.id,
      role: employee.role,
      exitType,
      reason,
      noticeStartDate,
      lastWorkingDate,
      checklist,
    });
    dispatch(
      deleteEmployee({
        id: employee.id,
        role: employee.role,
        exitType,
        reason,
        noticeStartDate: exitType === "resignation" ? noticeStartDate : null,
        lastWorkingDate: exitType === "resignation" ? lastWorkingDate : null,
        checklist,
      })
    ).then((result) => {
      console.log('Termination result:', result);
      if (deleteEmployee.fulfilled.match(result)) {
        navigate("/admin/employees");
      }
    });
  };

  if (!canTerminate) {
    return <div className="text-center text-red-600 py-4">Unauthorized to perform termination.</div>;
  }

  if (loading) {
    return <div className="text-center text-gray-600 py-4">Loading...</div>;
  }

  if (!employee) {
    return <div className="text-center text-red-600 py-4">Employee not found.</div>;
  }

  return (
    <div className="w-full p-4 sm:p-6">
      <style>
        {`
          .alert {
            padding: 12px;
            margin-bottom: 16px;
            border-radius: 4px;
          }
          .alert-success {
            background: #d1fae5;
            color: #065f46;
          }
          .alert-error {
            background: #fee2e2;
            color: #991b1b;
          }
          .form-control {
            width: 100%;
            padding: 8px;
            margin-bottom: 12px;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
            font-size: 14px;
          }
          .form-control:focus {
            outline: none;
            border-color: #4f46e5;
          }
          .button {
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
          }
          .button-cancel {
            background: #e5e7eb;
            color: #1e293b;
          }
          .button-confirm {
            background: #dc2626;
            color: white;
          }
        `}
      </style>
      <Link to="/admin/employees" className="flex items-center text-indigo-600 mb-4">
        <ArrowLeft size={16} className="mr-2" /> Back to Employees
      </Link>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Terminate Employee</h1>
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md">
        <h2 className="text-lg font-semibold mb-4">
          Employee: {employee.full_name} ({employee.employee_id})
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Exit Type</label>
            <select
              value={exitType}
              onChange={(e) => setExitType(e.target.value)}
              className="form-control"
            >
              <option value="">Select Exit Type</option>
              <option value="resignation">Resignation</option>
              <option value="termination">Termination</option>
              <option value="absconding">Absconding</option>
            </select>
          </div>
          {exitType === "resignation" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Notice Start Date</label>
                <input
                  type="date"
                  value={noticeStartDate}
                  onChange={(e) => setNoticeStartDate(e.target.value)}
                  className="form-control"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Working Date</label>
                <input
                  type="date"
                  value={lastWorkingDate}
                  onChange={(e) => setLastWorkingDate(e.target.value)}
                  className="form-control"
                />
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Reason for Termination</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for termination"
              rows="4"
              className="form-control"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Exit Checklist</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={checklist.handoverComplete}
                  onChange={(e) => setChecklist({ ...checklist, handoverComplete: e.target.checked })}
                  className="mr-2"
                />
                Handover Complete
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={checklist.assetsReturned}
                  onChange={(e) => setChecklist({ ...checklist, assetsReturned: e.target.checked })}
                  className="mr-2"
                />
                Assets Returned
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={checklist.finalPayrollProcessed}
                  onChange={(e) => setChecklist({ ...checklist, finalPayrollProcessed: e.target.checked })}
                  className="mr-2"
                />
                Final Payroll Processed
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button className="button button-cancel" onClick={() => navigate("/admin/employees")}>
              Cancel
            </button>
            <button
              className="button button-confirm"
              onClick={handleTerminate}
              disabled={!exitType || !reason}
            >
              Confirm Termination
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminateEmployee;