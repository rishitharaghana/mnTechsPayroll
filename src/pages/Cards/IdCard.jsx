import React from 'react';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IdCard = () => {
  const navigate = useNavigate();

  const idCards = [
    {
      id: 1,
      employee: 'John Smith',
      empId: 'EMP001',
      designation: 'Software Engineer',
      photo: 'placeholder', // Placeholder for photo
    },
    {
      id: 2,
      employee: 'Jane Doe',
      empId: 'EMP002',
      designation: 'UI/UX Designer',
      photo: 'placeholder',
    },
    {
      id: 3,
      employee: 'John Smith',
      empId: 'EMP003',
      designation: 'Software Engineer',
      photo: 'placeholder',
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">ID Cards</h1>
          <p className="text-gray-500">Manage employee ID cards</p>
        </div>
        <button
          onClick={() => navigate('/idcard/idcard-form')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow-md transition"
        >
          Generate ID Card
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {idCards.length === 0 ? (
          <p className="text-gray-500 text-center col-span-full">No ID cards found.</p>
        ) : (
          idCards.map((card) => (
            <div
              key={card.id}
              className="bg-white border border-gray-200 rounded-lg shadow-md p-4 flex flex-col items-center w-full max-w-xs mx-auto"
            >
              <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 flex items-center justify-center text-gray-500">
                {card.photo === 'placeholder' ? 'Photo' : <img src={card.photo} alt="Employee" className="w-full h-full object-cover rounded-full" />}
              </div>
              <h2 className="text-lg font-semibold text-gray-800 text-center">{card.employee}</h2>
              <p className="text-gray-600 text-sm text-center">
                <strong>Employee ID:</strong> {card.empId}
              </p>
              <p className="text-gray-600 text-sm text-center mb-4">
                <strong>Designation:</strong> {card.designation}
              </p>
              <button
                onClick={() => navigate(`/idcard/${card.id}`)}
                className="w-full flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg transition"
              >
                <Eye size={18} className="mr-2" />
                View ID Card
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default IdCard;