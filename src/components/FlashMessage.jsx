// FlashMessage.js
import React from 'react';

const FlashMessage = ({ message, type, onClose }) => {
  return (
    <div className={`fixed top-0 right-0 m-4 p-4 rounded-lg shadow-lg ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
      {message}
      <button
        onClick={onClose}
        className="absolute top-1 right-1 text-lg font-bold"
      >
        &times;
      </button>
    </div>
  );
};

export default FlashMessage;
