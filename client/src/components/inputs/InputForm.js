import clsx from "clsx";
import React, { memo } from "react";

const InputForm = ({
  label,
  disabled,
  register,
  errors,
  id,
  validate,
  type = "text",
  placeholder,
  fullWith,
  value,
  style,
  onClick,
  readOnly,
}) => {
  return (
    <div className={clsx(`flex flex-col h-[78px] gap-2 rounded-md`, style)}>
      {label && (
        <label className="font-medium" htmlFor={id}>
          {label + ":"}
        </label>
      )}
      <input
        type={type}
        id={id}
        onClick={() => onClick && onClick()}
        {...(register ? register(id, validate) : {})} // Sử dụng register nếu có
        disabled={disabled}
        placeholder={placeholder}
        className={clsx(
          `form-input rounded-md my-auto max-h-[41.6px]`,
          fullWith && "w-full",
          style
        )}
        value={value} // Hiển thị giá trị từ props value
        readOnly={readOnly}
      ></input>
      {errors?.[id] && (
        <small className="text-xs text-red-500">{errors[id]?.message}</small>
      )}
    </div>
  );
};

export default memo(InputForm);
