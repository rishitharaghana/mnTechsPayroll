import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAlumni } from "../../redux/slices/employeeSlice";

const AlumniList = () => {
  const dispatch = useDispatch();
  const { alumni, loading, error, successMessage } = useSelector(
    (state) => state.employee
  );

  useEffect(() => {
    dispatch(fetchAlumni());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Alumni List</h2>
      {successMessage && <div>{successMessage}</div>}
      {alumni.length === 0 ? (
        <p>No alumni found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Exit Type</th>
              <th>Last Working Date</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {alumni.map((alumnus) => (
              <tr key={alumnus.id}>
                <td>{alumnus.employee_id}</td>
                <td>{alumnus.full_name}</td>
                <td>{alumnus.email}</td>
                <td>{alumnus.role}</td>
                <td>{alumnus.exit_type}</td>
                <td>
                  {alumnus.last_working_date
                    ? new Date(alumnus.last_working_date).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>{alumnus.exit_reason || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AlumniList;