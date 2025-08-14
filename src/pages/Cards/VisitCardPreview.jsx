import React from 'react';
import { ArrowLeft, Download, Printer, Share2 } from 'lucide-react';
import VisitCardTemplate from '../Cards/VisitCardTemplate';

const VisitCardPreview = ({ employee, style, onBack }) => {
  const handleDownload = () => {
    alert(`Downloading ${employee.name}'s ${style} business card as high-resolution PDF`);
  };

  const handlePrint = () => {
    alert(`Preparing ${employee.name}'s business card for printing...`);
  };

  const handleShare = () => {
    alert(`Sharing ${employee.name}'s business card preview...`);
  };

  return (
    <div className="min-h-screen">
        
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={15}/>
                <span className="text-sm text-slate-700 font-semibold">Go Back</span>
              </button>
              <div className="flex items-center space-x-2">
                <span className="text-gray-300">›</span>
                <span className="text-sm text-teal-700 font-semibold">Card Preview</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Share2 size={16} />
                <span>Share</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Printer size={16} />
                <span>Print</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Download size={16} />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">

        {/* Card Preview Section */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-teal-700 mb-2">Business Card Preview</h2>
          </div>

          {/* Cards Side by Side */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
            {/* Front Side */}
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Front Side</h3>
              <div className="transform hover:scale-105 transition-transform duration-200">
                <VisitCardTemplate 
                  style={style} 
                  employee={employee} 
                  isPreview={true}
                  sideFront="front"
                />
              </div>
              <p className="text-lg text-slate-700 font-semibold mt-3">Company Logo</p>
            </div>

            {/* Back Side */}
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Back Side</h3>
              <div className="transform hover:scale-105 transition-transform duration-200">
                <VisitCardTemplate 
                  style={style} 
                  employee={employee} 
                  isPreview={true}
                  sideFront="back"
                />
              </div>
              <p className="text-lg text-slate-700 font-semibold mt-3">Employee Contact Details</p>
            </div>
          </div>
        </div>

        {/* Card Information */}
        <div className="w-full gap-8">
          <div className="w-120 bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-bold text-teal-700 mb-4">Employee Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="w-1/2 text-slate-700 font-semibold">Name</span>
                <span className="w-1/1 text-slate-700 font-semibold">: {employee.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="w-1/2 text-slate-700 font-semibold">Position</span>
                <span className="w-1/1 text-slate-700 font-semibold">: {employee.position}</span>
              </div>
              <div className="flex justify-between">
                <span className="w-1/2 text-slate-700 font-semibold">Department</span>
                <span className="w-1/1 text-slate-700 font-semibold">: {employee.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="w-1/2 text-slate-700 font-semibold">Email</span>
                <span className="w-1/1 text-slate-700 font-semibold">: {employee.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="w-1/2 text-slate-700 font-semibold">Phone</span>
                <span className="w-1/1 text-slate-700 font-semibold">: {employee.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="w-1/2 text-slate-700 font-semibold">Website</span>
                <span className="w-1/1 text-slate-700 font-semibold">: {employee.website}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitCardPreview;