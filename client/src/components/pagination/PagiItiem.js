import React, { memo, useEffect } from "react";
import clsx from "clsx";
import {
  createSearchParams,
  useNavigate,
  useParams,
  useSearchParams,
  useLocation
} from "react-router-dom";

const PagiItiem = ({ children }) => {
  const [params] = useSearchParams();
  const { category } = useParams();
  const location = useLocation()

  const navigate = useNavigate();

  const handlePagination = () => {
    // let param = [];
    // for (let i of params.entries()) param.push(i);
    // const queries = {};
    // for (let i of param) queries[i[0]] = i[1];
    const queries = Object.fromEntries([...params])
    if (Number(children)) queries.page = children;
    navigate({
      pathname: location.pathname,
      search: createSearchParams(queries).toString(),
    });
  };
  return (
    <div
      className={clsx(
        `w-10 h-10 flex justify-center `,
        !Number(children) && "items-end pb-2",
        Number(children) && "items-center hover:shadow-md hover:rounded-full hover:bg-gray-300",
        +params.get("page") === +children && "rounded-full bg-gray-300",
        !+params.get("page") && +children === 1 && "rounded-full bg-gray-300"
      )}
      onClick={handlePagination}
      type="button"
      disabled={!Number(children)}
    >
      {children}
    </div>
  );
};

export default memo(PagiItiem);
