import React, { memo } from "react";

const InputSelect = ({ value, changeValue, options }) => {
  return (
    <select
      className="form-select text-xs text-gray-500 p-3 w-4/5 rounded-md"
      value={value}
      onChange={(e) => changeValue(e.target.value)}
    >
      <option value="null">Random</option>
      {options?.map((e) => (
        <option key={e.id} value={e.value}>
          {e.text}
        </option>
      ))}
    </select>
  );
};

export default memo(InputSelect);
