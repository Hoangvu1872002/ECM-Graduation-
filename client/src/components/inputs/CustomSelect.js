import clsx from "clsx";
import React, { memo } from "react";
import Select from "react-select";
const CustomSelect = ({
  label,
  placeholder,
  onChange,
  options = [],
  value,
  classname,
  wrapClassname,
}) => {
  return (
    <div className={clsx(wrapClassname)}>
      {label && <h3 className="font-medium">{label}</h3>}
      <Select
        placeholder={placeholder}
        isClearable
        options={options}
        value={value}
        isSearchable
        onChange={onChange}
        formatGroupLabel={(option) => (
          <div className="flex text-gray-600 items-center w-full gap-2">
            <span>{option.label}</span>
          </div>
        )}
        className={{ control: () => clsx("border-2 py-[4px]", classname) }}
      ></Select>
    </div>
  );
};

export default memo(CustomSelect);
