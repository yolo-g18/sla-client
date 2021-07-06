import Link from "next/link";
import { Link as Link2, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

interface Props {
  //boolean to always open ddm (for presentation)
  forceOpen?: boolean;
  label?: string;
  withDivider?: boolean;
  icon?: JSX.Element;
  items: DDMItem[];
  withBackground?: boolean;
  username?: string;
}

export interface DDMItem {
  icon?: JSX.Element;
  label: string;
  desc?: string;
  link?: string;
}

let useClickOutside = (handler: any) => {
  let domNode: any = useRef();

  useEffect(() => {
    let maybeHandler = (event: any) => {
      if (!domNode.current.contains(event.target)) {
        handler();
      }
    };

    document.addEventListener("mousedown", maybeHandler);

    return () => {
      document.removeEventListener("mousedown", maybeHandler);
    };
  });

  return domNode;
};

const DropDownMenu = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  let domNode = useClickOutside(() => {
    setIsOpen(false);
  });

  return (
    <div ref={domNode} className="relative inline-block text-left">
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={` ${
            props.withBackground
              ? "border border-gray-300 bg-white dark:bg-gray-800 shadow-sm"
              : ""
          } flex items-center justify-center w-full rounded-md px-2 py-2 text-sm font-medium text-gray-700 dark:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-white`}
          id="options-menu"
        >
          {props.label}
          {props.icon}
          <svg
            width="20"
            height="20"
            className="px-1 text-gray-700"
            fill="currentColor"
            viewBox="0 0 1792 1792"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1408 704q0 26-19 45l-448 448q-19 19-45 19t-45-19l-448-448q-19-19-19-45t19-45 45-19h896q26 0 45 19t19 45z"></path>
          </svg>
        </button>
      </div>

      {(props.forceOpen || isOpen) && (
        <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
          <div
            className={`py-1 ${
              props.withDivider ? "divide-y divide-gray-100" : ""
            }`}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {props.username ? (
              <Link href="/me/profile">
                <div className="block lock px-4 py-2 text-sm text-gray-700 border-b-2  hover:text-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600">
                  <a href="">
                    <h5 className="text-gray-500">Signed in as</h5>
                    <span className="font-semibold">{props.username}</span>
                  </a>
                </div>
              </Link>
            ) : null}

            {props.items.map((item) => {
              return (
                <div>
                  <Link href={item.link ? item.link : ""}>
                    <a
                      key={item.label}
                      className={`${
                        item.icon ? "flex items-center" : "block"
                      } block px-4 py-1 font-medium text-sm text-gray-700 hover:bg-blue-500 hover:text-white dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600`}
                      role="menuitem"
                    >
                      {item.icon}

                      <span className="flex flex-col">
                        <span>{item.label}</span>
                        {item.desc && (
                          <span className="text-gray-400 text-xs">
                            {item.desc}
                          </span>
                        )}
                      </span>
                    </a>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
export default DropDownMenu;
