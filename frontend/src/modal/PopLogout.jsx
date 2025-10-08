import React from "react";

const PopLogout = ({ onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-999">
      <div className="bg-white w-100 flex flex-col justify-center h-40 p-10 rounded-2xl shadow-lg relative">
        <img
          src='/assets/icons/warningicon.png'
          alt="warning"
          className="bg-white rounded-full absolute top-[-30px] left-[160px] w-16 h-16 p-2 border-4 border-[#f9f7dc]"
        />
        <p className="text-center mb-4">Are you sure you want to logout?</p>
        <div className="flex justify-around gap-4">
          <button
            onClick={onCancel}
            className="text-[#000] p-3 px-6 bg-[#fef8e2] hover:bg-[#f9e394] active:bg-[#feaf31] active:text-white rounded-[10px]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="text-[#000] p-3 px-6 bg-[#fef8e2] hover:bg-[#f9e394] active:bg-[#feaf31] active:text-white rounded-[10px]"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopLogout;