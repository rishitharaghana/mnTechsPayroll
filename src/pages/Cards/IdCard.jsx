import React from "react";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";

// Dummy employee images from Unsplash
const placeholderImages = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80",
];

const idCards = [
  {
    id: 1,
    employee: "Thambi Prasanth Annam",
    empId: "MO-EMP-008",
    designation: "Digital Marketing Executive",
    bloodGroup: "B+ve",
    mobile: "+91 9347 105 985",
    photo: placeholderImages[0],
  },
  {
    id: 2,
    employee: "Jane Doe",
    empId: "MO-EMP-009",
    designation: "UI/UX Designer",
    bloodGroup: "A+ve",
    mobile: "+91 9876 543 210",
    photo: placeholderImages[1],
  },
  {
    id: 3,
    employee: "John Smith",
    empId: "MO-EMP-010",
    designation: "Software Engineer",
    bloodGroup: "O+ve",
    mobile: "+91 8765 432 109",
    photo: placeholderImages[2],
  },
];

const IdCard = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex justify-end">
        <PageMeta title="ID Cards" description="Manage employee ID cards" />
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "ID Cards", link: "/idcard" },
          ]}
        />
      </div>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100 p-6">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mt-2">
                ID Cards
              </h1>
              <p className="text-slate-600">
                Manage and generate employee ID cards
              </p>
            </div>
            <button
              onClick={() => navigate("/idcard/idcard-form")}
              className="bg-slate-700 text-white px-6 py-2.5 rounded-lg shadow-md transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              Generate ID Card
            </button>
          </div>

          {idCards.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-slate-500">No ID cards found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {idCards.map((card) => (
                <div
                  key={card.id}
                  className="relative bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 w-full"
                  style={{ height: "400px", maxWidth: "320px" }} // Fixed height and max-width
                >
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-600/10 to-blue-500/10 rounded-2xl" />

                  {/* Card Content */}
                  <div className="relative z-10 flex flex-col items-center p-6 h-full">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-slate-700 shadow-lg mb-4">
                      <img
                        src={card.photo}
                        alt={card.employee}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-center space-y-2 flex-1">
                      <h2 className="text-xl font-semibold text-teal-900">
                        {card.employee}
                      </h2>
                      <p className="text-sm text-slate-600">
                        <span className="font-medium">Designation:</span>{" "}
                        {card.designation}
                      </p>
                      <p className="text-sm text-slate-600">
                        <span className="font-medium">ID No:</span> {card.empId}
                      </p>
                      <p className="text-sm text-slate-600">
                        <span className="font-medium">Blood Group:</span>{" "}
                        {card.bloodGroup}
                      </p>
                      <p className="text-sm text-slate-600">
                        <span className="font-medium">Mobile:</span>{" "}
                        {card.mobile}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/idcard/${card.id}`)}
                      className="mt-4 w-full flex items-center justify-center bg-slate-700 text-white py-2.5 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <Eye size={18} className="mr-2" />
                      View ID Card
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default IdCard;
