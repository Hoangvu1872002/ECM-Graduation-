import clsx from "clsx";
import React, { memo } from "react";

const Select = ({
  label,
  options = [],
  register,
  errors,
  id,
  validate,
  style,
  fullwidth,
  defaultValue,
}) => {
  return (
    <div className={clsx(`flex flex-col gap-2 `, style)}>
      {label && <label className="font-medium" htmlFor={id}>{label}:</label>}
      <select
        className={clsx(`form-select h-[41.6px] max-h-[41.6px] rounded-md`, fullwidth && "w-full", style)}
        id={id}
        {...register(id, validate)}
        defaultValue={defaultValue}
      >
        <option value="">--CHOOSE--</option>
        {options?.map((e, index) => (
          <option key={index} value={e.value}>{e.value}</option>
        ))}
      </select>
      {errors[id] && (
        <small className="text-xs text-red-500">{errors[id]?.message}</small>
      )}
    </div>
  );
};

export default memo(Select);
