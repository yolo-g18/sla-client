import React from "react";

interface Props {
  id?: string;
  placeholder: string;
  error?: string | undefined;
  label?: string;
  value?: string;
  setValue: (str: string) => void;
}

const InputArea = (props: Props) => {
  return (
    <div>
      <label
        htmlFor={props.id}
        className="text-gray-700 text-sm font-bold mb-2"
      >
        {props.label}{" "}
      </label>
      <textarea
        className="block border border-grey-light w-full p-2 rounded mb-1 focus:border-purple-400 text-sm"
        id={props.id}
        placeholder={props.placeholder}
        onChange={(e) => props.setValue(e.target.value)}
        value={props.value}
        rows={5}
        cols={40}
      />
      {props.error && (
        <>
          <small className="font-medium text-red-600">{props.error}</small>
        </>
      )}
    </div>
  );
};

export default InputArea;
