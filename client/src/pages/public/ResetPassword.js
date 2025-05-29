import React, { useState } from "react";
import { Button } from "../../components";
import { useParams } from "react-router-dom";
import { apiResetPassword } from "../../apis";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const { token } = useParams();
  const handleResetPassword = async () => {
    const response = await apiResetPassword({ password, token });
    if (response.success) {
        toast.success(response.mes, {
          position: toast.POSITION.TOP_RIGHT,
        })
      } else {
        toast.error(response.mes, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
  };
  return (
    <div>
      <div className="absolute top-0 left-0 bottom-0 right-0 bg-white py-8 flex flex-col items-center z-50 ">
        <div className="flex flex-col gap-4">
          <label htmlFor="password">Enter your new password:</label>
          <input
            type="text"
            id="password"
            className="w-[800px] pb-2 border-b outline-none placeholder:text-sm"
            placeholder="Type here."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <div className="flex items-center justify-end w-full gap-4">
            <Button
              name="Submit"
              handleOnClick={handleResetPassword}
              style="px-4 py-2 my-2 rounded-md text-white bg-blue-500 text-seminold"
            ></Button>
          </div>
        </div>
      </div>
      <ToastContainer autoClose={1200} />
    </div>
  );
};

export default ResetPassword;
