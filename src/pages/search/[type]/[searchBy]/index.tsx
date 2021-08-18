import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchLayout from "../../../../components/layout/SearchLayout";
import { putSearchKeyword } from "../../../../redux/actions/searchAction";
import Link from "next/link";

import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import { ALERT } from "../../../../redux/types/alertType";
import { PARAMS } from "../../../../common/params";
import { getAPI } from "../../../../utils/FetchData";
import {
  IRoomResultSearch,
  ISSResultSearch,
  IUserResultSearch,
  RootStore,
} from "../../../../utils/TypeScript";

import _, { divide } from "lodash";
import {
  convertTime,
  formatDate,
} from "../../../../components/schedule/convertTime";

import FaceOutlinedIcon from "@material-ui/icons/FaceOutlined";

const index = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { search } = useSelector((state: RootStore) => state);
  const {
    query: { type, search_query, searchBy },
  } = router;

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [setsResult, setSetResult] = useState<ISSResultSearch[]>([]);
  const [userResult, setUserResult] = useState<IUserResultSearch[]>([]);
  const [roomResult, setRoomResult] = useState<IRoomResultSearch[]>([]);
  const [temp, setTemp] = useState<IUserResultSearch[]>([]);
  const [totalResult, setTotalResult] = useState(0);

  const handlePageChange = (type: string) => {
    if (type == "prev") setCurrentPage(currentPage - 1);
    if (type == "next") setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [type, searchBy, search_query]);

  useEffect(() => {
    const fetchData = async () => {
      if (type === "set") {
        try {
          dispatch({ type: ALERT, payload: { loading: true } });
          const setRes = await getAPI(
            `${
              PARAMS.ENDPOINT
            }search/studySet/${searchBy}/?keySearch=${search_query}&page=${
              currentPage - 1
            }&sort=createdDate,asc`
          );
          dispatch({ type: ALERT, payload: { loading: false } });
          console.log(JSON.stringify(setRes));

          setSetResult(setRes.data.content);
          setTotalPages(setRes.data.totalPages);
          setTotalResult(setRes.data.totalElements);
        } catch (err) {
          dispatch({ type: ALERT, payload: { loading: false } });
        }
      } else {
        try {
          dispatch({ type: ALERT, payload: { loading: true } });
          const res = await getAPI(
            `${PARAMS.ENDPOINT}search/${type}/?keySearch=${search_query}&page=${
              currentPage - 1
            }&sort=createdDate,asc`
          );
          dispatch({ type: ALERT, payload: { loading: false } });
          if (type === "user") {
            setUserResult(res.data.content);
            console.log(JSON.stringify(temp));
          } else {
            setRoomResult(res.data.content);
          }

          setTotalPages(res.data.totalPages);
          setTotalResult(res.data.totalElements);
        } catch (err) {
          dispatch({ type: ALERT, payload: { loading: false } });
        }
      }
    };
    fetchData();
  }, [type, search_query, searchBy, currentPage]);

  console.log("type " + type);
  console.log("search by  " + searchBy);
  console.log("key  " + search_query);

  const tagOnClickHandler = (tag: string) => {
    dispatch(putSearchKeyword(tag, 0, 1));
    console.log("tag name: " + tag);
  };

  return (
    <div>
      <SearchLayout>
        <div className="w-full relative min-h-screen">
          <div className="mt-4">
            <div className="flex justify-between">
              <p>
                {type === "set" ? "Sets" : type === "user" ? "Users" : "Rooms"}
              </p>
              <p>{totalResult} Results</p>
            </div>
            {type === "set" ? (
              setsResult.length === 0 ? (
                <div className="flex mt-12">
                  <p className="text-2xl font-bold mx-auto">
                    Sorry, we don’t have any content that matches your search.
                  </p>
                </div>
              ) : (
                setsResult.map((set, index) => {
                  return (
                    <div
                      key={index}
                      className="w-full mt-6 p-4 bg-white rounded-lg mb-4 shadow-md border-b-2 border-gray-200 hover:border-gray-300 hover:shadow-lg cursor-pointer"
                    >
                      <div className="flex justify-between w-full">
                        <Link href={`/set/${set.id}`}>
                          <p className="text-gray-800 dark:text-white text-xl font-medium truncate hover:underline">
                            {set.title}
                          </p>
                        </Link>
                        <Link href={`/${set.creator}/library/sets`}>
                          <div className="flex">
                            <img
                              className="w-6 h-6 my-auto rounded-full object-cover object-center"
                              src={`${
                                set.creatorAvatar
                                  ? set.creatorAvatar
                                  : "../../user.svg"
                              }`}
                              alt="Avatar Upload"
                            />
                            <p className="font-medium text-md hover:underline ml-2 my-auto">
                              {set.creator}
                            </p>
                          </div>
                        </Link>
                      </div>
                      <div>
                        <p className="text-sm font-normal text-gray-600 my-4">
                          {set.description}
                        </p>
                      </div>
                      <div className="flex flex-wrap">
                        {set.tag
                          ? _.split(set.tag, ", ").map((tg, index) => {
                              return (
                                <Link
                                  href={`/search/set/tag?search_query=${tg}`}
                                >
                                  <div
                                    key={index}
                                    className="my-1 mr-2 flex "
                                    onClick={() => tagOnClickHandler(tg)}
                                  >
                                    <span className="px-4 py-1 rounded-xl text-sm truncate bg-gray-200 text-blue-500 hover:underline cursor-pointer font-bold ">
                                      {tg}
                                    </span>
                                  </div>
                                </Link>
                              );
                            })
                          : null}
                        {}
                      </div>
                      <div className="flex flex-row text-gray-600 font-medium my-4">
                        <p>{set.numberOfCards} cards</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {set.first4Cards.slice(0, 2).map((card, index) => {
                          return (
                            <div
                              key={index}
                              className="rounded-md flex w-full my-4 relative"
                            >
                              <div className="flex justify-between w-full gap-3">
                                <div
                                  className=" w-1/2 rounded-md bg-gray-100 shadow-lg border-b-1 p-4  text-xs break-all"
                                  dangerouslySetInnerHTML={{
                                    __html: card.front ? card.front : "",
                                  }}
                                ></div>
                                <div
                                  className="card-overview w-1/2 rounded-md bg-gray-100 shadow-lg border-b-1 p-9  text-xs break-all"
                                  dangerouslySetInnerHTML={{
                                    __html: card.back ? card.back : "",
                                  }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )
            ) : type === "user" ? (
              userResult.length === 0 ? (
                <div className="flex mt-12">
                  <p className="text-2xl font-bold mx-auto">
                    Sorry, we don’t have any content that matches your search.
                  </p>
                </div>
              ) : (
                userResult.map((user, index) => {
                  return (
                    <div
                      className=" bg-white dark:bg-gray-800 mt-6 border-b-2 cursor-pointer
                                hover:border-gray-300 hover:shadow-lg rounded-lg shadow-md flex justify-between p-4"
                      key={index}
                    >
                      <div className="w-full">
                        <Link
                          href={{
                            pathname: "/[username]/library/sets",
                            query: { username: user.username },
                          }}
                        >
                          <div className="flex items-center p-4 justify-between">
                            <div>
                              <div className="flex">
                                <img
                                  className="w-12 h-12 my-auto rounded-full object-cover object-center"
                                  src={`${
                                    user.avatar ? user.avatar : "../../user.svg"
                                  }`}
                                  alt="Avatar Upload"
                                />
                                <p className="font-bold text-xl ml-4 my-auto">
                                  {user.username}
                                </p>
                              </div>
                              <div className="mt-2">
                                {user.bio ? (
                                  user.bio.length <= 80 ? (
                                    <p className="text-gray-500">{user.bio}</p>
                                  ) : (
                                    <p className="text-gray-500">
                                      {user.bio.substring(0, 80)}...
                                    </p>
                                  )
                                ) : null}
                              </div>
                            </div>
                            <div className="my-auto">
                              {user.numberStudySetOwn} sets
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  );
                })
              )
            ) : roomResult.length === 0 ? (
              <div className="flex mt-12">
                <p className="text-2xl font-bold mx-auto">
                  Sorry, we don’t have any content that matches your search.
                </p>
              </div>
            ) : (
              roomResult.map((room, index) => {
                return (
                  <div
                    className="bg-white dark:bg-gray-800 mt-6 border-b-2  
              hover:border-gray-300 hover:shadow-lg rounded-lg shadow-md flex justify-between"
                    key={index}
                  >
                    <div className="w-full">
                      <Link
                        href={{
                          pathname: "/room/[id]/library",
                          query: { id: room.id },
                        }}
                      >
                        <div className="cursor-pointer flex items-center p-4 justify-between">
                          <div className="">
                            <div className="font-medium dark:text-white flex">
                              {room.name}
                            </div>
                            <div>
                              {room.description ? (
                                room.description.length <= 80 ? (
                                  <p className="text-gray-500">
                                    {room.description}
                                  </p>
                                ) : (
                                  <p className="text-gray-500">
                                    {room.description.substring(0, 80)}...
                                  </p>
                                )
                              ) : null}
                            </div>
                            <div className="flex justify-between">
                              <div className="text-gray-600 text-sm ">
                                {room.numberOfMembers <= 1
                                  ? room.numberOfMembers + " member"
                                  : room.numberOfMembers + " members"}
                              </div>
                              <div className="text-gray-600 text-sm ml-4">
                                {room.numberOfStudySets + " sets"}
                              </div>
                            </div>
                          </div>
                          <div className="text-gray-600 text-xs">
                            {formatDate(
                              convertTime(
                                parseFloat(room.createdDate.toString()) * 1000
                              )
                            )}
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          {(setsResult.length === 0 && type === "set") ||
          (userResult.length === 0 && type === "user") ||
          (roomResult.length === 0 && type === "room") ? null : (
            <div className="flex flex-row justify-center items-center inset-x-0 absolute -bottom-20 mb-4">
              <button
                className={`${
                  currentPage <= 1
                    ? "text-gray-300"
                    : "hover:bg-blue-500 rounded-full hover:text-white transition duration-300 focus:outline-none"
                } focus:outline-none mx-4`}
                onClick={() => handlePageChange("prev")}
                disabled={currentPage <= 1}
              >
                <KeyboardArrowLeftIcon fontSize="large" />
              </button>
              <div>
                <p className="my-auto text-xl font-bold mx-4">{currentPage}</p>
              </div>
              <button
                className={`${
                  currentPage >= totalPages
                    ? "text-gray-300"
                    : "hover:bg-blue-500 rounded-full hover:text-white transition duration-300 focus:outline-none"
                } focus:outline-none mx-4`}
                onClick={() => handlePageChange("next")}
                disabled={currentPage >= totalPages}
              >
                <KeyboardArrowRightIcon fontSize="large" />
              </button>
            </div>
          )}
        </div>
      </SearchLayout>
    </div>
  );
};

export default index;
