import React from "react";
import { Edit } from "lucide-react";
import { Link } from "react-router-dom"; // Import Link

const UserProfile = () => {
  const user = {
    fullName: "Jane Smith",
    email: "jane.smith@example.com",
    designation: "Product Manager",
    department: "Product Development",
    phone: "+1-987-654-3210",
    employeeId: "EMP456",
    profileImage: "https://via.placeholder.com/150",
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
      {/* First Component: Profile Image and Edit Icon */}
      <div className="flex justify-between items-center mb-6">
        <div>
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-slate-700 object-cover shadow-md hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-4xl text-gray-600 border-4 border-blue-500 shadow-md hover:scale-105 transition-transform duration-300">
              {user.fullName.charAt(0)}
            </div>
          )}
        </div>
        <Link to="/profile">
          <button
            className="p-2 bg-white rounded-full shadow-md hover:bg-blue-50 hover:shadow-lg transition-all duration-300"
            aria-label="Edit Profile"
          >
            <Edit size={18} className="text-slate-700 hover:text-teal-800" />
          </button>
        </Link>
      </div>

      {/* Second Component: Name, Designation, Employee ID */}
      <div className="mb-6 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{user.fullName}</h2>
        <p className="text-sm font-medium text-slate-700">{user.designation}</p>
        <p className="text-sm text-gray-500">Employee ID: {user.employeeId}</p>
      </div>

      {/* Third Component: Department, Phone, Email */}
      <div className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
          <div>
            <span className="font-medium text-gray-800">Department:</span>
            <p className="text-gray-600">{user.department}</p>
          </div>
          <div>
            <span className="font-medium text-gray-800">Phone:</span>
            <p className="text-gray-600">{user.phone}</p>
          </div>
          <div>
            <span className="font-medium text-gray-800">Email:</span>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;