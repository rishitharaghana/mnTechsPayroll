import { useState } from 'react';
import DatePicker from 'react-datepicker'; 
import 'react-datepicker/dist/react-datepicker.css'; 
import PageBreadcrumb from '../../Components/common/PageBreadcrumb';
import PageMeta from '../../Components/common/PageMeta';
import { Calendar } from 'lucide-react'; 

// Custom FileUpload Component
const FileUpload = ({ name, onChange, accept, label }) => (
  <div className="flex flex-col">
    <label className="mb-1 text-sm font-bold text-black tracking-tight">{label}</label>
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      <input
        type="file"
        name={name}
        onChange={onChange}
        accept={accept}
        className="hidden"
        id={`${name}-upload`}
      />
      <label htmlFor={`${name}-upload`} className="cursor-pointer">
        <span className="text-gray-500">Drag and drop files here or </span>
        <span className="text-black underline">Browse Files</span>
      </label>
    </div>
  </div>
);

const steps = [
  'Personal Details',
  'Education Details',
  'Documents',
  'Bank Details',
  'Preview',
];

const EmployeeDetails = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    motherName: '',
    phone: '',
    email: '',
    gender: '',
    image: null,
    presentAddress: '',
    previousAddress: '',
    positionType: '',
    employerIdName: '',
    positionTitle: '',
    employmentType: '',
    joiningDate: '',
    contractEndDate: '',
    tenthClassName: '',
    tenthClassMarks: '',
    intermediateName: '',
    intermediateMarks: '',
    graduationName: '',
    graduationMarks: '',
    postgraduationName: '',
    postgraduationMarks: '',
    tenthClassDoc: null,
    intermediateDoc: null,
    graduationDoc: null,
    postgraduationDoc: null,
    aadharDoc: null,
    panDoc: null,
    ifscNumber: '',
    bankACnumber: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleDateChange = (name, date) => {
    if (date && !isNaN(date)) {
      setFormData((prev) => ({
        ...prev,
        [name]: date.toISOString().split('T')[0],
      }));
      if (name === 'joiningDate' && !formData.contractEndDate) {
        const joinDate = new Date(date);
        joinDate.setFullYear(joinDate.getFullYear() + 1);
        setFormData((prev) => ({
          ...prev,
          contractEndDate: joinDate.toISOString().split('T')[0],
        }));
      }
    }
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const goToStep = (index) => {
    if (index === steps.length - 1) {
      setIsPreviewOpen(true);
    } else {
      setCurrentStep(index);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      goToStep(index);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // Submit logic here
  };

  const openPreview = () => setIsPreviewOpen(true);
  const closePreview = () => setIsPreviewOpen(false);

  const PreviewPopup = () => {
    const stepGroups = [
      {
        title: 'Personal Details',
        fields: [
          { label: 'Full Name', value: formData.fullName || 'N/A' },
          { label: 'Father’s Name', value: formData.fatherName || 'N/A' },
          { label: 'Mother’s Name', value: formData.motherName || 'N/A' },
          { label: 'Phone', value: formData.phone || 'N/A' },
          { label: 'Email', value: formData.email || 'N/A' },
          { label: 'Gender', value: formData.gender || 'N/A' },
          { label: 'Present Address', value: formData.presentAddress || 'N/A' },
          { label: 'Previous Address', value: formData.previousAddress || 'N/A' },
        ],
      },
      {
        title: 'Position Information',
        fields: [
          { label: 'Position Type', value: formData.positionType || 'N/A' },
          ...(formData.positionType === 'experienced'
            ? [
                { label: 'Employer ID/Name', value: formData.employerIdName || 'N/A' },
                { label: 'Position Title', value: formData.positionTitle || 'N/A' },
                { label: 'Employment Type', value: formData.employmentType || 'N/A' },
                { label: 'Joining Date', value: formData.joiningDate || 'N/A' },
                { label: 'Contract End Date', value: formData.contractEndDate || 'N/A' },
              ]
            : []),
        ],
      },
      {
        title: 'Education Details',
        fields: [
          { label: '10th Class Name', value: formData.tenthClassName || 'N/A' },
          {
            label: '10th Class Marks',
            value: formData.tenthClassMarks ? `${formData.tenthClassMarks}%` : 'N/A',
          },
          { label: 'Intermediate Name', value: formData.intermediateName || 'N/A' },
          {
            label: 'Intermediate Marks',
            value: formData.intermediateMarks ? `${formData.intermediateMarks}%` : 'N/A',
          },
          { label: 'Graduation Name', value: formData.graduationName || 'N/A' },
          {
            label: 'Graduation Marks',
            value: formData.graduationMarks ? `${formData.graduationMarks}%` : 'N/A',
          },
          { label: 'Postgraduation Name', value: formData.postgraduationName || 'N/A' },
          {
            label: 'Postgraduation Marks',
            value: formData.postgraduationMarks ? `${formData.postgraduationMarks}%` : 'N/A',
          },
        ],
      },
      {
        title: 'Bank Details',
        fields: [
          { label: 'IFSC Number', value: formData.ifscNumber || 'N/A' },
          { label: 'Bank Account Number', value: formData.bankACnumber || 'N/A' },
        ],
      },
    ];

    return (
      <div className="fixed inset-0 bg-gradient-to-br from-teal-500 to-blue-600 bg-opacity-80 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 relative shadow-2xl">
          <button
            onClick={closePreview}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close preview"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h3 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">Preview Employee Details</h3>
          <div className="space-y-8">
            {stepGroups.map((group, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-6 shadow-sm animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <h4 className="text-lg font-semibold text-teal-600 mb-4">{group.title}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                  {group.fields.map((field, idx) => (
                    <p key={idx}>
                      <strong>{field.label}:</strong> {field.value}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={closePreview}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-300 text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <style>
        {`
          .react-datepicker-wrapper {
            width: 100%;
          }
          .react-datepicker__input-container {
            position: relative;
          }
          .react-datepicker__input-container input {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            transition: all 0.3s ease;
          }
          .react-datepicker__input-container input:focus {
            outline: none;
            border-color: #14b8a6;
            box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.2);
          }
          .animate-fade-in {
            animation: fadeIn 0.5s ease-in-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
      <div className="flex justify-end">
        <PageMeta title="Employee Details" description="Add new employee details" />
        <PageBreadcrumb
          items={[
            { label: 'Home', link: '/' },
            { label: 'Employee Details', link: '/admin/employee-details' },
          ]}
        />
      </div>
      <div className="flex items-center justify-center p-4">
        <div className="max-w-4xl w-full bg-white rounded-2xl shadow-md border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8 tracking-tight">
            Employee Details Form
          </h2>

          {/* Stepper */}
          <div className="flex items-center justify-between mb-10 relative">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center z-10 group">
                <button
                  onClick={() => goToStep(index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold text-xs transition-all duration-300 ${
                    currentStep === index
                      ? 'bg-teal-600 text-white ring-2 ring-teal-600 ring-offset-2'
                      : currentStep > index
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-700 text-white'
                  } stepper-dot hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2`}
                  aria-current={currentStep === index ? 'step' : undefined}
                  aria-label={`Go to ${step}`}
                >
                  {index + 1}
                </button>
                <span
                  className={`mt-2 text-xs font-bold text-black tracking-tight transition-all duration-300 group-hover:scale-105 ${
                    currentStep === index ? 'scale-105 text-teal-600' : 'text-slate-700'
                  }`}
                >
                  {step}
                </span>
              </div>
            ))}
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-700 z-0">
              <div
                className="h-full bg-teal-600 transition-all duration-500 ease-in-out"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 step-transition" key={currentStep}>
              {currentStep === 0 && (
                <>
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-bold text-black tracking-tight">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-bold text-black tracking-tight">
                      Father’s Name
                    </label>
                    <input
                      type="text"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
                      placeholder="Enter father’s name"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-bold text-black tracking-tight">
                      Mother’s Name
                    </label>
                    <input
                      type="text"
                      name="motherName"
                      value={formData.motherName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
                      placeholder="Enter mother’s name"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-bold text-black tracking-tight">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-bold text-black tracking-tight">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
                      placeholder="Enter email"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-bold text-black tracking-tight">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="flex flex-col col-span-2">
                    <label className="mb-1 text-sm font-bold text-black tracking-tight">
                      Image Upload
                    </label>
                    <FileUpload
                      name="image"
                      onChange={handleChange}
                      accept="image/*"
                      label="Image Upload"
                    />
                  </div>
                  <div className="flex flex-col col-span-2">
                    <label className="mb-1 text-sm font-bold text-black tracking-tight">
                      Present Address
                    </label>
                    <input
                      type="text"
                      name="presentAddress"
                      value={formData.presentAddress}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
                      placeholder="Enter present address"
                    />
                  </div>
                  <div className="flex flex-col col-span-2">
                    <label className="mb-1 text-sm font-bold text-black tracking-tight">
                      Previous Address
                    </label>
                    <input
                      type="text"
                      name="previousAddress"
                      value={formData.previousAddress}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
                      placeholder="Enter previous address"
                    />
                  </div>
                  <div className="flex flex-col col-span-2">
                    <label className="mb-1 text-sm font-bold text-black tracking-tight">
                      Position Information
                    </label>
                    <select
                      name="positionType"
                      value={formData.positionType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
                    >
                      <option value="">Select Position Type</option>
                      <option value="fresher">Fresher</option>
                      <option value="experienced">Experienced</option>
                    </select>
                  </div>
                  {formData.positionType === 'experienced' && (
                    <>
                      <div className="flex flex-col">
                        <label className="mb-1 text-sm font-bold text-black tracking-tight">
                          Employer ID/Name
                        </label>
                        <input
                          type="text"
                          name="employerIdName"
                          value={formData.employerIdName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
                          placeholder="Enter employer ID or name"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="mb-1 text-sm font-bold text-black tracking-tight">
                          Position Title
                        </label>
                        <input
                          type="text"
                          name="positionTitle"
                          value={formData.positionTitle}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
                          placeholder="Enter position title"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="mb-1 text-sm font-bold text-black tracking-tight">
                          Employment Type
                        </label>
                        <select
                          name="employmentType"
                          value={formData.employmentType}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
                        >
                          <option value="">Select Employment Type</option>
                          <option value="full-time">Full-time</option>
                          <option value="part-time">Part-time</option>
                          <option value="internship">Internship</option>
                        </select>
                      </div>
                      <div className="flex flex-col">
                        <label className="mb-1 text-sm font-bold text-black tracking-tight">
                          Joining Date
                        </label>
                        <div className="relative">
                          <DatePicker
                            selected={formData.joiningDate ? new Date(formData.joiningDate) : null}
                            onChange={(date) => handleDateChange('joiningDate', date)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300 pr-10"
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Select joining date"
                          />
                          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="mb-1 text-sm font-bold text-black tracking-tight">
                          Contract End Date
                        </label>
                        <div className="relative">
                          <DatePicker
                            selected={formData.contractEndDate ? new Date(formData.contractEndDate) : null}
                            onChange={(date) => handleDateChange('contractEndDate', date)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300 pr-10"
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Select contract end date"
                          />
                          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              {currentStep === 1 && (
                <>
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-bold text-black tracking-tight">
                      10th Class Name
                    </label>
                    <input
                      type="text"
                      name="tenthClassName"
                      value={formData.tenthClassName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
                      placeholder="Enter school name"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-bold text-black tracking-tight">
                      10th Class Marks (%)
                    </label>
                    <input
                      type="number"
                      name="tenthClassMarks"
                      value={formData.tenthClassMarks}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
                      placeholder="Enter marks in percentage"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-bold text-black tracking-tight">
                      Intermediate Name
                    </label>
                    <input
                      type="text"
                      name="intermediateName"
                      value={formData.intermediateName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
                      placeholder="Enter college name"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-bold text-black tracking-tight">
                      Intermediate Marks (%)
                    </label>
                    <input
                      type="number"
                      name="intermediateMarks"
                      value={formData.intermediateMarks}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
                      placeholder="Enter marks in percentage"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-bold text-black tracking-tight">
                      Graduation Name
                    </label>
                    <input
                      type="text"
                      name="graduationName"
                      value={formData.graduationName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
                      placeholder="Enter university name"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-bold text-black tracking-tight">
                      Graduation Marks (%)
                    </label>
                    <input
                      type="number"
                      name="graduationMarks"
                      value={formData.graduationMarks}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
                      placeholder="Enter marks in percentage"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-bold text-black tracking-tight">
                      Postgraduation Name
                    </label>
                    <input
                      type="text"
                      name="postgraduationName"
                      value={formData.postgraduationName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
                      placeholder="Enter university name"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-bold text-black tracking-tight">
                      Postgraduation Marks (%)
                    </label>
                    <input
                      type="number"
                      name="postgraduationMarks"
                      value={formData.postgraduationMarks}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
                      placeholder="Enter marks in percentage"
                      min="0"
                      max="100"
                    />
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <div className="flex flex-col col-span-2">
                    <FileUpload
                      name="tenthClassDoc"
                      onChange={handleChange}
                      accept=".pdf,.doc,.docx,.jpg,.png"
                      label="10th Class Document"
                    />
                  </div>
                  <div className="flex flex-col col-span-2">
                    <FileUpload
                      name="intermediateDoc"
                      onChange={handleChange}
                      accept=".pdf,.doc,.docx,.jpg,.png"
                      label="Intermediate Document"
                    />
                  </div>
                  <div className="flex flex-col col-span-2">
                    <FileUpload
                      name="graduationDoc"
                      onChange={handleChange}
                      accept=".pdf,.doc,.docx,.jpg,.png"
                      label="Graduation Document"
                    />
                  </div>
                  <div className="flex flex-col col-span-2">
                    <FileUpload
                      name="postgraduationDoc"
                      onChange={handleChange}
                      accept=".pdf,.doc,.docx,.jpg,.png"
                      label="Postgraduation Document"
                    />
                  </div>
                  <div className="flex flex-col col-span-2">
                    <FileUpload
                      name="aadharDoc"
                      onChange={handleChange}
                      accept=".pdf,.doc,.docx,.jpg,.png"
                      label="Aadhar Document"
                    />
                  </div>
                  <div className="flex flex-col col-span-2">
                    <FileUpload
                      name="panDoc"
                      onChange={handleChange}
                      accept=".pdf,.doc,.docx,.jpg,.png"
                      label="PAN Document"
                    />
                  </div>
                </>
              )}

              {currentStep === 3 && (
                <>
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-bold text-black tracking-tight">
                      Bank Account Number
                    </label>
                    <input
                      type="text"
                      name="bankACnumber"
                      value={formData.bankACnumber}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
                      placeholder="Enter Bank Account Number"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-bold text-black tracking-tight">
                      IFSC Number
                    </label>
                    <input
                      type="text"
                      name="ifscNumber"
                      value={formData.ifscNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
                      placeholder="Enter IFSC number"
                    />
                  </div>
                </>
              )}

              {currentStep === 4 && (
                <div className="col-span-2 flex justify-center items-center">
                  <button
                    type="button"
                    onClick={openPreview}
                    className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 hover:scale-105 transition-all duration-300 text-sm font-medium"
                  >
                    View Preview
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 text-sm font-medium"
                aria-label="Previous step"
              >
                Back
              </button>
              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 hover:scale-105 transition-all duration-300 text-sm font-medium"
                  aria-label="Next step"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 hover:scale-105 transition-all duration-300 text-sm font-medium"
                  aria-label="Submit form"
                >
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      {isPreviewOpen && <PreviewPopup />}
    </div>
  );
};

export default EmployeeDetails;