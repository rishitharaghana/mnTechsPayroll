import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const ViewIdCard = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const idCards = [
    {
      id: 1,
      employee: "THAMBI PRASANTH ANNAM",
      empId: "MO-EMP-008",
      designation: "Digital Marketing Executive",
      bloodGroup: "B+ve",
      mobile: "+91 9347 105 985",
      photo:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1",
    },
    {
      id: 2,
      employee: "JANE DOE SMITH",
      empId: "MO-EMP-009",
      designation: "UI/UX Designer",
      bloodGroup: "A+ve",
      mobile: "+91 9876 543 210",
      photo:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1",
    },
  ];

  const card = idCards.find((c) => c.id === parseInt(id));

  if (!card) {
    return <p className="p-6 text-slate-500">ID Card not found.</p>;
  }

  const MeetOwnerLogo = () => (
    <div className="flex flex-col items-center mb-4"></div>
  );

  return (
    <div className="p-6 pt-10 w-200 bg-white shadow-1xl rounded-xl min-h-screen">
      <h2 className="text-2xl font-bold text-slate-700 mb-5">ID Card</h2>
      <div className="flex justify-center">
        <div
          className="w-96 h-[600px] rounded-sm shadow-2xl overflow-hidden relative border border-gray-200 bg-cover bg-center"
          style={{
            backgroundImage: "url(/assets/IDCardTemplate.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 z-0" />

          {/* Header */}
          <div className="pt-6 pb-4 relative z-20">
            <MeetOwnerLogo />
          </div>

          {/* Employee Photo */}
          <div className="absolute top-32 left-1/2 transform -translate-x-1/2 z-30">
            <div className="w-37 h-37 rounded-full">
              <img
                src={card.photo}
                alt="Employee"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>

          {/* Employee Details */}
          <div className="absolute top-72 left-0 right-0 z-20 px-8">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-blue-900 mb-1 tracking-wider">
                {card.employee}
              </h2>
              <p className="text-gray-600 text-sm font-medium">
                {card.designation}
              </p>
            </div>

            <div className="space-y-4 text-left">
              <div className="flex justify-between items-center">
                <span className="w-1/2 text-gray-700 font-medium text-sm">
                  ID No
                </span>
                <span className="w-1/2 text-blue-900 font-bold text-sm">
                  : {card.empId}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="w-1/2 text-gray-700 font-medium text-sm">
                  Blood Group
                </span>
                <span className="w-1/2 text-blue-900 font-bold text-sm">
                  : {card.bloodGroup}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="w-1/2 text-gray-700 font-medium text-sm">
                  Mobile Number
                </span>
                <span className="w-1/2 text-blue-900 font-bold text-sm">
                  : {card.mobile}
                </span>
              </div>
            </div>

            {/* Barcode */}
            <div className="mt-7 flex justify-center">
              <div className="bg-white p-2 rounded">
                <img
                  src="/assets/barcode.png"
                  alt="Barcode"
                  className="h-6 w-40 object-contain"
                />
                <p className="text-center text-[8px] text-gray-600">
                  {card.empId}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-end">
        <button
          onClick={() => navigate("/idcard")}
          className="mb-6 bg-slate-700 mt-4 rounded-lg text-white px-6 py-2 shadow-md hover:bg-teal-700 transition duration-300 font-medium"
        >
          ← Back to List
        </button>
      </div>
    </div>
  );
};

export default ViewIdCard;
