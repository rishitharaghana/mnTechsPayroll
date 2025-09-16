import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentUserProfile } from "../../redux/slices/employeeSlice.js";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb.jsx";
import PageMeta from "../../Components/common/PageMeta.jsx";

const EmployeeIdCards = () => {
  const dispatch = useDispatch();
  const { employees, loading, error } = useSelector((state) => state.employee);
  const [card, setCard] = useState(null);
  console.log("card", card);

  useEffect(() => {
    dispatch(getCurrentUserProfile()).then((res) => {
      if (res.payload?.data) {
        setCard(res.payload.data);
      }
    });
  }, [dispatch]);

  const getInitials = (name) => {
    if (!name) return "NA";
    const initials = name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
    return initials || "NA";
  };

  if (loading) {
    return <p className="p-6 text-slate-500">Loading...</p>;
  }

  return (
    <div className="w-full mt-4 sm:mt-0">
      <div className="hidden sm:flex sm:justify-end smitems-center">
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "My ID Card", link: "/employee-id-card" },
          ]}
        />
        <PageMeta title="My ID Card" description="View Your ID Card" />
      </div>
      <div className="p-8 bg-white shadow-md rounded-2xl min-h-screen">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8 sm:mb-10 tracking-tight">
          My ID Card
        </h2>

        {error && (
          <p className="mb-4 text-red-600 font-medium bg-red-100 p-2 rounded">
            {error}
          </p>
        )}

        {card ? (
          <div className="flex flex-col items-center">
            <div
              id="id-card"
              className="shadow-2xl bg-white relative sm:w-[340px] w-[256px] sm:h-[530px] h-[400px] bg-center bg-contain bg-no-repeat"
              style={{ backgroundImage: "url(/assets/IDCardTemplate.png)" }}
            >
              <div className="absolute sm:top-[114.5px] top-[19%] left-1/2 -translate-x-1/2">
                <div className="w-[130px] h-[130px] rounded-full overflow-hidden relative flex items-center justify-center">
                  {card.photo_url ? (
                    <img
                      src={card.photo_url}
                      alt={`${card.full_name || "Employee"}'s profile`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none"; 
                        e.target.nextSibling.style.display = "flex"; 
                      }}
                    />
                  ) : null}
                  <div
                    className="absolute inset-0 flex items-center justify-center text-slate-700 text-5xl font-bold tracking-wider"
                    style={{ display: card.photo_url ? "none" : "flex" }}
                  >
                    {getInitials(card.full_name)}
                  </div>
                </div>
              </div>

              <div className="absolute sm:top-[51%] top-[50%] left-0 right-0 sm:px-8 px-5">
                <div className="text-center sm:mb-4 mb-3">
                  <h2 className="sm:text-lg md:text-xl text-md font-bold text-blue-900 mb-1">
                    {card.full_name || "Unknown"}
                  </h2>
                  <p className="text-gray-600 text-xs sm:text-md font-medium">
                    {card.designation_name || "N/A"}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="w-1/2 text-gray-700 sm:text-md text-xs font-medium">
                      ID No
                    </span>
                    <span className="w-1/2 text-blue-900 sm:text-md text-xs font-medium">
                      : {card.employee_id || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="w-1/2 text-gray-700 sm:text-md text-xs font-medium">
                      Blood Group
                    </span>
                    <span className="w-1/2 text-blue-900 sm:text-md text-xs font-medium">
                      : {card.blood_group || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="w-1/2 text-gray-700 sm:text-md text-xs font-medium">
                      Mobile Number
                    </span>
                    <span className="w-1/2 text-blue-900 sm:text-md text-xs font-medium">
                      : {card.emergency_phone || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="sm:mt-5 mt-3 flex justify-center">
                  <div>
                    <img
                      src="/assets/barcode.png"
                      alt="Barcode"
                      className="sm:h-6 h-5 sm:w-40 w-30 object-contain"
                    />
                    <p className="text-center text-[8px] sm:text-[10px] text-gray-600">
                      {card.employee_id || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          !error && <p className="text-slate-500">No ID card available.</p>
        )}
      </div>
    </div>
  );
};

export default EmployeeIdCards;