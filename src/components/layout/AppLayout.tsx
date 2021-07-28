import Link from "next/link";
import { useEffect, useState } from "react";
import Ddm from "../ddm/DropDownMenu";
import Meta from "../site/Meta";

import { FormSubmit, RootStore } from "../../utils/TypeScript";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getUserProfile } from "../../redux/actions/authAction";
import { ddmItemsAdd, menuitem } from "../../common/listCommon";
import link from "next/link";
import { putSearchKeyword } from "../../redux/actions/searchAction";

interface Props {
  title: string;
  desc: string;
  children: React.ReactNode;
  search?: string;
}

const AppLayout = (props: Props) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [isOpenSidebar, setOpenSidebar] = useState(true);
  const { auth, alert, search } = useSelector((state: RootStore) => state);

  const [searchValue, setSearchValue] = useState<string>(
    props.search ? props.search : ""
  );

  useEffect(() => {
    if (localStorage.getItem("access-token")) {
      dispatch(getUserProfile());
    } else {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    if (search.keyword) setSearchValue(search.keyword);
  }, [search.keyword]);

  const handleOnClick = () => {
    setOpenSidebar(!isOpenSidebar);
  };

  const handelSearchSubmit = (e: FormSubmit) => {
    e.preventDefault();

    console.log(searchValue);
    if (searchValue.length > 0)
      dispatch(
        putSearchKeyword(
          searchValue,
          search.type ? search.type : 0,
          search.searchBy ? search.searchBy : 0
        )
      );
  };

  return (
    <div>
      <Meta pageTitle={props.title} description={props.desc} />
      <main className="flex flex-col bg-pink-600 overflow-hidden relative">
        <header className=" z-40 top-0 sticky h-20 sm:h-16 bg-white flex items-center shadow-sm border-b-2">
          {auth.userResponse ? (
            <div className="w-full mx-auto px-4 flex items-center justify-between">
              <div className="  text-gray-700 dark:text-white  flex items-center">
                <Link href="/home">
                  <a href="" className="text-2xl font-bold ml-3">
                    SLA
                  </a>
                </Link>
                <form onSubmit={handelSearchSubmit}>
                  <div className="relative text-gray-600 ml-6">
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
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                  </div>
                </form>

                <div className="px-6 relative">
                  {/* create new drop down menu */}
                  <Ddm
                    icon={
                      <svg
                        width="20px"
                        height="20px"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 4V20M4 12L20 12"
                          stroke="#001A72"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    }
                    withBackground={false}
                    forceOpen={false}
                    items={ddmItemsAdd.map((item) => {
                      return { label: item.label, link: item.link };
                    })}
                  />
                </div>
              </div>
              <div className="flex items-center font-semibold">
                <nav className=" text-gray-700 dark:text-white text-sm lg:flex items-center hidden">
                  <Link href="/home">
                    <a
                      className={`py-2 px-4 flex hover:text-black ${
                        router.pathname.indexOf("/home") !== -1
                          ? "justify-start border-b-2 border-yellow-500"
                          : ""
                      }`}
                    >
                      HOME
                    </a>
                  </Link>
                  <Link href="/schedule">
                    <a
                      className={`py-2 px-4 flex hover:text-black ${
                        router.pathname.indexOf("/schedule") !== -1
                          ? "justify-start border-b-2 border-yellow-500"
                          : ""
                      }`}
                    >
                      SCHEDULE
                    </a>
                  </Link>
                  <Link
                    href={{
                      pathname: "/[username]/library/sets",
                      query: { username: auth.userResponse.username },
                    }}
                  >
                    <a
                      className={`py-2 px-4 flex hover:text-black ${
                        router.pathname.indexOf("/library") !== -1
                          ? "justify-start border-b-2 border-yellow-500"
                          : ""
                      }`}
                    >
                      LIBRARY
                    </a>
                  </Link>
                  <Link href="/activity">
                    <a
                      className={`py-2 px-4 flex hover:text-black ${
                        router.pathname.indexOf("/activity") !== -1
                          ? "justify-start border-b-2 border-yellow-500"
                          : ""
                      }`}
                    >
                      ACTIVITY
                    </a>
                  </Link>
                  <Link href="/explore">
                    <a
                      className={`py-2 px-4 flex hover:text-black ${
                        router.pathname.indexOf("/explore") !== -1
                          ? "justify-start border-b-2 border-yellow-500"
                          : ""
                      }`}
                    >
                      EXPLORE
                    </a>
                  </Link>
                  <div className="flex ml-12 pl-4">
                    <div className="ml-3 relative">
                      <button className="flex p-2 items-center bg-white  text-gray-400 hover:text-gray-700 text-md">
                        <svg
                          width="20"
                          height="20"
                          className="text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 1792 1792"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M912 1696q0-16-16-16-59 0-101.5-42.5t-42.5-101.5q0-16-16-16t-16 16q0 73 51.5 124.5t124.5 51.5q16 0 16-16zm816-288q0 52-38 90t-90 38h-448q0 106-75 181t-181 75-181-75-75-181h-448q-52 0-90-38t-38-90q50-42 91-88t85-119.5 74.5-158.5 50-206 19.5-260q0-152 117-282.5t307-158.5q-8-19-8-39 0-40 28-68t68-28 68 28 28 68q0 20-8 39 190 28 307 158.5t117 282.5q0 139 19.5 260t50 206 74.5 158.5 85 119.5 91 88z"></path>
                        </svg>
                        <div className="bg-red-500 w-2 h-2 rounded-full right-1 top-1 absolute"></div>
                      </button>
                    </div>
                    <div className="px-0 relative">
                      <Ddm
                        icon={
                          <svg
                            width="20"
                            fill="currentColor"
                            height="20"
                            className="text-gray-800"
                            viewBox="0 0 1792 1792"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M1523 1339q-22-155-87.5-257.5t-184.5-118.5q-67 74-159.5 115.5t-195.5 41.5-195.5-41.5-159.5-115.5q-119 16-184.5 118.5t-87.5 257.5q106 150 271 237.5t356 87.5 356-87.5 271-237.5zm-243-699q0-159-112.5-271.5t-271.5-112.5-271.5 112.5-112.5 271.5 112.5 271.5 271.5 112.5 271.5-112.5 112.5-271.5zm512 256q0 182-71 347.5t-190.5 286-285.5 191.5-349 71q-182 0-348-71t-286-191-191-286-71-348 71-348 191-286 286-191 348-71 348 71 286 191 191 286 71 348z" />
                          </svg>
                        }
                        withBackground={false}
                        forceOpen={false}
                        items={menuitem.map((item) => {
                          return { label: item.label, link: item.link };
                        })}
                        username={auth.userResponse?.username}
                      />
                    </div>
                  </div>
                </nav>
                <button
                  className="lg:hidden flex flex-col ml-4"
                  onClick={handleOnClick}
                >
                  <span className="w-6 h-1 bg-gray-800 dark:bg-white mb-1" />
                  <span className="w-6 h-1 bg-gray-800 dark:bg-white mb-1" />
                  <span className="w-6 h-1 bg-gray-800 dark:bg-white mb-1" />
                </button>
              </div>
            </div>
          ) : (
            <div className="container mx-auto px-6 flex items-center justify-between">
              <div className="text-gray-700 dark:text-white flex items-center">
                <Link href="/home">
                  <a href="" className="text-2xl font-bold ml-3">
                    SLA
                  </a>
                </Link>
                <div className="relative text-gray-600 ml-6">
                  <svg
                    className="absolute left-0 mt-2.5 w-4 h-4 ml-4 text-gray-500 pointer-events-none fill-current group-hover:text-gray-400 sm:block"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                  </svg>
                  <input
                    type="text"
                    className="block w-full py-1.5 pl-10 pr-4 leading-normal rounded-md focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gray-200 ring-opacity-90 bg-gray-100 dark:bg-gray-800 text-gray-400 aa-input"
                    placeholder="Search"
                  />
                </div>
              </div>
              <div className="flex items-center font-semibold">
                <nav className=" text-gray-700 dark:text-white text-sm lg:flex items-center hidden">
                  <div className="flex ml-12 pl-4">
                    <div className="ml-3 relative">
                      <Link href="/auth/login">
                        <button className="flex p-2 items-center bg-white  text-gray-400 hover:text-gray-700 text-md">
                          Login
                        </button>
                      </Link>
                    </div>
                    <div className="px-0 ml-4 relative">
                      <Link href="/auth/register">
                        <button className="flex p-2 items-center bg-green-500  text-white rounded-lg hover:text-gray-100 text-md">
                          Sign up
                        </button>
                      </Link>
                    </div>
                  </div>
                </nav>
                <button
                  className="lg:hidden flex flex-col ml-4"
                  onClick={handleOnClick}
                >
                  <span className="w-6 h-1 bg-gray-800 dark:bg-white mb-1" />
                  <span className="w-6 h-1 bg-gray-800 dark:bg-white mb-1" />
                  <span className="w-6 h-1 bg-gray-800 dark:bg-white mb-1" />
                </button>
              </div>
            </div>
          )}
        </header>
        <div className="bg-gray-100 flex flex-col items-center justify-between w-full">
          {props.children}
        </div>
        <div className="w-full">
          <footer className="px-3 py-8 bg-white dark:bg-gray-800 text-2 text-gray-500 dark:text-gray-200 transition-colors duration-200">
            <div className="flex flex-col">
              <div className="md:hidden mt-7 mx-auto w-11 h-px rounded-full" />
              <div className="mt-4 md:mt-0 flex flex-col md:flex-row">
                <nav className="flex-1 flex flex-col items-center justify-center md:items-end md:border-r border-gray-100 md:pr-5">
                  <a
                    aria-current="page"
                    href="#"
                    className="hover:text-gray-700 dark:hover:text-white"
                  >
                    Components
                  </a>
                  <a
                    aria-current="page"
                    href="#"
                    className="hover:text-gray-700 dark:hover:text-white"
                  >
                    Contacts
                  </a>
                  <a
                    aria-current="page"
                    href="#"
                    className="hover:text-gray-700 dark:hover:text-white"
                  >
                    Customization
                  </a>
                </nav>
                <div className="md:hidden mt-4 mx-auto w-11 h-px rounded-full" />
                <div className="mt-4 md:mt-0 flex-1 flex items-center justify-center md:border-r border-gray-100">
                  <a
                    className="hover:text-primary-gray-20"
                    href="https://github.com/Charlie85270/tail-kit"
                  >
                    <span className="sr-only">View on GitHub</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={30}
                      height={30}
                      fill="currentColor"
                      className="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200"
                      viewBox="0 0 1792 1792"
                    >
                      <path d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 .5-76.5t.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 88.5t.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zm-477 1103q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zm31 34q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zm30 45q9-7 0-19-8-13-17-6-9 5 0 18t17 7zm42 42q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zm57 25q3-11-13-16-15-4-19 7t13 15q15 6 19-6zm63 5q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zm58-10q-2-11-18-9-16 3-14 15t18 8 14-14z" />
                    </svg>
                  </a>
                  <a className="ml-4 hover:text-primary-gray-20" href="#">
                    <span className="sr-only">Settings</span>
                    <svg
                      width={30}
                      height={30}
                      fill="currentColor"
                      className="text-xl hover:text-gray-800 dark:hover:text-white transition-colors duration-200"
                      viewBox="0 0 2048 1792"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M960 896q0-106-75-181t-181-75-181 75-75 181 75 181 181 75 181-75 75-181zm768 512q0-52-38-90t-90-38-90 38-38 90q0 53 37.5 90.5t90.5 37.5 90.5-37.5 37.5-90.5zm0-1024q0-52-38-90t-90-38-90 38-38 90q0 53 37.5 90.5t90.5 37.5 90.5-37.5 37.5-90.5zm-384 421v185q0 10-7 19.5t-16 10.5l-155 24q-11 35-32 76 34 48 90 115 7 11 7 20 0 12-7 19-23 30-82.5 89.5t-78.5 59.5q-11 0-21-7l-115-90q-37 19-77 31-11 108-23 155-7 24-30 24h-186q-11 0-20-7.5t-10-17.5l-23-153q-34-10-75-31l-118 89q-7 7-20 7-11 0-21-8-144-133-144-160 0-9 7-19 10-14 41-53t47-61q-23-44-35-82l-152-24q-10-1-17-9.5t-7-19.5v-185q0-10 7-19.5t16-10.5l155-24q11-35 32-76-34-48-90-115-7-11-7-20 0-12 7-20 22-30 82-89t79-59q11 0 21 7l115 90q34-18 77-32 11-108 23-154 7-24 30-24h186q11 0 20 7.5t10 17.5l23 153q34 10 75 31l118-89q8-7 20-7 11 0 21 8 144 133 144 160 0 8-7 19-12 16-42 54t-45 60q23 48 34 82l152 23q10 2 17 10.5t7 19.5zm640 533v140q0 16-149 31-12 27-30 52 51 113 51 138 0 4-4 7-122 71-124 71-8 0-46-47t-52-68q-20 2-30 2t-30-2q-14 21-52 68t-46 47q-2 0-124-71-4-3-4-7 0-25 51-138-18-25-30-52-149-15-149-31v-140q0-16 149-31 13-29 30-52-51-113-51-138 0-4 4-7 4-2 35-20t59-34 30-16q8 0 46 46.5t52 67.5q20-2 30-2t30 2q51-71 92-112l6-2q4 0 124 70 4 3 4 7 0 25-51 138 17 23 30 52 149 15 149 31zm0-1024v140q0 16-149 31-12 27-30 52 51 113 51 138 0 4-4 7-122 71-124 71-8 0-46-47t-52-68q-20 2-30 2t-30-2q-14 21-52 68t-46 47q-2 0-124-71-4-3-4-7 0-25 51-138-18-25-30-52-149-15-149-31v-140q0-16 149-31 13-29 30-52-51-113-51-138 0-4 4-7 4-2 35-20t59-34 30-16q8 0 46 46.5t52 67.5q20-2 30-2t30 2q51-71 92-112l6-2q4 0 124 70 4 3 4 7 0 25-51 138 17 23 30 52 149 15 149 31z" />
                    </svg>
                  </a>
                </div>
                <div className="md:hidden mt-4 mx-auto w-11 h-px rounded-full " />
                <div className="mt-7 md:mt-0 flex-1 flex flex-col items-center justify-center md:items-start md:pl-5">
                  <span>© 2021</span>
                  <span className="mt-7 md:mt-1">
                    Created by
                    <a
                      className="underline hover:text-primary-gray-20"
                      href="https://www.linkedin.com/in/crabiller/"
                    >
                      Charlie
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
