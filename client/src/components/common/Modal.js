import React, { memo } from "react";
import { useDispatch } from "react-redux";
import { showModal } from "../../store/app/appSlice";

const Modal = ({ children }) => {
  const dispatch = useDispatch();

  return (
    <div
      onClick={() =>
        dispatch(showModal({ isShowModal: false, modelChildren: null }))
      }
      className="fixed inset-0 z-[1000] bg-black bg-opacity-50 flex justify-center items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()} // Ngăn việc đóng modal khi click vào nội dung bên trong
        className=" p-6 max-w-[90%] max-h-[90%] overflow-auto"
      >
        {children}
      </div>
    </div>
  );
};

export default memo(Modal);
