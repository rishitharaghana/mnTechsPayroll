import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ViewIdCard = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const idCards = [
    {
      id: 1,
      employee: 'Thambi Prasanth Annam',
      empId: 'MO-EMP-008',
      designation: 'Digital Marketing Executive',
      bloodGroup: 'B+ve',
      mobile: '+91 9347 105 985',
      photo: 'placeholder',
    },
    {
      id: 2,
      employee: 'Jane Doe',
      empId: 'MO-EMP-009',
      designation: 'UI/UX Designer',
      bloodGroup: 'A+ve',
      mobile: '+91 9876 543 210',
      photo: 'placeholder',
    },
  ];

  const card = idCards.find((c) => c.id === parseInt(id));

  if (!card) {
    return <p className="p-6 text-slate-500">ID Card not found.</p>;
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <button
        onClick={() => navigate('/idcard')}
        className="mb-6 bg-slate-700 text-white px-4 py-2 rounded-lg shadow-md hover:bg-slate-800 transition duration-300"
      >
        Back to List
      </button>
      <div
        className="bg-white border border-slate-200 rounded-xl shadow-lg p-6 relative w-full max-w-md mx-auto transform transition-all duration-300 hover:shadow-xl"
        style={{ height: '500px' }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-teal-800 to-teal-400 rounded-xl opacity-10 z-0"></div>
        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          <div className="w-32 h-32 bg-slate-200 rounded-full overflow-hidden border-4 border-white shadow-md">
            {card.photo === 'placeholder' ? (
              <span className="text-slate-500 text-lg">Photo</span>
            ) : (
              <img
                src={card.photo}
                alt="Employee"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900">{card.employee}</h2>
            <p className="text-slate-600 text-base">
              <span className="font-medium">Designation:</span> {card.designation}
            </p>
            <p className="text-slate-600 text-base">
              <span className="font-medium">ID No:</span> {card.empId}
            </p>
            <p className="text-slate-600 text-base">
              <span className="font-medium">Blood Group:</span> {card.bloodGroup}
            </p>
            <p className="text-slate-600 text-base">
              <span className="font-medium">Mobile:</span> {card.mobile}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewIdCard;