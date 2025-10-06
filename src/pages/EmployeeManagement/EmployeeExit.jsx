import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { addDays, format, isValid, isBefore } from 'date-fns';
import { User, AlertTriangle, LogOut, Briefcase } from 'lucide-react';
import { toast } from 'react-toastify';
import { deleteEmployee, fetchEmployees, clearState } from '../../redux/slices/employeeSlice';
import PageBreadcrumb from '../../Components/common/PageBreadcrumb';
import PageMeta from '../../Components/common/PageMeta';

const ExitEmployee = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { employees, loading, error, successMessage } = useSelector((state) => state.employee);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    id: '',
    role: '',
    exitType: '',
    reason: '',
    noticeStartDate: '',
    lastWorkingDate: '',
    restrictLeaves: false,
    exitChecklist: {
      laptop_returned: false,
      id_card_returned: false,
      exit_interview_completed: false,
    },
  });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const exitTypes = [
    { name: 'Resignation', icon: <LogOut className="w-6 h-6" />, description: 'Employee-initiated exit with notice period' },
    { name: 'Termination', icon: <Briefcase className="w-6 h-6" />, description: 'Employer-initiated exit' },
    { name: 'Absconding', icon: <AlertTriangle className="w-6 h-6" />, description: 'Employee left without notice' },
  ];

  // Filter employees based on user role, assume 'active' if status is missing
  const filteredEmployees = user?.role === 'hr'
    ? employees.filter(emp => emp.role !== 'hr' && (!emp.status || emp.status.toLowerCase() === 'active'))
    : employees.filter(emp => !emp.status || emp.status.toLowerCase() === 'active');

  // Format employees for react-select
  const employeeOptions = filteredEmployees.map(emp => ({
    value: emp.id,
    label: `${emp.full_name || 'Unknown Name'} (${emp.employee_id || 'N/A'} - ${emp.role || 'N/A'})`,
    employee: emp,
  }));

  // Auto-calculate lastWorkingDate (60 days from noticeStartDate)
  useEffect(() => {
    if (formData.exitType === 'resignation' && formData.noticeStartDate) {
      const noticeStart = new Date(formData.noticeStartDate);
      if (isValid(noticeStart)) {
        const calculatedLastWorkingDate = addDays(noticeStart, 60);
        setFormData(prev => ({
          ...prev,
          lastWorkingDate: format(calculatedLastWorkingDate, 'yyyy-MM-dd'),
        }));
      }
    }
  }, [formData.noticeStartDate, formData.exitType]);
 useEffect(() => {
    if (!['super_admin', 'hr'].includes(user?.role)) {
      console.log("Unauthorized role, redirecting to /login");
      toast.error('Unauthorized access. Please log in with appropriate permissions.');
      navigate('/login');
      return;
    }
    console.log("ExitEmployee mounted, clearing employee slice state");
    dispatch(clearState()); // Clear state first
    dispatch(fetchEmployees());
  }, [dispatch, navigate, user]);

  useEffect(() => {
    console.log('Employees from Redux:', employees);
    console.log('Filtered Employees:', filteredEmployees);
    console.log('Employee Options for Select:', employeeOptions);
    if (employees.length > 0 && filteredEmployees.length === 0) {
      console.warn('No employees passed the filter. Check status field in employee data.');
    }
  }, [employees, filteredEmployees, employeeOptions]);
useEffect(() => {
    console.log("ExitEmployee useEffect triggered with:", { successMessage, error, isSubmitting });
    if (isSubmitting && successMessage) {
      console.log("Success: Navigating to /admin/employees");
      toast.success(successMessage);
      navigate('/admin/employees'); // Revert to /admin/employees
      setTimeout(() => dispatch(clearState()), 1000);
    }
    if (error) {
      console.error("Error in ExitEmployee:", error);
      if (error.includes('Access token') || error.includes('Invalid or expired token') || error.includes('Forbidden')) {
        toast.error('Session expired or unauthorized. Please log in again.');
        navigate('/login');
      } else if (error.includes('Cannot terminate employee with records in payroll')) {
        toast.error(
          'Cannot process exit: Employee has payroll records. Please archive or resolve payroll dependencies in the Payroll Management section.',
          { autoClose: 5000 }
        );
        setErrors({
          submit: 'Payroll records detected. Navigate to Payroll Management to resolve.',
        });
      } else if (error.includes('Cannot terminate employee with records in personal_details')) {
        toast.error(
          'Cannot process exit: Employee has personal details records. Please archive or resolve dependencies in the Personal Details Management section.',
          { autoClose: 5000 }
        );
        setErrors({
          submit: 'Personal details records detected. Navigate to Personal Details Management to resolve.',
        });
      } else {
        toast.error(error);
        setErrors({ submit: error });
      }
      setIsSubmitting(false);
    }
  }, [successMessage, error, dispatch, navigate, isSubmitting]);
  const handleInput = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  }, []);

  const handleChecklistChange = useCallback((field, checked) => {
    setFormData(prev => ({
      ...prev,
      exitChecklist: { ...prev.exitChecklist, [field]: checked },
    }));
  }, []);

  const handleEmployeeSelect = useCallback((option) => {
    const employee = option ? option.employee : null;
    console.log('Selected employee:', employee);
    setSelectedEmployee(employee);
    setFormData(prev => ({
      ...prev,
      id: employee?.id || '',
      role: employee?.role || '',
    }));
    setErrors({});
  }, []);

  const validateStep = () => {
    const newErrors = {};
    if (step === 1 && !selectedEmployee) {
      newErrors.employee = 'Please select an employee';
    }
    if (step === 2 && !formData.exitType) {
      newErrors.exitType = 'Please select an exit type';
    }
    if (step === 3) {
      if (!formData.reason.trim()) {
        newErrors.reason = 'Reason for exit is required';
      }
      if (formData.exitType === 'resignation') {
        if (!formData.noticeStartDate) {
          newErrors.noticeStartDate = 'Notice start date is required';
        } else if (!isValid(new Date(formData.noticeStartDate))) {
          newErrors.noticeStartDate = 'Invalid notice start date';
        }
        if (!formData.lastWorkingDate) {
          newErrors.lastWorkingDate = 'Last working date is required';
        } else if (!isValid(new Date(formData.lastWorkingDate))) {
          newErrors.lastWorkingDate = 'Invalid last working date';
        } else if (
          formData.noticeStartDate &&
          formData.lastWorkingDate &&
          isBefore(new Date(formData.lastWorkingDate), new Date(formData.noticeStartDate))
        ) {
          newErrors.lastWorkingDate = 'Last working date cannot be before notice start date';
        }
      }
    }
    return newErrors;
  };

  const handleNext = () => {
    const stepErrors = validateStep();
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      toast.error('Please fix the errors before proceeding');
      return;
    }
    setErrors({});
    setStep(prev => prev + 1);
  };

  const handlePrevious = () => {
    setErrors({});
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formErrors = validateStep();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsSubmitting(false);
      toast.error('Please fix the errors before submitting');
      return;
    }

    if (!['super_admin', 'hr'].includes(user?.role)) {
      toast.error('Unauthorized access.');
      navigate('/login');
      setIsSubmitting(false);
      return;
    }

    try {
      const resultAction = await dispatch(deleteEmployee(formData));
      if (!deleteEmployee.fulfilled.match(resultAction)) {
        throw new Error(resultAction.payload || 'Failed to process exit');
      }
    } catch (err) {
      toast.error(err.message);
      setErrors({ submit: err.message });
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex flex-col sm:flex-row border-2 border-gray-200 sm:border-0 sm:border-none p-4 sm:p-0 rounded-xl sm:rounded-none shadow-md sm:shadow-none items-start sm:items-center sm:justify-center justify-start mb-5 sm:mb-6 space-y-3 sm:space-y-0 sm:space-x-3 md:space-x-4 lg:space-x-6">
      {['Select Employee', 'Exit Type', 'Details'].map((label, index) => (
        <div key={label} className="flex sm:items-center items-center sm:justify-center justify-start w-full sm:w-auto">
          <div
            className={`w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs xs:text-sm sm:text-base font-medium z-50 ${
              step > index + 1
                ? 'bg-teal-600 text-white'
                : step === index + 1
                ? 'bg-teal-100 text-teal-600 border-2 border-teal-600'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {index + 1}
          </div>
          <span
            className={`ml-2 text-xs xs:text-sm sm:text-sm md:text-base font-medium text-center sm:text-left ${
              step >= index + 1 ? 'text-teal-600' : 'text-gray-500'
            }`}
          >
            {label}
          </span>
          {index < 2 && (
            <div
              className={`w-6 sm:w-8 md:w-10 lg:w-12 h-1 mx-1 sm:mx-2 hidden sm:block ${
                step > index + 1 ? 'bg-teal-600' : 'bg-gray-200'
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );

  const selectStyles = {
    control: (provided) => ({
      ...provided,
      border: '2px solid #e5e7eb',
      borderRadius: '0.75rem',
      padding: '0.5rem',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#14b8a6',
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#e0f2fe' : state.isFocused ? '#f0fdfa' : 'white',
      color: '#1f2937',
      padding: '0.75rem 1rem',
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '0.75rem',
      border: '1px solid #e5e7eb',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#1f2937',
      fontWeight: '500',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#6b7280',
    }),
  };

  return (
    <div className="w-full">
      <div className="hidden sm:flex sm:justify-end mb-4">
        <PageBreadcrumb
          items={[
            { label: 'Home', link: '/admin/dashboard' },
            { label: 'Exit Employee', link: '/admin/exit-employee' },
          ]}
        />
        <PageMeta title="Exit Employee" description="Process employee exit" />
      </div>
      <div className="min-h-screen bg-white rounded-2xl p-4 sm:p-6">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 sm:p-6 relative z-10">
          <h2 className="text-xl pt-3 sm:pt-0 sm:text-3xl font-bold text-center text-teal-600 mb-8 sm:mb-10 uppercase tracking-tight">
            Process Employee Exit
          </h2>
          {renderStepIndicator()}
          {errors.submit && (
            <p className="text-red-600 text-center mb-4">
              {errors.submit}
              {errors.submit.includes('payroll') && (
                <span>
                  {' '}
                  <a
                    href="/admin/payroll-management"
                    className="underline text-teal-600 hover:text-teal-800"
                  >
                    Go to Payroll Management
                  </a>
                </span>
              )}
              {errors.submit.includes('personal_details') && (
                <span>
                  {' '}
                  <a
                    href="/admin/personal-details-management"
                    className="underline text-teal-600 hover:text-teal-800"
                  >
                    Go to Personal Details Management
                  </a>
                </span>
              )}
            </p>
          )}
          {step === 1 && (
            <div className="pb-2 max-w-lg mx-auto">
              <label className="block text-sm sm:text-md font-semibold text-gray-900 mb-4">
                Select Employee <span className="text-red-600 font-bold">*</span>
              </label>
              {loading && (
                <div className="text-center text-gray-600">
                  <svg
                    className="animate-spin h-8 w-8 mx-auto text-teal-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading employees...
                </div>
              )}
              {!loading && filteredEmployees.length === 0 && (
                <p className="text-center text-gray-500">
                  No active employees found.{' '}
                  {employees.length > 0 && (
                    <span>
                      (Note: Employee data may be missing status field. Contact support to update the database.)
                    </span>
                  )}
                </p>
              )}
              {!loading && filteredEmployees.length > 0 && (
                <div className="relative">
                  <Select
                    options={employeeOptions}
                    onChange={handleEmployeeSelect}
                    placeholder="Search or select an employee..."
                    isClearable
                    isSearchable
                    styles={selectStyles}
                    className="text-sm sm:text-base"
                    aria-label="Select Employee"
                  />
                  {errors.employee && (
                    <p className="mt-3 text-sm text-red-600 text-center font-medium">{errors.employee}</p>
                  )}
                </div>
              )}
              {selectedEmployee && (
                <div className="mt-6 flex justify-end">
                  <div className="flex items-center space-x-4">
                    <p className="text-sm sm:text-base text-gray-700">
                      Selected: <span className="font-semibold">{selectedEmployee.full_name} ({selectedEmployee.employee_id})</span>
                    </p>
                    <button
                      type="button"
                      className="text-base sm:text-lg px-5 py-2 bg-teal-600 text-white rounded-xl hover:bg-gradient-to-r hover:from-teal-600 hover:to-teal-700 hover:scale-105 transition-all duration-200 font-medium z-50"
                      onClick={handleNext}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {step > 1 && (
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 relative z-10">
              {step === 2 && (
                <div className="pb-2">
                  <label className="block text-sm sm:text-md font-semibold text-gray-900 mb-4">
                    Select Exit Type <span className="text-red-600 font-bold">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {exitTypes.map((type) => (
                      <button
                        key={type.name}
                        type="button"
                        onClick={() => handleInput('exitType', type.name.toLowerCase())}
                        className={`p-4 sm:p-6 rounded-xl border-2 bg-white shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-between text-center z-50 min-h-[150px] sm:min-h-[180px] ${
                          formData.exitType === type.name.toLowerCase()
                            ? 'border-teal-600 bg-teal-50 text-teal-700 scale-105'
                            : 'border-gray-200 text-gray-700 hover:border-teal-400 hover:to-teal-50'
                        } ${errors.exitType ? 'border-red-500 animate-pulse' : ''}`}
                      >
                        <div className="mb-2 text-teal-600 flex items-center justify-center h-8 sm:h-10">
                          {type.icon}
                        </div>
                        <h3 className="text-sm sm:text-base md:text-lg font-semibold">{type.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">{type.description}</p>
                      </button>
                    ))}
                  </div>
                  {errors.exitType && (
                    <p className="mt-3 text-sm text-red-600 text-center font-medium">{errors.exitType}</p>
                  )}
                  {formData.exitType && (
                    <div className="w-full flex justify-between mt-6">
                      <button
                        type="button"
                        className="text-base sm:text-lg px-5 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-800 hover:scale-105 transition-all duration-200 font-medium z-50"
                        onClick={handlePrevious}
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        className="text-base sm:text-lg px-5 py-2 bg-teal-600 text-white rounded-xl hover:bg-gradient-to-r hover:from-teal-600 hover:to-teal-700 hover:scale-105 transition-all duration-200 font-medium z-50"
                        onClick={handleNext}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}
              {step === 3 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="relative group z-10">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Reason for Exit <span className="text-red-600 font-bold">*</span>
                      <span className="ml-1 text-gray-400 cursor-help" title="Provide the reason for the employee's exit">
                        ⓘ
                      </span>
                    </label>
                    <textarea
                      value={formData.reason}
                      onChange={(e) => handleInput('reason', e.target.value)}
                      className={`w-full px-4 py-3 border-0 border-b-2 border-gray-200 focus:border-teal-600 focus:ring-0 transition-all duration-200 bg-transparent text-gray-900 placeholder-gray-400 hover:bg-gray-50/50 z-10 ${
                        errors.reason ? 'border-red-500 animate-pulse' : ''
                      }`}
                      aria-label="Reason for Exit"
                      rows="4"
                      required
                    />
                    {errors.reason && (
                      <p className="mt-1 text-sm text-red-600 font-medium">{errors.reason}</p>
                    )}
                  </div>
                  {formData.exitType === 'resignation' && (
                    <>
                      <div className="relative group z-10">
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Notice Start Date <span className="text-red-600 font-bold">*</span>
                          <span className="ml-1 text-gray-400 cursor-help" title="Date when notice period begins">
                            ⓘ
                          </span>
                        </label>
                        <input
                          type="date"
                          value={formData.noticeStartDate}
                          onChange={(e) => handleInput('noticeStartDate', e.target.value)}
                          className={`w-full px-4 py-3 border-0 border-b-2 border-gray-200 focus:border-teal-600 focus:ring-0 transition-all duration-200 bg-transparent text-gray-900 z-10 ${
                            errors.noticeStartDate ? 'border-red-500 animate-pulse' : ''
                          }`}
                          aria-label="Notice Start Date"
                          required
                        />
                        {errors.noticeStartDate && (
                          <p className="mt-1 text-sm text-red-600 font-medium">{errors.noticeStartDate}</p>
                        )}
                      </div>
                      <div className="relative group z-10">
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Last Working Date <span className="text-red-600 font-bold">*</span>
                          <span className="ml-1 text-gray-400 cursor-help" title="Employee's last working day (auto-calculated as 60 days from notice start)">
                            ⓘ
                          </span>
                        </label>
                        <input
                          type="date"
                          value={formData.lastWorkingDate}
                          onChange={(e) => handleInput('lastWorkingDate', e.target.value)}
                          className={`w-full px-4 py-3 border-0 border-b-2 border-gray-200 focus:border-teal-600 focus:ring-0 transition-all duration-200 bg-transparent text-gray-900 z-10 ${
                            errors.lastWorkingDate ? 'border-red-500 animate-pulse' : ''
                          }`}
                          aria-label="Last Working Date"
                          required
                        />
                        {errors.lastWorkingDate && (
                          <p className="mt-1 text-sm text-red-600 font-medium">{errors.lastWorkingDate}</p>
                        )}
                      </div>
                      <div className="relative group z-10">
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Restrict Leave Applications
                          <span className="ml-1 text-gray-400 cursor-help" title="Prevent employee from applying for leaves during notice period">
                            ⓘ
                          </span>
                        </label>
                        <input
                          type="checkbox"
                          checked={formData.restrictLeaves}
                          onChange={(e) => handleInput('restrictLeaves', e.target.checked)}
                          className="h-5 w-5 text-teal-600 focus:ring-teal-600 border-gray-200 rounded"
                          aria-label="Restrict Leave Applications"
                        />
                      </div>
                    </>
                  )}
                  <div className="relative group z-10">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Exit Checklist
                      <span className="ml-1 text-gray-400 cursor-help" title="Optional checklist for exit tasks">
                        ⓘ
                      </span>
                    </label>
                    <div className="space-y-2">
                      {[
                        { label: 'Laptop Returned', field: 'laptop_returned' },
                        { label: 'ID Card Returned', field: 'id_card_returned' },
                        { label: 'Exit Interview Completed', field: 'exit_interview_completed' },
                      ].map(({ label, field }) => (
                        <div key={field} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.exitChecklist[field]}
                            onChange={(e) => handleChecklistChange(field, e.target.checked)}
                            className="h-5 w-5 text-teal-600 focus:ring-teal-600 border-gray-200 rounded"
                            aria-label={label}
                          />
                          <label className="ml-2 text-sm text-gray-900">{label}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 relative z-50">
                    <button
                      type="button"
                      className="w-full sm:w-auto text-base sm:text-lg px-5 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-800 hover:scale-105 transition-all duration-200 font-medium z-50"
                      onClick={handlePrevious}
                    >
                      Previous
                    </button>
                    <button
                      type="submit"
                      className={`w-full sm:w-auto text-base sm:text-lg px-5 py-2 bg-teal-600 text-white rounded-xl hover:bg-gradient-to-r hover:from-teal-600 hover:to-teal-700 hover:scale-105 transition-all duration-200 font-medium flex items-center justify-center sm:ml-auto z-50 ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 mr-2 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        'Process Exit'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExitEmployee;