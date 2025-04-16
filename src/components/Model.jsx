// Modal.js
import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <button onClick={onClose} className="text-red-600 font-bold hover:text-red-800">
          Close
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
