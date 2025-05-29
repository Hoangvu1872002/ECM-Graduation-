import React, { memo } from "react";
import { Editor } from "@tinymce/tinymce-react";

const MarkdownEditor = ({
  label,
  value,
  changeValue,
  name,
  invalidFields,
  setInvalidFields,
  setIsFocusDescription,
}) => {
  return (
    <div className=" flex flex-col">
      <span className="font-medium mb-2 pl-[1px]">{label}:</span>
      <Editor
        apiKey="a5hschxqw4h9r5d7ghdbk7kqrljkrra1s8ct3m7vhk97a2ff"
        init={{
          height: 500,
          menubar: false,
          plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help wordcount",
          ],
          toolbar:
            "undo redo | formatselect | " +
            "bold italic backcolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
        onChange={(e) =>
          changeValue((prev) => ({ ...prev, [name]: e.target.getContent() }))
        }
        onFocus={() => {
          setInvalidFields && setInvalidFields([])
        }}
        
        initialValue={value}
      />
      {invalidFields?.some((e) => e.name === name) && (
        <small className="text-main text-sm">
          {invalidFields?.find((e) => e.name === name)?.mes}
        </small>
      )}
    </div>
  );
};

export default memo(MarkdownEditor);
