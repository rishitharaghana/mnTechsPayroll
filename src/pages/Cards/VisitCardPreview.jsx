import React from "react";
import { ArrowLeft, Download, Printer, Share2 } from "lucide-react";
import VisitCardTemplate from "../Cards/VisitCardTemplate";

const VisitCardPreview = ({ employee, style, onBack }) => {
  if (!employee) return null;

  const handleDownload = () => {
    alert(
      `Downloading ${employee.full_name}'s ${style} business card as high-resolution PDF`
    );
  };

  const handlePrint = () => {
    alert(`Preparing ${employee.full_name}'s business card for printing...`);
  };

  const handleShare = () => {
    alert(`Sharing ${employee.full_name}'s business card preview...`);
  };

  return (
    <div className="min-h-screen">
      {/* Card Preview Section */}
      <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-steal-700 mb-2">
            Business Card Preview
          </h2>
        </div>

        {/* Cards Side by Side */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
          {/* Front Side */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-left md:text-center text-gray-900 mb-4">
              Front Side
            </h3>
            <div className="transform hover:scale-105 transition-transform duration-200">
              <VisitCardTemplate
                style={style}
                employee={employee}
                isPreview={true}
                sideFront="front"
              />
            </div>
          </div>

          {/* Back Side */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-left md:text-center text-gray-900 mb-4">
              Back Side
            </h3>
            <div className="transform hover:scale-105 transition-transform duration-200">
              <VisitCardTemplate
                style={style}
                employee={employee}
                isPreview={true}
                sideFront="back"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Employee Information */}
      <div className="w-full gap-8">
        <div className="w-full bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-bold text-steal-700 mb-4">
            Employee Information
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-start">
              <span className="sm:w-2/5 text-slate-700 font-semibold">
                Name
              </span>
              <span className="sm:w-3/5 text-slate-700 font-semibold">
                : {employee.full_name}
              </span>
            </div>
            <div className="flex items-center justify-start">
              <span className="sm:w-2/5 text-slate-700 font-semibold">
                Designation
              </span>
              <span className="sm:w-3/5 text-slate-700 font-semibold">
                : {employee.designation_name}
              </span>
            </div>
            <div className="flex items-center justify-start">
              <span className="sm:w-2/5 text-slate-700 font-semibold">
                Department
              </span>
              <span className="sm:w-3/5 text-slate-700 font-semibold">
                : {employee.department_name}
              </span>
            </div>
            <div className="flex items-center justify-start">
              <span className="sm:w-2/5 text-slate-700 font-semibold">
                Email
              </span>
              <span className="sm:w-3/5 text-slate-700 font-semibold">
                : {employee.email}
              </span>
            </div>
            <div className="flex items-center justify-start">
              <span className="sm:w-2/5 text-slate-700 font-semibold">
                Mobile
              </span>
              <span className="sm:w-3/5 text-slate-700 font-semibold">
                : {employee.mobile}
              </span>
            </div>
            {/* <div className="flex justify-between">
              <span className="w-1/4 sm:w-2/5 text-slate-700 font-semibold">
                Photo
              </span>
              <span className="w-3/4 sm:w-3/5 text-slate-700 font-semibold">
                : {employee.photo_url ? "Uploaded" : "Not Uploaded"}
              </span>
            </div> */}
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-5">
        <button
          onClick={onBack}
          className="bg-black hover:bg-gray-300 text-white hover:text-black font-semibold py-2 px-5 rounded-md "
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default VisitCardPreview;
