import React from "react";
import classNames from "classnames";

interface InputGroupProps {
  type?: string;
  placeholder: string;
  error?: string | undefined;
  required?: true;
  label?: string;
  id?: string;
  value?: string;
  setValue: (str: string) => void;
}

const InputGroup: React.FC<InputGroupProps> = ({
  type,
  placeholder,
  error,
  required,
  setValue,
  label,
  id,
  value,
}) => {
  return (
    <div className="relative mb-4">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-gray-700 text-sm font-bold mb-2">
          {label}{" "}
          {required && <span className="text-red-500 required-dot">*</span>}
        </label>
        {}
      </div>

      <input
        type={type}
        id={id}
        className={classNames(
          "block border border-grey-light w-full p-2 rounded mb-1 focus:border-purple-400 text-sm",
          { "border-red-500": error }
        )}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        required={required}
        value={value}
      />
      {error && (
        <>
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            fill="currentColor"
            className="absolute text-red-500 right-2"
            viewBox="0 0 1792 1792"
          >
            <path d="M1024 1375v-190q0-14-9.5-23.5t-22.5-9.5h-192q-13 0-22.5 9.5t-9.5 23.5v190q0 14 9.5 23.5t22.5 9.5h192q13 0 22.5-9.5t9.5-23.5zm-2-374l18-459q0-12-10-19-13-11-24-11h-220q-11 0-24 11-10 7-10 21l17 457q0 10 10 16.5t24 6.5h185q14 0 23.5-6.5t10.5-16.5zm-14-934l768 1408q35 63-2 126-17 29-46.5 46t-63.5 17h-1536q-34 0-63.5-17t-46.5-46q-37-63-2-126l768-1408q17-31 47-49t65-18 65 18 47 49z" />
          </svg> */}

          <small className="font-medium text-red-600">{error}</small>
        </>
      )}
    </div>
  );
};

export default InputGroup;
