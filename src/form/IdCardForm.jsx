import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../Components/common/PageBreadcrumb";
import PageMeta from "../Components/common/PageMeta";

const IdCardForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employee: "",
    empId: "",
    designation: "",
    bloodGroup: "",
    mobile: "",
    photo: null, // Changed to store the file object instead of just the name
    barcode: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to save ID card (e.g., to localStorage or state)
    console.log("ID Card generated:", formData);
    navigate("/idcard");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: file }); // Store the file object
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto mt-10">
      <div className="flex justify-end">
        <PageMeta
          title="Generate ID Card"
          description="Create and manage employee ID cards."
        />
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "ID Cards", link: "/idcard" },
            { label: "Generate ID Card", link: "/idcard/idcard-form" },
          ]}
        />
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md mx-auto"
      >
        <h2 className="text-2xl font-bold text-center text-teal-700 mb-8 tracking-tight">
          Generate ID Card
        </h2>
        <div className="mb-4">
          <label className="mb-1 text-sm font-bold text-black tracking-tight">
            Employee Name
          </label>
          <input
            type="text"
            name="employee"
            value={formData.employee}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter employee name"
            style={{ fontSize: "0.875rem", color: "#9ca3af" }}
            required
          />
        </div>
        <div className="mb-4">
          <label className="mb-1 text-sm font-bold text-black tracking-tight">
            Employee ID
          </label>
          <input
            type="text"
            name="empId"
            value={formData.empId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter employee ID"
            style={{ fontSize: "0.875rem", color: "#9ca3af" }}
            required
          />
        </div>
        <div className="mb-4">
          <label className="mb-1 text-sm font-bold text-black tracking-tight">
            Designation
          </label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter designation"
            style={{ fontSize: "0.875rem", color: "#9ca3af" }}
            required
          />
        </div>
        <div className="mb-4">
          <label className="mb-1 text-sm font-bold text-black tracking-tight">
            Blood Group
          </label>
          <input
            type="text"
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter blood group"
            style={{ fontSize: "0.875rem", color: "#9ca3af" }}
            required
          />
        </div>
        <div className="mb-4">
          <label className="mb-1 text-sm font-bold text-black tracking-tight">
            Mobile Number
          </label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter mobile number"
            style={{ fontSize: "0.875rem", color: "#9ca3af" }}
            required
          />
        </div>
        <div className="mb-4">
          <label className="mb-1 text-sm font-bold text-black tracking-tight">
            Image Upload
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="fileInput"
            />
            <label htmlFor="fileInput" className="cursor-pointer text-gray-600">
              Drag and drop files here or{" "}
              <span className="underline">Browse Files</span>
            </label>
            {formData.photo && (
              <div className="mt-4">
                <img
                  src={URL.createObjectURL(formData.photo)}
                  alt="Uploaded Preview"
                  className="w-40 h-25 rounded-lg mt-2"
                  style={{ maxHeight: "200px" }}
                />
              </div>
            )}
          </div>
        </div>
        <div className="mb-4">
          <label className="mb-1 text-sm font-bold text-black tracking-tight">
            Barcode
          </label>
          <input
            type="text"
            name="barcode"
            value={formData.barcode}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter barcode value"
            style={{ fontSize: "0.875rem", color: "#9ca3af" }}
          />
        </div>
        <div className="w-full flex justify-end">
          <button
            type="submit"
            className="min-w-min bg-teal-700 text-white px-4 py-2 rounded-lg"
          >
            Save Card
          </button>
        </div>
      </form>
    </div>
  );
};

export default IdCardForm;