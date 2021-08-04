import Link from "next/link";
import { useEffect, useState } from "react";
import Ddm from "../ddm/DropDownMenu";
import Meta from "../site/Meta";
import { FormSubmit, RootStore, INotification } from "../../utils/TypeScript";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getUserProfile } from "../../redux/actions/authAction";
import { ddmItemsAdd, menuitem } from "../../common/listCommon";
import link from "next/link";
import { putSearchKeyword } from "../../redux/actions/searchAction";
import React from "react";
import { getAPI, putAPI } from "../../utils/FetchData";
import { ALERT } from "../../redux/types/alertType";
import { PARAMS } from "../../common/params";
import { useClickOutside } from "../../hook/useClickOutside";
import AddIcon from "@material-ui/icons/Add";
import NotificationsIcon from "@material-ui/icons/Notifications";

interface Props {
  title: string;
  desc: string;
  children: React.ReactNode;
  search?: string;
}

const AppLayout = (props: Props) => {
  const router = useRouter();
  const dispatch = useDispatch();

  //click out side
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  let domNode = useClickOutside(() => {
    setIsMenuOpen(false);
  });

  const [isOpenSidebar, setOpenSidebar] = useState(true);
  const { auth, alert, search } = useSelector((state: RootStore) => state);

  const [isClickShowMore, setClickShowMore] = useState(false);

  const [notificationList, setNotificationList] = React.useState<
    INotification[]
  >([]);

  const [searchValue, setSearchValue] = useState<string>(
    props.search ? props.search : ""
  );

  const [getNotReadNewsNumber, setNotReadNewsNumber] =
    React.useState<Number>(0);

  const [getCurrentPage, setCurrentPage] = React.useState(0);

  React.useEffect(() => {
    async function excute() {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await getAPI(`${PARAMS.ENDPOINT}notify/get?page=${0}`);
        dispatch({ type: ALERT, payload: { loading: false } });
        setNotificationList(res.data.content);
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
      }
    }

    excute();
  }, [alert.success]);

  React.useEffect(() => {
    async function excute() {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await getAPI(
          `${PARAMS.ENDPOINT}notify/get?page=${getCurrentPage}`
        );
        dispatch({ type: ALERT, payload: { loading: false } });
        const temptNotificationList: INotification[] = [...notificationList];
        res.data.content.map((noti: INotification) => {
          temptNotificationList.push(noti);
        });
        setNotificationList(temptNotificationList);
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
      }
    }

    excute();
  }, [isClickShowMore]);

  React.useEffect(() => {
    async function excute() {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await getAPI(
          `${PARAMS.ENDPOINT}notify/getNotReadNewsNumber/${auth.userResponse?._id}`
        );
        setNotReadNewsNumber(res.data);
        dispatch({ type: ALERT, payload: { loading: false } });
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
      }
    }

    excute();
  }, [alert.success, auth.userResponse?._id]);

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
          searchValue.replace(/ /g, ""),
          search.type ? search.type : 0,
          search.searchBy ? search.searchBy : 0
        )
      );
  };

  function handleBellNotifications() {
    setIsMenuOpen(!isMenuOpen);
  }

  async function readNews(notiId: number) {
    const data = {
      notiId: notiId,
      userId: auth.userResponse?._id,
    };

    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      const res = await putAPI(`${PARAMS.ENDPOINT}notify/readNews`, data);

      dispatch({ type: ALERT, payload: { loading: false, success: "xxx" } });
    } catch (err) {
      dispatch({ type: ALERT, payload: { loading: false } });
    }
  }

  async function readAllNews() {
    const data = {
      userId: auth.userResponse?._id,
    };

    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      const res = await putAPI(`${PARAMS.ENDPOINT}notify/readAllNews`, data);

      dispatch({ type: ALERT, payload: { loading: false, success: "xxx" } });
    } catch (err) {
      dispatch({ type: ALERT, payload: { loading: false } });
    }
  }

  async function showMoreNotification() {
    setClickShowMore(true);
    setCurrentPage(getCurrentPage + 1);
  }

  const listNotification = notificationList.map((item) => {
    return (
      <li>
        <a
          onClick={() => readNews(item.id)}
          href={item.link}
          className="block hover:bg-gray-50 dark:hover:bg-gray-900"
        >
          <div className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <p className="text-md text-gray-700 dark:text-white md:truncate">
                {item.description}
              </p>
              <div className="ml-2 flex-shrink-0 flex">
                {item.read === false ? (
                  <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    new
                  </p>
                ) : null}
              </div>
            </div>
            <div className="mt-2 sm:flex sm:justify-between">
              <div className="sm:flex">
                <p className="flex items-center text-md font-light text-gray-500 dark:text-gray-300">
                  {item.createdTime}
                </p>
              </div>
            </div>
          </div>
        </a>
      </li>
    );
  });

  return (
    <div>
      <Meta pageTitle={props.title} description={props.desc} />
      <main
        className="flex flex-col  overflow-hidden relative min-h-screen "
        style={{ background: "#F3F4F5" }}
      >
        <header className=" z-40 top-0 sticky h-20 sm:h-16 flex items-center border-b-2 bg-blue-500">
          {auth.userResponse ? (
            <div className="w-full mx-auto px-4 flex items-center justify-between">
              <div className="   dark:text-white  flex items-center">
                <Link href="/home">
                  <a href="" className="text-2xl font-bold ml-3 text-white">
                    SLA
                  </a>
                </Link>
                <form onSubmit={handelSearchSubmit}>
                  <div className="relative text-gray-600 ml-6">
                    <svg
                      className="absolute left-0 mt-2.5 w-4 h-4 ml-4 text-white pointer-events-none fill-current group-hover:text-white sm:block"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                    </svg>
                    <input
                      type="text"
                      className="block w-full py-1.5 pl-10 pr-4 leading-normal rounded-sm focus:border-transparent 
                      focus:outline-none focus:ring-2 focus:ring-blue-200 ring-opacity-90 bg-blue-400 text-white placeholder-gray-200"
                      placeholder="Search"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                  </div>
                </form>

                <div className="px-6 relative">
                  {/* create new drop down menu */}
                  <Ddm
                    icon={<AddIcon className="text-white" />}
                    withBackground={false}
                    forceOpen={false}
                    items={ddmItemsAdd.map((item) => {
                      return { label: item.label, link: item.link };
                    })}
                  />
                </div>
              </div>
              <div className="flex items-center ">
                <nav className="text-md lg:flex items-center hidden">
                  <Link href="/home">
                    <a
                      className={`py-2 px-4 flex hover:underline  ${
                        router.pathname.indexOf("/home") !== -1
                          ? "text-white"
                          : "text-gray-200"
                      }`}
                    >
                      Home
                    </a>
                  </Link>
                  <Link href="/schedule">
                    <a
                      className={`py-2 px-4 flex hover:underline ${
                        router.pathname.indexOf("/schedule") !== -1
                          ? "text-white"
                          : "text-gray-200"
                      }`}
                    >
                      Schedule
                    </a>
                  </Link>
                  <Link
                    href={{
                      pathname: "/[username]/library/sets",
                      query: { username: auth.userResponse.username },
                    }}
                  >
                    <a
                      className={`py-2 px-4 flex hover:underline ${
                        router.pathname.indexOf("/library") !== -1
                          ? "text-white"
                          : "text-gray-200"
                      }`}
                    >
                      Library
                    </a>
                  </Link>
                  <Link href="/invitation">
                    <a
                      className={`py-2 px-4 hover:underline ${
                        router.pathname.indexOf("/invitation") !== -1
                          ? "text-white"
                          : "text-gray-200"
                      }`}
                    >
                      Invitation
                    </a>
                  </Link>
                  <div className="flex flex-row ml-12 pl-4 text-center">
                    <div className="ml-3 relative pb-1">
                      <div
                        className="relative inline-block text-left"
                        ref={domNode}
                      >
                        <div>
                          <button
                            onClick={() => handleBellNotifications()}
                            type="button"
                            className="text-md text-white text-4xl relative focus:outline-none "
                          >
                            {listNotification.length !== 0 ? (
                              getNotReadNewsNumber !== 0 ? (
                                <span className="w-2 h-2 rounded-full absolute left-6 top-2 leading text-xs bg-red-500"></span>
                              ) : null
                            ) : null}
                            <NotificationsIcon />
                          </button>
                        </div>
                        {isMenuOpen ? (
                          <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white overflow-auto">
                            <div
                              id="notificationTable"
                              className="py-1 overflow-y-scroll h-96"
                              role="menu"
                              aria-orientation="vertical"
                              aria-labelledby="options-menu"
                            >
                              {listNotification.length !== 0 ? (
                                <p
                                  onClick={readAllNews}
                                  className="px-4 py-4 sm:px-6 text-right text-xs font-light text-blue-500 cursor-pointer hover:text-gray-600"
                                >
                                  Mark read all
                                </p>
                              ) : null}

                              <ul className="divide-y divide-gray-100">
                                {listNotification.length === 0 ? (
                                  <li>
                                    <div className="px-4 py-4 sm:px-6">
                                      <p className="text-center">
                                        You have no notification
                                      </p>
                                    </div>
                                  </li>
                                ) : (
                                  listNotification
                                )}
                              </ul>
                              {listNotification.length !== 0 ? (
                                <p
                                  onClick={showMoreNotification}
                                  className="px-4 py-4 sm:px-6 text-center text-xs font-light text-blue-500 cursor-pointer hover:text-gray-600"
                                >
                                  Show more
                                </p>
                              ) : null}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="px-0 my-auto">
                      <Ddm
                        icon={
                          <svg
                            width="20"
                            fill="white"
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
                  <span className="w-6 h-1 bg-white dark:bg-white mb-1" />
                  <span className="w-6 h-1 bg-white dark:bg-white mb-1" />
                  <span className="w-6 h-1 bg-white dark:bg-white mb-1" />
                </button>
              </div>
            </div>
          ) : (
            <div className="container mx-auto px-6 flex items-center justify-between">
              <div className="flex items-center">
                <Link href="/home">
                  <a href="" className="text-2xl font-bold ml-3 text-white">
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
                <nav className=" text-gray-700 dark:text-white text-md lg:flex items-center hidden">
                  <div className="flex ml-12 pl-4">
                    <div className="ml-3 relative">
                      <Link href="/auth/login">
                        <button className="flex p-2 items-center text-white hover:text-gray-200 text-md focus:outline-none">
                          Login
                        </button>
                      </Link>
                    </div>
                    <div className="px-0 ml-4 relative">
                      <Link href="/auth/register">
                        <button className="flex p-2 items-center bg-blue-500  text-white rounded-lg hover:text-gray-200 text-md focus:outline-none">
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
        <div
          className=" flex flex-col items-center justify-between w-full h-full"
          style={{ background: "#F3F4F5" }}
        >
          {props.children}
        </div>
        <footer
          style={{ background: "#F3F4F5" }}
          className="absolute bottom-0 w-full"
        >
          <div className="border-solid border-t">
            <div className="max-w-screen-lg mx-auto px-4  ">
              <section className="flex flex-col md:flex-row md:justify-between text-gray-700 font-light text-sm pt-4 pb-6 md:pt-5 md:pb-6 w-full">
                <div>
                  <p className="leading-8 tracking-wide">
                    © Group 18 Capstone Co., Hanoi, Vietnam
                  </p>
                </div>
                <div>
                  <p className="leading-8 tracking-wide">
                    {" "}
                    Smart learning assistant
                  </p>
                </div>
              </section>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default AppLayout;