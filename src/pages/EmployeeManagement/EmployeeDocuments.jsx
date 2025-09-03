import FileUpload from "./EmployeeFileUpload";

const EmployeeDocuments = ({ formData, errors, handleChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex flex-col col-span-2">
        <FileUpload
          name="tenthClassDoc"
          onChange={handleChange}
          accept=".pdf,.jpg,.png"
          label="10th Class Document"
          preview={formData.tenthClassDoc && formData.tenthClassDoc.type.startsWith("image/") ? URL.createObjectURL(formData.tenthClassDoc) : null}
          isPdf={formData.tenthClassDoc && formData.tenthClassDoc.type === "application/pdf"}
        />
        {errors.tenthClassDoc && <span className="text-red-500 text-xs mt-1">{errors.tenthClassDoc}</span>}
      </div>
      <div className="flex flex-col col-span-2">
        <FileUpload
          name="intermediateDoc"
          onChange={handleChange}
          accept=".pdf,.jpg,.png"
          label="Intermediate Document"
          preview={formData.intermediateDoc && formData.intermediateDoc.type.startsWith("image/") ? URL.createObjectURL(formData.intermediateDoc) : null}
          isPdf={formData.intermediateDoc && formData.intermediateDoc.type === "application/pdf"}
        />
        {errors.intermediateDoc && <span className="text-red-500 text-xs mt-1">{errors.intermediateDoc}</span>}
      </div>
      <div className="flex flex-col col-span-2">
        <FileUpload
          name="graduationDoc"
          onChange={handleChange}
          accept=".pdf,.jpg,.png"
          label="Graduation Document"
          preview={formData.graduationDoc && formData.graduationDoc.type.startsWith("image/") ? URL.createObjectURL(formData.graduationDoc) : null}
          isPdf={formData.graduationDoc && formData.graduationDoc.type === "application/pdf"}
        />
        {errors.graduationDoc && <span className="text-red-500 text-xs mt-1">{errors.graduationDoc}</span>}
      </div>
      <div className="flex flex-col col-span-2">
        <FileUpload
          name="postgraduationDoc"
          onChange={handleChange}
          accept=".pdf,.jpg,.png"
          label="Postgraduation Document"
          preview={formData.postgraduationDoc && formData.postgraduationDoc.type.startsWith("image/") ? URL.createObjectURL(formData.postgraduationDoc) : null}
          isPdf={formData.postgraduationDoc && formData.postgraduationDoc.type === "application/pdf"}
        />
        {errors.postgraduationDoc && (
          <span className="text-red-500 text-xs mt-1">{errors.postgraduationDoc}</span>
        )}
      </div>
      <div className="flex flex-col col-span-2">
        <FileUpload
          name="aadharDoc"
          onChange={handleChange}
          accept=".pdf,.jpg,.png"
          label="Aadhar Document"
          preview={formData.aadharDoc && formData.aadharDoc.type.startsWith("image/") ? URL.createObjectURL(formData.aadharDoc) : null}
          isPdf={formData.aadharDoc && formData.aadharDoc.type === "application/pdf"}
        />
        {errors.aadharDoc && <span className="text-red-500 text-xs mt-1">{errors.aadharDoc}</span>}
      </div>
      <div className="flex flex-col col-span-2">
        <FileUpload
          name="panDoc"
          onChange={handleChange}
          accept=".pdf,.jpg,.png"
          label="PAN Document"
          preview={formData.panDoc && formData.panDoc.type.startsWith("image/") ? URL.createObjectURL(formData.panDoc) : null}
          isPdf={formData.panDoc && formData.panDoc.type === "application/pdf"}
        />
        {errors.panDoc && <span className="text-red-500 text-xs mt-1">{errors.panDoc}</span>}
      </div>
    </div>
  );
};

export default EmployeeDocuments;