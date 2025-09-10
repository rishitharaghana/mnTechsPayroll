import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { downloadPayslip } from '../../redux/slices/payslipSlice';
import { toast } from 'react-toastify';

const formatCurrency = (value) => {
  const numValue = parseFloat(value) || 0;
  return `₹${numValue.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const numberToWords = (num) => {
  if (num === 0) return 'zero';
  const a = [
    '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
    'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen',
    'sixteen', 'seventeen', 'eighteen', 'nineteen',
  ];
  const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  const numToWords = (n) => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' ' + numToWords(n % 100) : '');
    if (n < 100000) return numToWords(Math.floor(n / 1000)) + ' thousand' + (n % 1000 ? ' ' + numToWords(n % 1000) : '');
    if (n < 10000000) return numToWords(Math.floor(n / 100000)) + ' lakh' + (n % 100000 ? ' ' + numToWords(n % 100000) : '');
    return numToWords(Math.floor(n / 10000000)) + ' crore' + (n % 10000000 ? ' ' + numToWords(n % 10000000) : '');
  };

  return numToWords(Math.floor(num)).trim().replace(/^\w/, (c) => c.toUpperCase());
};

const PayslipGenerator = ({ employee = {}, selectedMonth, onClose }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.payslip);
  const { user, role } = useSelector((state) => state.auth);

  const COMPANY_CONFIG = {
    company_name: 'MNTechs Solutions Pvt Ltd',
    company_pan: 'ABCDE1234F',
    company_gstin: '12ABCDE1234F1Z5',
    address: '123 Business Street, City, Country',
  };

  const totalEarnings =
    (parseFloat(employee.basic_salary) || 0) +
    (parseFloat(employee.hra) || 0) +
    (parseFloat(employee.da) || 0) +
    (parseFloat(employee.other_allowances) || 0);
  const totalDeductions =
    (parseFloat(employee.pf_deduction) || 0) +
    (parseFloat(employee.esic_deduction) || 0) +
    (parseFloat(employee.professional_tax) || 0) +
    (parseFloat(employee.tax_deduction) || 0);

  const handleDownloadPayslip = () => {
    if (role === 'employee' && user.employee_id !== employee.employee_id) {
      toast.error('Access denied: You can only download your own payslip.');
      return;
    }
    dispatch(downloadPayslip({ employeeId: employee.employee_id, month: selectedMonth }))
      .unwrap()
      .then(() => toast.success('Payslip downloaded successfully'))
      .catch((err) => toast.error(err?.error || 'Failed to download payslip'));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto font-sans text-gray-800">
      <div className="flex justify-between items-start mb-6">
        <div>
          <img
            src="/company_logo.png"
            alt="Company Logo"
            className="w-20 h-10 mb-2"
            onError={(e) => (e.target.src = '/fallback_logo.png')}
          />
          <h1 className="text-lg font-bold text-[#1a3c7a]">{COMPANY_CONFIG.company_name}</h1>
          <p className="text-xs text-gray-600">{COMPANY_CONFIG.address}</p>
          <p className="text-xs text-gray-600">
            PAN: {COMPANY_CONFIG.company_pan} | GSTIN: {COMPANY_CONFIG.company_gstin}
          </p>
        </div>
        <div>
          <h2 className="text-base font-bold text-[#1a3c7a] underline">Payslip for {selectedMonth}</h2>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="flex justify-between mb-6 gap-6">
        <div className="flex-1">
          <div className="text-xs">
            {[
              ['Employee Name', employee.employee_name || '-'],
              ['Employee ID', employee.employee_id || '-'],
              ['Department', employee.department || 'HR'],
              ['Designation', employee.designation_name || '-'],
              ['Pay Period', selectedMonth || '-'],
            ].map(([label, value], index) => (
              <div key={index} className="flex mb-3">
                <span className="font-bold text-gray-800 w-24">{label}:</span>
                <span className="text-gray-600">{value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1">
          <div className="text-xs">
            {[
              ['PAN', employee.pan_number || '-'],
              ['UAN', employee.uan_number || '-'],
              ['Bank A/C', employee.bank_account_number || '-'],
              ['IFSC', employee.ifsc_code || '-'],
              ['Payment Date', employee.payment_date ? new Date(employee.payment_date).toLocaleDateString('en-IN') : '-'],
            ].map(([label, value], index) => (
              <div key={index} className="flex mb-3">
                <span className="font-bold text-gray-800 w-24">{label}:</span>
                <span className="text-gray-600">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Earnings and Deductions */}
      <div className="flex justify-between mb-6 gap-6">
        {/* Earnings Table */}
        <div className="flex-1">
          <h3 className="text-xs font-bold text-white bg-[#1a3c7a] px-4 py-2">Earnings</h3>
          <table className="w-full text-xs border border-gray-300">
            <thead>
              <tr className="bg-[#1a3c7a] text-white">
                <th className="px-4 py-2 text-left w-[120px]">Description</th>
                <th className="px-4 py-2 text-right w-[80px]">Amount</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Basic Salary', employee.basic_salary],
                ['HRA', employee.hra],
                ['Dearness Allowance', employee.da],
                ['Other Allowances', employee.other_allowances],
                ['Total Earnings', totalEarnings],
              ].map(([label, value], index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className={`px-4 py-2 ${index === 4 ? 'font-bold' : ''}`}>{label}</td>
                  <td className={`px-4 py-2 text-right ${index === 4 ? 'font-bold' : ''}`}>
                    {formatCurrency(value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Deductions Table */}
        <div className="flex-1">
          <h3 className="text-xs font-bold text-white bg-[#1a3c7a] px-4 py-2">Deductions</h3>
          <table className="w-full text-xs border border-gray-300">
            <thead>
              <tr className="bg-[#1a3c7a] text-white">
                <th className="px-4 py-2 text-left w-[120px]">Description</th>
                <th className="px-4 py-2 text-right w-[80px]">Amount</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Provident Fund', employee.pf_deduction],
                ['ESIC', employee.esic_deduction],
                ['Professional Tax', employee.professional_tax],
                ['Income Tax', employee.tax_deduction],
                ['Total Deductions', totalDeductions],
                ['Net Pay', employee.net_salary],
              ].map(([label, value], index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className={`px-4 py-2 ${index >= 4 ? 'font-bold' : ''}`}>{label}</td>
                  <td className={`px-4 py-2 text-right ${index >= 4 ? 'font-bold' : ''}`}>
                    {formatCurrency(value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Net Pay in Words */}
      <div className="text-center mb-6">
        <p className="text-sm font-bold">{formatCurrency(employee.net_salary)}</p>
        <p className="text-xs text-gray-600">{numberToWords(employee.net_salary)} Only</p>
      </div>

      {/* Signatures */}
      <div className="flex justify-between mb-6">
        <div>
          <p className="text-xs text-gray-600">Employer Signature</p>
          <div className="w-48 h-px bg-gray-300 mt-8"></div>
        </div>
        <div>
          <p className="text-xs text-gray-600">Employee Signature</p>
          <div className="w-48 h-px bg-gray-300 mt-8"></div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <button
          onClick={handleDownloadPayslip}
          disabled={loading || (role === 'employee' && user.employee_id !== employee.employee_id)}
          className="flex-1 py-2 px-4 bg-[#1a3c7a] text-white rounded-md hover:bg-blue-900 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2 inline" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
              Downloading...
            </>
          ) : (
            'Download Payslip'
          )}
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Close
          </button>
        )}
      </div>

      <p className="text-xs text-gray-500 text-center">
        Note: This payslip is subject to statutory compliance as per Indian laws.
      </p>
    </div>
  );
};

export default PayslipGenerator;