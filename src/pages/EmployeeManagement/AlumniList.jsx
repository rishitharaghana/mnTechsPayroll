import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAlumni } from "../../redux/slices/employeeSlice";
import { Users, AlertCircle, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";

const AlumniList = () => {
  const dispatch = useDispatch();
  const { alumni, loading, error, successMessage } = useSelector(
    (state) => state.employee
  );

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Adjustable: 5 for demo, can be 10 for more

  useEffect(() => {
    dispatch(fetchAlumni());
    setCurrentPage(1); // Reset to first page on data fetch
  }, [dispatch]);

  // Helper: Format date to readable string
  const formatDate = (dateString) => {
    return dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A";
  };

  // Pagination logic
  const totalPages = Math.ceil(alumni.length / itemsPerPage);
  const paginatedAlumni = alumni.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => (
    <div className="flex items-center justify-between mt-6 px-6 py-4 bg-gradient-to-r from-teal-50 to-slate-50 rounded-xl border border-gray-200">
      <div className="flex items-center space-x-2 text-sm text-gray-700">
        <span>
          Showing {paginatedAlumni.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
          {Math.min(currentPage * itemsPerPage, alumni.length)} of {alumni.length} alumni
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg bg-white border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-teal-100 hover:to-slate-100 transition-all duration-200 flex items-center justify-center"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentPage === page
                ? "bg-gradient-to-r from-teal-600 to-slate-700 text-white shadow-md"
                : "bg-white border border-gray-300 hover:bg-gradient-to-r hover:from-teal-100 hover:to-slate-100"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg bg-white border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-teal-100 hover:to-slate-100 transition-all duration-200 flex items-center justify-center"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gradient-to-r from-red-50 to-slate-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
            <div>
              <h3 className="text-sm font-semibold text-red-800">Error</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white rounded-2xl p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Gradient */}
        <div className="mb-8 p-6 bg-gradient-to-r from-teal-600 via-teal-500 to-slate-700 rounded-xl text-white shadow-lg">
          <h1 className="text-3xl font-bold uppercase tracking-tight">Alumni List</h1>
          <p className="mt-2 text-teal-100">
            View former employees and their exit details.
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6">
            <div className="bg-gradient-to-r from-teal-50 to-slate-50 border border-teal-200 rounded-xl p-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-teal-400 mr-3" />
                <div>
                  <p className="text-sm font-semibold text-teal-800">
                    {successMessage}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {alumni.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              No alumni yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by terminating an employee.
            </p>
          </div>
        ) : (
          <>
            {/* Data Table */}
            <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-teal-50 via-teal-100 to-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Employee ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Exit Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Last Working Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Reason
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedAlumni.map((alumnus, index) => (
                      <tr
                        key={alumnus.id}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-gradient-to-r hover:from-teal-50 hover:to-slate-50 transition-all duration-200`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {alumnus.employee_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {alumnus.full_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-teal-100 to-slate-100 text-teal-800 border border-teal-200">
                            {alumnus.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            alumnus.exit_type === "resignation"
                              ? "bg-gradient-to-r from-yellow-100 to-slate-100 text-yellow-800 border border-yellow-200"
                              : "bg-gradient-to-r from-red-100 to-slate-100 text-red-800 border border-red-200"
                          }`}>
                            {alumnus.exit_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(alumnus.last_working_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {alumnus.exit_reason || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && renderPagination()}
          </>
        )}
      </div>
    </div>
  );
};

export default AlumniList;