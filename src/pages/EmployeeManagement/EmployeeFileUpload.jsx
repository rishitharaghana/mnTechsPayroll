const EmployeeFileUpload = ({ name, onChange, accept, label, preview, isPdf }) => (
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
      <label htmlFor={`${name}-upload`} className="cursor-pointer text-gray-600">
        <span className="text-gray-500">Drag and drop files here or </span>
        <span className="underline text-black">Browse Files</span>
      </label>
      {preview && (
        <div className="mt-4">
          <img
            src={preview}
            alt="Uploaded Preview"
            className="w-40 h-25 rounded-lg mt-2"
            style={{ maxHeight: "200px", objectFit: "cover" }}
          />
        </div>
      )}
      {isPdf && (
        <div className="mt-4 flex flex-col">
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
          <span className="text-left text-sm text-gray-600 mt-2">PDF Uploaded</span>
        </div>
      )}
    </div>
  </div>
);

export default EmployeeFileUpload;