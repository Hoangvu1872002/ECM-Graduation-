import React, { useCallback, useEffect, useState } from "react";
import { InputField, Button, Loading } from "../../components";
import { apiForgotPassword, apiLogin, apiRegister } from "../../apis";
import Swal from "sweetalert2";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import path from "../../ultils/path";
import { useDispatch } from "react-redux";
import { login } from "../../store/users/userSlide";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { validate } from "../../ultils/helper";
import { showModal } from "../../store/app/appSlice";
import { getCurrent } from "../../store/users/asyncAction";

const Login = () => {
  const dispath = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [payload, setPayLoad] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    mobile: "",
    // address: "",
  });
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const resetPayload = () => {
    setPayLoad({
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      mobile: "",
      // address: "",
    });
  };
  const [email, setEmail] = useState("");
  const [invaliFields, setInvaliFields] = useState([]);
  const handleForgetPassword = async () => {
    const response = await apiForgotPassword({ email });
    if (response.success) {
      toast.success(response.mes, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      toast.error(response.mes, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  useEffect(() => {}, [isRegister]);

  const handleSubmit = useCallback(async () => {
    const { firstname, lastname, mobile, address, ...data } = payload;

    const invalids = isRegister
      ? validate(payload, setInvaliFields)
      : validate(data, setInvaliFields);

    if (invalids === 0) {
      if (isRegister) {
        dispath(
          showModal({ isShowModal: true, modalChildren: <Loading></Loading> })
        );
        const response = await apiRegister(payload);
        dispath(showModal({ isShowModal: false, modalChildren: null }));
        if (response.success) {
          Swal.fire("Congratulation!", response.mes, "success").then(() => {
            setIsRegister(false);
            resetPayload();
          });
        } else {
          Swal.fire("Oops!", response.mes, "error");
        }
      } else {
        const rs = await apiLogin(data);
        if (rs.success) {
          dispath(
            login({
              isLoggedIn: true,
              token: rs.accessToken,
              userData: rs.userData,
            })
          );

          if (rs.userData.role === "admin") {
            navigate(`/admin/dashboard`);
          } else {
            searchParams.get("redirect")
              ? navigate(searchParams.get("redirect"))
              : navigate(`/${path.HOME}`);
          }
        } else {
          Swal.fire("Oops!", rs.mes, "error");
        }
      }
    }
  }, [payload, isRegister]);
  return (
    <div className="w-screen h-screen relative bg-slate-300">
      {isForgotPassword && (
        <div className="absolute animate-slide-right top-0 left-0 bottom-0 right-0 bg-white py-8 flex flex-col items-center z-50 ">
          <div className="flex flex-col gap-4">
            <label htmlFor="email">Enter your email:</label>
            <input
              type="text"
              id="email"
              className="w-[800px] pb-2 border-b outline-none placeholder:text-sm"
              placeholder="Exp:email@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
            <div className="flex items-center justify-end w-full gap-4">
              <Button
                name="Submit"
                handleOnClick={handleForgetPassword}
                style="px-4 py-2 my-2 rounded-md text-white bg-blue-500 text-seminold"
              ></Button>
              <Button
                name="Back"
                handleOnClick={() => setIsForgotPassword(false)}
              ></Button>
            </div>
          </div>
        </div>
      )}
      {/* <img
        src="https://www.shutterstock.com/shutterstock/videos/1107990943/thumb/1.jpg?ip=x480"
        alt=""
        className="w-full h-full object-cover"
      ></img> */}
      <div className="absolute top-0 bottom-0 left-0 right-1/2 items-center justify-center flex">
        <div className="p-8 bg-white flex flex-col items-center rounded-md min-w-[500px]">
          <h1 className="text-[28px] font-semibold text-main mb-8">
            {isRegister ? "Register" : "Login"}
          </h1>
          {isRegister && (
            <div className="flex items-center gap-2">
              <InputField
                value={payload.firstname}
                setValue={setPayLoad}
                nameKey="firstname"
                invaliFields={invaliFields}
                setInvaliFields={setInvaliFields}
                fullWidth
              ></InputField>
              <InputField
                value={payload.lastname}
                setValue={setPayLoad}
                nameKey="lastname"
                invaliFields={invaliFields}
                setInvaliFields={setInvaliFields}
                fullWidth
              ></InputField>
            </div>
          )}
          <InputField
            value={payload.email}
            setValue={setPayLoad}
            nameKey="email"
            invaliFields={invaliFields}
            setInvaliFields={setInvaliFields}
            fullWidth
          ></InputField>
          {isRegister && (
            <InputField
              value={payload.mobile}
              setValue={setPayLoad}
              nameKey="mobile"
              invaliFields={invaliFields}
              setInvaliFields={setInvaliFields}
              fullWidth
            ></InputField>
          )}
          {/* {isRegister && (
            <InputField
              value={payload.address}
              setValue={setPayLoad}
              nameKey="address"
              invaliFields={invaliFields}
              setInvaliFields={setInvaliFields}
              fullWidth
            ></InputField>
          )} */}
          <InputField
            value={payload.password}
            setValue={setPayLoad}
            nameKey="password"
            type="password"
            invaliFields={invaliFields}
            setInvaliFields={setInvaliFields}
            fullWidth
          ></InputField>
          <Button handleOnClick={handleSubmit} fw>
            {isRegister ? "Register" : "Login"}
          </Button>
          <div className="flex items-center justify-between my-2 w-full text-sm">
            {!isRegister && (
              <span
                onClick={() => setIsForgotPassword(true)}
                className="text-blue-500 hover: underline cursor-pointer"
              >
                Forgot your password.
              </span>
            )}
            {!isRegister && (
              <span
                className="text-blue-500 hover: underline cursor-pointer"
                onClick={() => {
                  setIsRegister(true);
                  resetPayload();
                }}
              >
                Create Account.
              </span>
            )}
            {isRegister && (
              <span
                className="text-blue-500 hover: underline cursor-pointer w-full text-center"
                onClick={() => {
                  setIsRegister(false);
                  resetPayload();
                }}
              >
                Go to login.
              </span>
            )}
          </div>
          <Link
            className="text-blue-500 hover:underline cursor-pointer text-sm"
            to={`/${path.HOME}`}
          >
            Go home.
          </Link>
        </div>
      </div>
      <ToastContainer autoClose={1200} />
    </div>
  );
};

export default Login;
