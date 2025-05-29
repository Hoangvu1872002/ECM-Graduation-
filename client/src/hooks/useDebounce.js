import React, { useEffect, useState } from "react";

const useDebounce = (value, ms) => {
  const [decounceValue, setDecounceValve] = useState();
  useEffect(() => {
    const setTimeOutID = setTimeout(() => {
      setDecounceValve(value);
    }, ms);
    return () => {
      clearTimeout(setTimeOutID)
    }
  }, [value, ms]);
  return decounceValue;
};

export default useDebounce;
