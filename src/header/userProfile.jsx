import React, { useEffect } from "react";
import { Edit } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile } from "../redux/slices/userSlice";
import { logout } from "../redux/slices/authSlice";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { profile, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserProfile());
    } else {
      navigate("/login"); 
    }
  }, [dispatch, isAuthenticated, navigate]);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => dispatch(fetchUserProfile())}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center mt-10">No user data available</div>;
  }

  return (
    <div className="w-full mt-5 sm:p-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          {profile.photo_url ? (
            <img
              src={profile.photo_url}
              alt="Profile"
              className="sm:w-30 w-20 sm:h-30 h-20 rounded-full border-4 border-slate-700 object-cover shadow-md hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="sm:w-30 w-20 sm:h-30 h-20 rounded-full bg-gray-200 flex items-center justify-center text-4xl text-gray-600 border-4 border-blue-500 shadow-md hover:scale-105 transition-transform duration-300">
              {profile.name?.charAt(0)}
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

      <div className="mb-6 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{profile.name}</h2>
        <p className="text-sm font-medium text-slate-700">{profile.designation_name || "N/A"}</p>
        <p className="text-sm text-gray-500">Employee ID: {profile.employee_id}</p>
      </div>

      <div className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
          <div>
            <span className="font-medium text-gray-800">Department:</span>
            <p className="text-gray-600">{profile.department_name || "N/A"}</p>
          </div>
          <div>
            <span className="font-medium text-gray-800">Phone:</span>
            <p className="text-gray-600">{profile.mobile}</p>
          </div>
          <div>
            <span className="font-medium text-gray-800">Email:</span>
            <p className="text-gray-600">{profile.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;