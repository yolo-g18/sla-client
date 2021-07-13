import { useRouter } from "next/router";
import AppLayout from "./AppLayout";
import { IUser, RootStore } from "../../utils/TypeScript";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { useEffect, useState } from "react";
import SelectBox from "../ddm/SelectBox";
import { itemsFoldersFilter, itemsSetsFilter } from "../../common/listCommon";

import DomainIcon from "@material-ui/icons/Domain";
import RoomIcon from "@material-ui/icons/Room";
import ClassIcon from "@material-ui/icons/Class";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import WorkOutlineIcon from "@material-ui/icons/WorkOutline";
import { getUserByUsername } from "../../redux/actions/userAction";

interface Props {
  children: React.ReactNode;
}

const LibraryLayout = (props: Props) => {
  const { auth, alert, user } = useSelector((state: RootStore) => state);
  const dispatch = useDispatch();

  const router = useRouter();
  const {
    query: { username },
  } = router;

  //call api get user profile by username de lay ra fullname, address, email, school, job de hien thi
  useEffect(() => {
    dispatch(getUserByUsername(`${username}`));
  }, [username]);

  console.log("dasbdhasb");

  return (
    <div>
      <AppLayout title={`${username} | SLA`} desc="library">
        {/* <h1 className="text-4xl pl-12 pt-6 font-semibold text-gray-800 dark:text-white">
          Library
        </h1> */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8 overflow-auto h-screen mt-8">
          <div className=" col-span-1">
            <div className="flex flex-col justify-between items-center pt-10">
              <svg
                width="200"
                fill="currentColor"
                height="200"
                className="text-gray-800"
                viewBox="0 0 1792 1792"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M1523 1339q-22-155-87.5-257.5t-184.5-118.5q-67 74-159.5 115.5t-195.5 41.5-195.5-41.5-159.5-115.5q-119 16-184.5 118.5t-87.5 257.5q106 150 271 237.5t356 87.5 356-87.5 271-237.5zm-243-699q0-159-112.5-271.5t-271.5-112.5-271.5 112.5-112.5 271.5 112.5 271.5 271.5 112.5 271.5-112.5 112.5-271.5zm512 256q0 182-71 347.5t-190.5 286-285.5 191.5-349 71q-182 0-348-71t-286-191-191-286-71-348 71-348 191-286 286-191 348-71 348 71 286 191 191 286 71 348z" />
              </svg>
              <div className=" px-2 w-3/4 justify-between">
                <p className=" mt-4">
                  <span className="w-full text-2xl font-medium">
                    {user.firstname} {user.lastname}
                  </span>
                  <br />
                  <span className="text-md font-mono text-gray-700">
                    {user.username}
                  </span>
                </p>
                <p className="text-left mt-4">
                  <span className="">{user.bio}</span>
                </p>
                <p className="text-left mt-4 text-sm">
                  {user.schoolName ? (
                    <DomainIcon
                      fontSize="small"
                      className="text-gray-600 -mt-1"
                    />
                  ) : null}{" "}
                  {user.schoolName}
                  <br />
                  {user.address ? (
                    <RoomIcon fontSize="small" className="text-gray-600" />
                  ) : null}{" "}
                  {user.address}
                  <br />
                  <span>
                    {user.major ? (
                      <ClassIcon fontSize="small" className="text-gray-600" />
                    ) : null}{" "}
                    {user.major}
                  </span>
                  <br />
                  <span>
                    {user.email ? (
                      <MailOutlineIcon
                        fontSize="small"
                        className="text-gray-600"
                      />
                    ) : null}{" "}
                    {user.email}
                  </span>
                  <br />
                  <span>
                    {user.job ? (
                      <WorkOutlineIcon
                        fontSize="small"
                        className="text-gray-600"
                      />
                    ) : null}{" "}
                    {user.job}
                  </span>
                </p>

                {user.username === auth.userResponse?.username ? (
                  <Link href="/me/profile">
                    <button className="w-full mt-8 text-center py-1 rounded-md text-gray-700 border-gray-300 border-2 hover:text-gray-900 hover:bg-gray-100 my-1 focus:outline-none">
                      Edit profile
                    </button>
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
          <div className=" col-span-3 ">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 border-b border-gray-200">
              <div className="col-span-1 grid grid-cols-3 gap-2 mt-4 justify-around text-md text-gray-600 cursor-pointe">
                <Link
                  href={{
                    pathname: "/[username]/library/sets",
                    query: { username: username },
                  }}
                >
                  <a
                    className={`col-span-1 py-4  flex flex-grow justify-center hover:text-gray-900 ${
                      router.pathname.indexOf("/sets") !== -1
                        ? "justify-start border-b-2 border-yellow-500"
                        : ""
                    }`}
                  >
                    Sets
                  </a>
                </Link>
                <Link
                  href={{
                    pathname: "/[username]/library/folders",
                    query: { username: username },
                  }}
                >
                  <a
                    className={`col-span-1 py-4 flex flex-grow justify-center hover:text-gray-900 ${
                      router.pathname.indexOf("/folders") !== -1
                        ? "justify-start border-b-2 border-yellow-500"
                        : ""
                    }`}
                  >
                    Folders
                  </a>
                </Link>
                <Link
                  href={{
                    pathname: "/[username]/library/rooms",
                    query: { username: username },
                  }}
                >
                  <a
                    className={`col-span-1 py-4 flex flex-grow justify-center hover:text-gray-900 ${
                      router.pathname.indexOf("/rooms") !== -1
                        ? "justify-start border-b-2 border-yellow-500"
                        : ""
                    }`}
                  >
                    Rooms
                  </a>
                </Link>
              </div>
              <div className="col-span-2 mt-4 flex justify-around text-md text-gray-600  cursor-pointer">
                <div className="text-gray-900 py-3 flex flex-grow">
                  {router.pathname.indexOf("/sets") !== -1 ? (
                    <SelectBox
                      items={itemsSetsFilter}
                      searchKeyWord=""
                      typeResult="sets"
                    />
                  ) : null}
                  {router.pathname.indexOf("/folders") !== -1 ? (
                    <SelectBox
                      items={itemsFoldersFilter}
                      searchKeyWord=""
                      typeResult="sets"
                    />
                  ) : null}
                </div>
                <div className="text-gray-900 py-3 flex relative">
                  <svg
                    className="absolute left-0 mt-2.5 w-4 h-4 ml-4 text-gray-500 pointer-events-none fill-current group-hover:text-gray-400 sm:block"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                  </svg>
                  <input
                    type="text"
                    className="block w-full py-1.5 pl-10 pr-4 leading-normal rounded-md focus:border-transparent focus:outline-none 
                    bg-gray-100 dark:bg-gray-800 text-gray-400"
                    placeholder="Search"
                  />
                </div>
                <div className="py-3 flex relative">
                  <button
                    className="w-32 h-8 text-md flex items-center justify-center rounded-md px-4 
                   text-sm font-medium py-1 bg-green-500 hover:bg-green-600
                text-white hover:bg-green-dark focus:outline-none"
                  >
                    add new
                  </button>
                </div>
              </div>
            </div>
            <div>{props.children}</div>
          </div>
        </div>
      </AppLayout>
    </div>
  );
};

export default LibraryLayout;
