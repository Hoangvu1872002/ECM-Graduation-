import React, { useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import path from "../../ultils/path";
import Swal from "sweetalert2";

const FinalRegister = () => {
  const { status } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (status === "falsed") {
      Swal.fire("Oops!", "Registration failed.", "error").then(() => {
        navigate(`/${path.LOGIN}`);
      });
    } else if (status === "success") {
        Swal.fire("Congratulation!", "Successful registration, please log in", "success").then(() => {
            navigate(`/${path.LOGIN}`);
          });
    }
  }, []);
  return <div className="h-screen w-screen bg-gray-100"></div>;
};

export default FinalRegister;
