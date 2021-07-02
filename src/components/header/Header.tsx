import React, { useState } from "react";
import Link from "next/link";
import SideBar from "../sidebar/SideBar";

interface Props {
  username?: string;
}

const Header = (props: Props) => {
  const [isHideSideBar, setIsHideSideBar] = useState(false);
  console.log(isHideSideBar);

  return (
    <div>
      <div className="absolute">
        {!isHideSideBar ? <SideBar isHide={true} /> : null}
      </div>
      <header className="w-full shadow-lg bg-white dark:bg-gray-700 items-center h-16 rounded-2xl z-40">
        <div className="relative z-20 flex flex-col justify-center h-full px-3 mx-auto flex-center">
          <div className="relative items-center pl-1 flex w-full lg:max-w-68 sm:pr-2 sm:ml-0">
            <div className="container relative left-0 z-50 flex w-3/4 h-auto">
              <div className="relative flex items-center w-full lg:w-64 h-full group">
                <div className="block lg:hidden ml-0">
                  <button
                    className="flex p-2 items-center rounded-full bg-white shadow text-gray-500 text-md"
                    onClick={() => setIsHideSideBar(!isHideSideBar)}
                  >
                    <svg
                      width="20"
                      height="20"
                      className="text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 1792 1792"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M1664 1344v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45z"></path>
                    </svg>
                  </button>
                </div>

                <div className="relative mx-auto text-gray-600">
                  <svg
                    className="absolute left-0 mt-2.5 w-4 h-4 ml-4 text-gray-500 pointer-events-none fill-current group-hover:text-gray-400 sm:block"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                  </svg>
                  <input
                    type="text"
                    className="block w-full py-1.5 pl-10 pr-4 leading-normal rounded-2xl focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gray-200 ring-opacity-90 bg-gray-100 dark:bg-gray-800 text-gray-400 aa-input"
                    placeholder="Search"
                  />
                </div>
              </div>
            </div>
            <div className="relative p-1 flex items-center justify-end w-1/4 ml-5 mr-4 sm:mr-0 sm:right-auto">
              <a href="#" className="block relative">
                {/* <img
                  alt="profil"
                  src="/images/person/1.jpg"
                  className="mx-auto object-cover rounded-full h-10 w-10 "
                /> */}
                {props.username}
              </a>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};
export default Header;
