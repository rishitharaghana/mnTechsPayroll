import React from 'react';
import FileUpload from './EmployeeFileUpload';

const EmployeeDocuments = ({ formData, errors, handleChange }) => {
  const documentFields = [
    { name: 'tenthClassDoc', label: '10th Class Document', type: 'tenth_class' },
    { name: 'intermediateDoc', label: 'Intermediate Document', type: 'intermediate' },
    { name: 'graduationDoc', label: 'Graduation Document', type: 'graduation' },
    { name: 'postgraduationDoc', label: 'Postgraduation Document', type: 'postgraduation' },
    { name: 'aadharDoc', label: 'Aadhar Document', type: 'aadhar' },
    { name: 'panDoc', label: 'PAN Document', type: 'pan' },
  ];

  // Helper function to determine if a file is an image or PDF
  const getFilePreviewProps = (file) => {
    if (!file) return { preview: null, isPdf: false };

    if (file instanceof File) {
      // New file selected by user
      const isImage = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf';
      return {
        preview: isImage ? URL.createObjectURL(file) : null,
        isPdf,
      };
    } else if (typeof file === 'string') {
      // Existing file path from database
      const extension = file.split('.').pop().toLowerCase();
      const isImage = ['jpg', 'jpeg', 'png'].includes(extension);
      const isPdf = extension === 'pdf';
      return {
        preview: isImage ? file : null, // Assume file path is accessible for images
        isPdf,
      };
    }
    return { preview: null, isPdf: false };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {documentFields.map(({ name, label }) => {
        const { preview, isPdf } = getFilePreviewProps(formData[name]);
        return (
          <div key={name} className="flex flex-col col-span-2">
            <FileUpload
              name={name}
              onChange={handleChange}
              accept=".pdf,.jpg,.png"
              label={label}
              preview={preview}
              isPdf={isPdf}
            />
            {formData[name] && typeof formData[name] === 'string' && (
              <p className="mt-2 text-sm text-gray-600">
                Current: {formData[name].split('/').pop()}
              </p>
            )}
            {formData[name] && formData[name] instanceof File && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {formData[name].name}
              </p>
            )}
            {errors[name] && (
              <span className="text-red-500 text-xs mt-1">{errors[name]}</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default EmployeeDocuments;