import React from "react";

const ModalComponent = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="relative w-full max-w-[80%] max-h-[100%] bg-gray-800 rounded-lg p-6 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl font-semibold"
        >
          &times;
        </button>

        {/* Title */}
        {title && <h2 className="text-xl font-bold text-white mb-4">{title}</h2>}

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[80vh]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalComponent;
