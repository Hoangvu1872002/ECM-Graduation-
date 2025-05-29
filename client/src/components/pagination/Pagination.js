import React, { memo, useEffect } from "react";
import usePagination from "../../hooks/usePagination";
import PagiItiem from "./PagiItiem";
import { useSearchParams } from "react-router-dom";
import { limit } from "../../ultils/contants";

const Pagination = ({ totalCount, productNumber }) => {
  const [params] = useSearchParams();
  const pagination = usePagination(totalCount, +params.get("page") || 1);
  const range = () => {
    const currentPage = +params.get("page");
    const pageSize = limit || 10;
    const start = Math.min((currentPage - 1) * pageSize + 1, totalCount);
    const end = Math.min(currentPage * pageSize, totalCount);

    return `${start} - ${end}`;
  };
  return (
    <div className="flex justify-between w-full items-center mt-5">
      {!params.get("page") && (
        <span className="text-sm italic">{`Show items ${Math.min(
          totalCount,
          1
        )} - ${Math.min(limit, totalCount)} of ${totalCount}`}</span>
      )}
      {params.get("page") && (
        <span className="text-sm italic">{`Show items ${range()} of ${totalCount}`}</span>
      )}
      <div className="flex items-center">
        {pagination?.map((e, index) => (
          <PagiItiem key={index}>{e}</PagiItiem>
        ))}
      </div>
    </div>
  );
};

export default memo(Pagination);
