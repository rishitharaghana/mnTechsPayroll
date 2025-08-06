// SaveButton.jsx
import React from 'react';
import { Save } from 'lucide-react';

const SaveButton = ({ onSave }) => {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <button
        onClick={onSave}
        className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Save Changes"
      >
        <Save size={18} />
        <span>Save Changes</span>
      </button>
    </div>
  );
};

export default SaveButton;