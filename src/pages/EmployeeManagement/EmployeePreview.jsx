const EmployeePreview = ({ formData, error, successMessage, closePreview }) => {
  const stepGroups = [
    {
      title: "Personal Details",
      fields: [
        { label: "Full Name", value: formData.fullName || "N/A" },
        { label: "Father’s Name", value: formData.fatherName || "N/A" },
        { label: "Mother’s Name", value: formData.motherName || "N/A" },
        { label: "Phone", value: formData.phone || "N/A" },
        { label: "Email", value: formData.email || "N/A" },
        { label: "Gender", value: formData.gender || "N/A" },
        {
          label: "Image",
          value: formData.image ? (
            <div className="flex flex-col items-center">
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Employee"
                className="w-24 h-24 rounded-lg"
                style={{ maxHeight: "100px", objectFit: "cover" }}
              />
            </div>
          ) : (
            "N/A"
          ),
        },
        { label: "Present Address", value: formData.presentAddress || "N/A" },
        { label: "Previous Address", value: formData.previousAddress || "N/A" },
      ],
    },
    {
      title: "Position Information",
      fields: [
        { label: "Position Type", value: formData.positionType || "N/A" },
        ...(formData.positionType === "experienced"
          ? [
              { label: "Employer ID/Name", value: formData.employerIdName || "N/A" },
              { label: "Position Title", value: formData.positionTitle || "N/A" },
              { label: "Employment Type", value: formData.employmentType || "N/A" },
              { label: "Joining Date", value: formData.joiningDate || "N/A" },
              { label: "Contract End Date", value: formData.contractEndDate || "N/A" },
            ]
          : []),
      ],
    },
    {
      title: "Education Details",
      fields: [
        { label: "10th Class Name", value: formData.tenthClassName || "N/A" },
        { label: "10th Class Marks", value: formData.tenthClassMarks ? `${formData.tenthClassMarks}%` : "N/A" },
        { label: "Intermediate Name", value: formData.intermediateName || "N/A" },
        { label: "Intermediate Marks", value: formData.intermediateMarks ? `${formData.intermediateMarks}%` : "N/A" },
        { label: "Graduation Name", value: formData.graduationName || "N/A" },
        { label: "Graduation Marks", value: formData.graduationMarks ? `${formData.graduationMarks}%` : "N/A" },
        { label: "Postgraduation Name", value: formData.postgraduationName || "N/A" },
        { label: "Postgraduation Marks", value: formData.postgraduationMarks ? `${formData.postgraduationMarks}%` : "N/A" },
      ],
    },
    {
      title: "Documents",
      fields: [
        {
          label: "10th Class Document",
          value: formData.tenthClassDoc ? (
            formData.tenthClassDoc.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(formData.tenthClassDoc)}
                alt="10th Class Document"
                className="w-24 h-24 rounded-lg"
                style={{ maxHeight: "100px", objectFit: "cover" }}
              />
            ) : formData.tenthClassDoc.type === "application/pdf" ? (
              <div className="flex flex-col items-center">
                <svg
                  className="w-10 h-10 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="text-sm text-gray-600 mt-2">PDF Uploaded</span>
              </div>
            ) : (
              "Unsupported file type"
            )
          ) : (
            "N/A"
          ),
        },
        {
          label: "Intermediate Document",
          value: formData.intermediateDoc ? (
            formData.intermediateDoc.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(formData.intermediateDoc)}
                alt="Intermediate Document"
                className="w-24 h-24 rounded-lg"
                style={{ maxHeight: "100px", objectFit: "cover" }}
              />
            ) : formData.intermediateDoc.type === "application/pdf" ? (
              <div className="flex flex-col items-center">
                <svg
                  className="w-10 h-10 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="text-sm text-gray-600 mt-2">PDF Uploaded</span>
              </div>
            ) : (
              "Unsupported file type"
            )
          ) : (
            "N/A"
          ),
        },
        {
          label: "Graduation Document",
          value: formData.graduationDoc ? (
            formData.graduationDoc.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(formData.graduationDoc)}
                alt="Graduation Document"
                className="w-24 h-24 rounded-lg"
                style={{ maxHeight: "100px", objectFit: "cover" }}
              />
            ) : formData.graduationDoc.type === "application/pdf" ? (
              <div className="flex flex-col items-center">
                <svg
                  className="w-10 h-10 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="text-sm text-gray-600 mt-2">PDF Uploaded</span>
              </div>
            ) : (
              "Unsupported file type"
            )
          ) : (
            "N/A"
          ),
        },
        {
          label: "Postgraduation Document",
          value: formData.postgraduationDoc ? (
            formData.postgraduationDoc.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(formData.postgraduationDoc)}
                alt="Postgraduation Document"
                className="w-24 h-24 rounded-lg"
                style={{ maxHeight: "100px", objectFit: "cover" }}
              />
            ) : formData.postgraduationDoc.type === "application/pdf" ? (
              <div className="flex flex-col items-center">
                <svg
                  className="w-10 h-10 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="text-sm text-gray-600 mt-2">PDF Uploaded</span>
              </div>
            ) : (
              "Unsupported file type"
            )
          ) : (
            "N/A"
          ),
        },
        {
          label: "Aadhar Document",
          value: formData.aadharDoc ? (
            formData.aadharDoc.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(formData.aadharDoc)}
                alt="Aadhar Document"
                className="w-24 h-24 rounded-lg"
                style={{ maxHeight: "100px", objectFit: "cover" }}
              />
            ) : formData.aadharDoc.type === "application/pdf" ? (
              <div className="flex flex-col items-center">
                <svg
                  className="w-10 h-10 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="text-sm text-gray-600 mt-2">PDF Uploaded</span>
              </div>
            ) : (
              "Unsupported file type"
            )
          ) : (
            "N/A"
          ),
        },
        {
          label: "PAN Document",
          value: formData.panDoc ? (
            formData.panDoc.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(formData.panDoc)}
                alt="PAN Document"
                className="w-24 h-24 rounded-lg"
                style={{ maxHeight: "100px", objectFit: "cover" }}
              />
            ) : formData.panDoc.type === "application/pdf" ? (
              <div className="flex flex-col items-center">
                <svg
                  className="w-10 h-10 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="text-sm text-gray-600 mt-2">PDF Uploaded</span>
              </div>
            ) : (
              "Unsupported file type"
            )
          ) : (
            "N/A"
          ),
        },
      ],
    },
    {
      title: "Bank Details",
      fields: [
        { label: "IFSC Number", value: formData.ifscNumber || "N/A" },
        { label: "Bank Account Number", value: formData.bankACnumber || "N/A" },
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
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
        )}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">{successMessage}</div>
        )}
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
                  <p key={idx} className="flex flex-col gap-2">
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

export default EmployeePreview;
