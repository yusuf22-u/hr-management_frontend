// Modal.js
import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
  <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-4 my-8 p-6 relative">
    <button
      onClick={onClose}
      className="absolute top-4 right-4 text-red-500 hover:text-red-700 font-semibold"
    >
      ✕
    </button>
    {children}
  </div>
</div>

  );
};

export default Modal;
