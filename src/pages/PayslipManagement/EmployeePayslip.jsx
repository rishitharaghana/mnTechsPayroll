import React, { useState, useMemo } from 'react';
import axios from 'axios';

const samplePayslips = {
  '2025-08': {
    employeeId: 'EMP001',
    employeeName: 'John Doe',
    department: 'Engineering',
    designation: 'Software Developer',
    month: 'August',
    year: 2025,
    earnings: { basic: 30000, hra: 10000, allowances: 5000, bonus: 2000 },
    deductions: { pf: 1800, tax: 2500, professionalTax: 200 },
  },
  '2025-07': {
    employeeId: 'EMP001',
    employeeName: 'John Doe',
    department: 'Engineering',
    designation: 'Software Developer',
    month: 'July',
    year: 2025,
    earnings: { basic: 30000, hra: 10000, allowances: 5000, bonus: 1000 },
    deductions: { pf: 1800, tax: 2400, professionalTax: 200 },
  },
  '2025-06': {
    employeeId: 'EMP001',
    employeeName: 'John Doe',
    department: 'Engineering',
    designation: 'Software Developer',
    month: 'June',
    year: 2025,
    earnings: { basic: 30000, hra: 10000, allowances: 5000, bonus: 1500 },
    deductions: { pf: 1800, tax: 2400, professionalTax: 200 },
  },
};

const EmployeePayslip = () => {
  const [fromDate, setFromDate] = useState('2025-06');
  const [toDate, setToDate] = useState('2025-08');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const filteredPayslips = useMemo(() => {
    const from = new Date(fromDate + '-01');
    const to = new Date(toDate + '-01');
    return Object.keys(samplePayslips)
      .filter((key) => {
        const payslipDate = new Date(key + '-01');
        return payslipDate >= from && payslipDate <= to;
      })
      .map((key) => ({ key, ...samplePayslips[key] }))
      .sort((a, b) => new Date(a.key) - new Date(b.key));
  }, [fromDate, toDate]);

  const payslipData = useMemo(() => {
    return filteredPayslips.map((payslip) => {
      const { earnings, deductions } = payslip;
      const totalEarnings = earnings.basic + earnings.hra + earnings.allowances + earnings.bonus;
      const totalDeductions = deductions.pf + deductions.tax + deductions.professionalTax;
      return { ...payslip, totalEarnings, totalDeductions, netPay: totalEarnings - totalDeductions };
    });
  }, [filteredPayslips]);

  const handlePreview = () => {
    setShowPreview(true);
    setError(null);
  };

  const generatePDF = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        'http://localhost:3007/generate-payslip',
        { from: fromDate, to: toDate },
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Payslips-${fromDate}-to-${toDate}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to generate PDF. Please try again.');
      console.error('PDF generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Payslip Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="from-date" className="block mb-2 font-medium">
            From Month
          </label>
          <input
            id="from-date"
            type="month"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border px-3 py-2 rounded w-full"
            aria-label="Select start month for payslips"
            max={toDate}
          />
        </div>
        <div>
          <label htmlFor="to-date" className="block mb-2 font-medium">
            To Month
          </label>
          <input
            id="to-date"
            type="month"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border px-3 py-2 rounded w-full"
            aria-label="Select end month for payslips"
            min={fromDate}
          />
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={handlePreview}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          aria-label="Preview payslips for selected date range"
        >
          Preview
        </button>
        <button
          onClick={generatePDF}
          disabled={isLoading}
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label="Download payslips as PDF"
        >
          {isLoading ? 'Generating...' : 'Download PDF'}
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {showPreview && payslipData.length > 0 ? (
        <div>
          <h3 className="text-lg font-semibold mb-2">Payslip Preview</h3>
          {payslipData.map((payslip) => (
            <div key={payslip.key} className="bg-gray-50 p-4 rounded shadow mb-4">
              <h4 className="text-md font-bold">{payslip.month} {payslip.year}</h4>
              <p><strong>Employee Name:</strong> {payslip.employeeName}</p>
              <p><strong>Employee ID:</strong> {payslip.employeeId}</p>
              <p><strong>Department:</strong> {payslip.department}</p>
              <p><strong>Designation:</strong> {payslip.designation}</p>
              <hr className="my-3" />
              <p><strong>Basic:</strong> ₹{payslip.earnings.basic}</p>
              <p><strong>HRA:</strong> ₹{payslip.earnings.hra}</p>
              <p><strong>Allowances:</strong> ₹{payslip.earnings.allowances}</p>
              <p><strong>Bonus:</strong> ₹{payslip.earnings.bonus}</p>
              <hr className="my-3" />
              <p><strong>PF:</strong> ₹{payslip.deductions.pf}</p>
              <p><strong>Tax:</strong> ₹{payslip.deductions.tax}</p>
              <p><strong>Professional Tax:</strong> ₹{payslip.deductions.professionalTax}</p>
              <hr className="my-3" />
              <p className="text-lg font-semibold">Net Pay: ₹{payslip.netPay}</p>
            </div>
          ))}
        </div>
      ) : showPreview && payslipData.length === 0 ? (
        <p className="text-red-500 mt-4">No payslips available for the selected date range.</p>
      ) : null}
    </div>
  );
};

export default EmployeePayslip;