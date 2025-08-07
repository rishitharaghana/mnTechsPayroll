import React from 'react';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IdCard = () => {
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

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">ID Cards</h1>
          <p className="text-slate-500">Manage employee ID cards</p>
        </div>
        <button
          onClick={() => navigate('/idcard/idcard-form')}
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Generate ID Card
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {idCards.length === 0 ? (
          <p className="text-slate-500 text-center col-span-full">No ID cards found.</p>
        ) : (
          idCards.map((card) => (
            <div
              key={card.id}
              className="bg-white border border-slate-200 rounded-xl shadow-lg p-4 relative w-full max-w-xs mx-auto transform transition-all duration-300 hover:shadow-xl"
              style={{ height: '420px' }}
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-teal-800 to-teal-400 rounded-xl opacity-10 z-0"></div>
              <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                <div className="w-24 h-24 bg-slate-200 rounded-full overflow-hidden border-4 border-white shadow-md">
                  {card.photo === 'placeholder' ? (
                    <span className="text-slate-500 text-sm">Photo</span>
                  ) : (
                    <img
                      src={card.photo}
                      alt="Employee"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-slate-900">{card.employee}</h2>
                  <p className="text-slate-600 text-sm">
                    <span className="font-medium">Designation:</span> {card.designation}
                  </p>
                  <p className="text-slate-600 text-sm">
                    <span className="font-medium">ID No:</span> {card.empId}
                  </p>
                  <p className="text-slate-600 text-sm">
                    <span className="font-medium">Blood Group:</span> {card.bloodGroup}
                  </p>
                  <p className="text-slate-600 text-sm">
                    <span className="font-medium">Mobile:</span> {card.mobile}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/idcard/${card.id}`)}
                  className="w-full flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                >
                  <Eye size={18} className="mr-2" />
                  View ID Card
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default IdCard;