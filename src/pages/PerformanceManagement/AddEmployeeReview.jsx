import { useState } from 'react';
import DatePicker from '../../Components/ui/date/DatePicker';
import PageBreadcrumb from '../../Components/common/PageBreadcrumb';
import PageMeta from '../../Components/common/PageMeta';

const steps = ['Employee Info', 'Performance', 'Review'];

const AddEmployeeReview = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    employee: '',
    reviewPeriod: '',
    performanceScore: '',
    goalsCompleted: '',
    totalGoals: '',
    incentives: '',
    rating: '',
    bonusEligible: false,
    promotionRecommended: false,
    salaryHike: '',
    managerComments: '',
    reviewedBy: '',
    reviewedDate: '',
    achievements: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Submit logic here
  };

  return (
<div>
    <div className="flex justify-end">
        <PageMeta title="Add Employee Review" description="Add a new employee performance review" />
        <PageBreadcrumb
          items={[
            { label: 'Home', link: '/' },
            { label: 'Add Employee Review', link: '/admin/add-performance' },
          ]}
        />
      </div>
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <style>
        {`
          .step-transition {
            animation: slideIn 0.3s ease-in-out;
          }
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          .stepper-dot:hover::after {
            content: '';
            position: absolute;
            top: -4px;
            left: -4px;
            right: -4px;
            bottom: -4px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(0, 0, 0, 0.2), transparent);
            z-index: -1;
          }
        `}
      </style>
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-md border border-gray-100 p-8 transform transition-all duration-500">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8 tracking-tight">
          Employee Performance Review
        </h2>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-10 relative">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center z-10 group">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold text-xs transition-all duration-300 ${
                  currentStep >= index
                    ? 'bg-black text-white'
                    : 'bg-gray-200 text-gray-500'
                } stepper-dot`}
                aria-current={currentStep === index ? 'step' : undefined}
              >
                {index + 1}
              </div>
              <span
                className={`mt-2 text-xs font-bold text-black tracking-tight transition-all duration-300 group-hover:scale-105 ${
                  currentStep === index ? 'scale-105' : 'text-gray-500'
                }`}
              >
                {step}
              </span>
            </div>
          ))}
          {/* Progress Line */}
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0">
            <div
              className="h-full bg-black transition-all duration-500 ease-in-out"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 step-transition"
            key={currentStep}
          >
            {currentStep === 0 && (
              <>
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-bold text-black tracking-tight">
                    Employee Name
                  </label>
                  <input
                    type="text"
                    name="employee"
                    value={formData.employee}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 transition-all duration-300"
                    placeholder="Enter employee name"
                    required
                    aria-label="Employee Name"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-bold text-black tracking-tight">
                    Review Period
                  </label>
                  <input
                    type="text"
                    name="reviewPeriod"
                    value={formData.reviewPeriod}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 transition-all duration-300"
                    placeholder="e.g. Q1 2025"
                    required
                    aria-label="Review Period"
                  />
                </div>
              </>
            )}

            {currentStep === 1 && (
              <>
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-bold text-black tracking-tight">
                    Performance Score
                  </label>
                  <input
                    type="number"
                    name="performanceScore"
                    value={formData.performanceScore}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 transition-all duration-300"
                    placeholder="Enter score"
                    aria-label="Performance Score"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-bold text-black tracking-tight">
                    Goals Completed
                  </label>
                  <input
                    type="number"
                    name="goalsCompleted"
                    value={formData.goalsCompleted}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 transition-all duration-300"
                    placeholder="Enter number"
                    aria-label="Goals Completed"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-bold text-black tracking-tight">
                    Total Goals
                  </label>
                  <input
                    type="number"
                    name="totalGoals"
                    value={formData.totalGoals}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 transition-all duration-300"
                    placeholder="Enter number"
                    aria-label="Total Goals"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-bold text-black tracking-tight">
                    Incentives
                  </label>
                  <input
                    type="text"
                    name="incentives"
                    value={formData.incentives}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 transition-all duration-300"
                    placeholder="Enter incentives"
                    aria-label="Incentives"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-bold text-black tracking-tight">
                    Rating
                  </label>
                  <input
                    type="text"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 transition-all duration-300"
                    placeholder="e.g. Excellent"
                    aria-label="Rating"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-bold text-black tracking-tight">
                    Salary Hike (%)
                  </label>
                  <input
                    type="text"
                    name="salaryHike"
                    value={formData.salaryHike}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 transition-all duration-300"
                    placeholder="Enter percentage"
                    aria-label="Salary Hike"
                  />
                </div>
                <label className="flex items-center space-x-3 col-span-2 group">
                  <input
                    type="checkbox"
                    name="bonusEligible"
                    checked={formData.bonusEligible}
                    onChange={handleChange}
                    className="w-5 h-5 text-black rounded focus:ring-2 focus:ring-black transition-all duration-200"
                    aria-label="Bonus Eligible"
                  />
                  <span className="text-sm font-bold text-black tracking-tight">
                    Bonus Eligible
                  </span>
                </label>
                <label className="flex items-center space-x-3 col-span-2 group">
                  <input
                    type="checkbox"
                    name="promotionRecommended"
                    checked={formData.promotionRecommended}
                    onChange={handleChange}
                    className="w-5 h-5 text-black rounded focus:ring-2 focus:ring-black transition-all duration-200"
                    aria-label="Promotion Recommended"
                  />
                  <span className="text-sm font-bold text-black tracking-tight">
                    Promotion Recommended
                  </span>
                </label>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-bold text-black tracking-tight">
                    Reviewed By
                  </label>
                  <input
                    type="text"
                    name="reviewedBy"
                    value={formData.reviewedBy}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 transition-all duration-300"
                    placeholder="Enter reviewer name"
                    aria-label="Reviewed By"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-bold text-black tracking-tight">
                    Reviewed Date
                  </label>
                  <DatePicker
                    value={formData.reviewedDate}
                    onChange={(date) => setFormData({ ...formData, reviewedDate: date })}
                    placeholder="Select date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 transition-all duration-300"
                    aria-label="Reviewed Date"
                  />
                </div>
                <div className="flex flex-col col-span-2">
                  <label className="mb-1 text-sm font-bold text-black tracking-tight">
                    Manager Comments
                  </label>
                  <textarea
                    name="managerComments"
                    value={formData.managerComments}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 transition-all duration-300"
                    placeholder="Enter comments"
                    rows={4}
                    aria-label="Manager Comments"
                  />
                </div>
                <div className="flex flex-col col-span-2">
                  <label className="mb-1 text-sm font-bold text-black tracking-tight">
                    Achievements
                  </label>
                  <textarea
                    name="achievements"
                    value={formData.achievements}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 transition-all duration-300"
                    placeholder="Enter achievements"
                    rows={4}
                    aria-label="Achievements"
                  />
                </div>
              </>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-6 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 text-sm font-medium"
              aria-label="Previous step"
            >
              Back
            </button>
            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 hover:scale-105 transition-all duration-300 text-sm font-medium"
                aria-label="Next step"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 hover:scale-105 transition-all duration-300 text-sm font-medium"
                aria-label="Submit form"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default AddEmployeeReview;