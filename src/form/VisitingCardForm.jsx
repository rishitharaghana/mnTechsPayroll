import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../Components/common/PageBreadcrumb";
import PageMeta from "../Components/common/PageMeta";

const VisitingCardForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    position: "",
    department: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    companyLogo: null, 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Visiting Card generated:", formData);
    navigate("/visitingcard");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, companyLogo: file }); // Store the file object
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex justify-end">
        <PageMeta
          title="Generate Visiting Card"
          description="Create and manage employee visiting cards."
        />
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "Visiting Cards", link: "/visitingcard" },
            { label: "Generate Visiting Card", link: "/visitingcard/visitingcard-form" },
          ]}
        />
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md mx-auto"
      >
        <h2 className="text-2xl font-bold text-center text-teal-700 mb-8 tracking-tight">
          Generate Visiting Card
        </h2>
        <div className="mb-4">
          <label className="mb-1 text-sm font-bold text-black tracking-tight">
            ID
          </label>
          <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter ID"
            style={{ fontSize: "0.875rem", color: "#9ca3af" }}
            required
          />
        </div>
        <div className="mb-4">
          <label className="mb-1 text-sm font-bold text-black tracking-tight">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter name"
            style={{ fontSize: "0.875rem", color: "#9ca3af" }}
            required
          />
        </div>
        <div className="mb-4">
          <label className="mb-1 text-sm font-bold text-black tracking-tight">
            Position
          </label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter position"
            style={{ fontSize: "0.875rem", color: "#9ca3af" }}
            required
          />
        </div>
        <div className="mb-4">
          <label className="mb-1 text-sm font-bold text-black tracking-tight">
            Department
          </label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter department"
            style={{ fontSize: "0.875rem", color: "#9ca3af" }}
            required
          />
        </div>
        <div className="mb-4">
          <label className="mb-1 text-sm font-bold text-black tracking-tight">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter email"
            style={{ fontSize: "0.875rem", color: "#9ca3af" }}
            required
          />
        </div>
        <div className="mb-4">
          <label className="mb-1 text-sm font-bold text-black tracking-tight">
            Phone
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter phone number"
            style={{ fontSize: "0.875rem", color: "#9ca3af" }}
            required
          />
        </div>
        <div className="mb-4">
          <label className="mb-1 text-sm font-bold text-black tracking-tight">
            Website
          </label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter website URL"
            style={{ fontSize: "0.875rem", color: "#9ca3af" }}
          />
        </div>
        <div className="mb-4">
          <label className="mb-1 text-sm font-bold text-black tracking-tight">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter address"
            style={{ fontSize: "0.875rem", color: "#9ca3af" }}
            required
          />
        </div>
        <div className="mb-4">
          <label className="mb-1 text-sm font-bold text-black tracking-tight">
            Company Logo
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <input
              type="file"
              name="companyLogo"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="fileInput"
            />
            <label htmlFor="fileInput" className="cursor-pointer text-gray-600">
              Drag and drop files here or{" "}
              <span className="underline">Browse Files</span>
            </label>
            {formData.companyLogo && (
              <div className="mt-4">
                <img
                  src={URL.createObjectURL(formData.companyLogo)}
                  alt="Uploaded Logo Preview"
                  className="w-40 h-25 rounded-lg mt-2"
                  style={{ maxHeight: "200px" }}
                />
              </div>
            )}
          </div>
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

export default VisitingCardForm;