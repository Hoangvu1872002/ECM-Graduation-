import React from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
const withBase = (Component) => (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  return (
    <Component
      {...props}
      navigate={navigate}
      location={location}
      dispatch={dispatch}
    ></Component>
  );
};

export default withBase;
