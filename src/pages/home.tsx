import Link from "next/link";
import AppLayout2 from "../components/layout/AppLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  IEventRes,
  IStudySetInfo2,
  IStudySetLearning,
  RootStore,
} from "../utils/TypeScript";
import { useEffect } from "react";
import { ALERT } from "../redux/types/alertType";
import { PARAMS } from "../common/params";
import { getAPI } from "../utils/FetchData";
import { useState } from "react";

import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import EventIcon from "@material-ui/icons/Event";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import dayjs from "dayjs";
import {
  convertTimeEvnLearn,
  convertTimeToMySQl,
  formatUTCToDate,
  getTimeInDay,
} from "../components/schedule/convertTime";
import { putEvent } from "../redux/actions/eventAction";
import router from "next/router";
import { eventHandleDispatch } from "../redux/actions/eventHandleAction";

const todayObj = dayjs();

const home = () => {
  const dispatch = useDispatch();
  const { auth, alert, event } = useSelector((state: RootStore) => state);

  const [numberOfSetsCreated, setNumberSetsCreated] = useState();
  const [numberOfSetsLearning, setNumberSetsLearning] = useState();

  const [list4StudySetLeaning, setList4StudySetLearning] = useState<
    IStudySetLearning[]
  >([]);
  const [list4StudySetCreated, setList4StudySetCreated] = useState<
    IStudySetInfo2[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await getAPI(
          `${PARAMS.ENDPOINT}event?from=${convertTimeToMySQl(
            todayObj.startOf("day")
          )}&to=${convertTimeToMySQl(todayObj.endOf("day"))}`
        );
        const listTemp: IEventRes[] = [...res.data];
        Promise.all(
          listTemp.map(async (item, index) => {
            if (item.isLearnEvent) {
              try {
                const res = await getAPI(
                  `${PARAMS.ENDPOINT}learn/learnByDate?studySet=${
                    item.description
                  }&date=${convertTimeEvnLearn(item.fromTime)}`
                );

                if (res.data.length) {
                  listTemp[index].isDone = false;
                } else listTemp[index].isDone = true;
              } catch (err) {
                console.log(err);
              }
            }
          })
        ).then(() => dispatch(putEvent(listTemp)));

        //get created sets
        const listSSCreatedRes = await getAPI(
          `${PARAMS.ENDPOINT}lib/ss/created?userId=${auth.userResponse?._id}`
        );
        setNumberSetsCreated(listSSCreatedRes.data.length);
        setList4StudySetCreated(listSSCreatedRes.data.slice(0, 6));

        //get learning sets
        const listSSLearningRes = await getAPI(
          `${PARAMS.ENDPOINT}lib/ss/learning`
        );
        setNumberSetsLearning(listSSLearningRes.data.length);
        setList4StudySetLearning(listSSLearningRes.data.slice(0, 6));

        dispatch({ type: ALERT, payload: { loading: false } });
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
      }
    };
    fetchData();
  }, [auth.userResponse?._id]);

  // useEffect(() => {
  //   if (!auth.userResponse?._id) return;
  //   const fetchSetsData = async () => {
  //     //list 6 ss created
  //     dispatch({ type: ALERT, payload: { loading: true } });
  //     try {
  //       const listSSCreatedRes = await getAPI(
  //         `${PARAMS.ENDPOINT}lib/ss/created?userId=${auth.userResponse?._id}`
  //       );
  //       setNumberSetsCreated(listSSCreatedRes.data.length);
  //       setList4StudySetCreated(listSSCreatedRes.data.slice(0, 6));
  //     } catch (err) {
  //       dispatch({ type: ALERT, payload: { loading: false } });
  //       console.log(err);
  //     }
  //     //list 6 studyset learning
  //     try {
  //       const listSSLearningRes = await getAPI(
  //         `${PARAMS.ENDPOINT}lib/ss/learning`
  //       );
  //       setNumberSetsLearning(listSSLearningRes.data.length);
  //       setList4StudySetLearning(listSSLearningRes.data.slice(0, 6));
  //       dispatch({ type: ALERT, payload: { loading: false } });
  //     } catch (err) {
  //       dispatch({ type: ALERT, payload: { loading: false } });
  //       console.log(err);
  //     }

  //     //
  //   };

  //   fetchSetsData();
  // }, [auth.userResponse?._id]);

  const viewEventhandle = (evn: IEventRes) => {
    dispatch(eventHandleDispatch({ typeAction: 2, currentEvn: evn }));
    router.push("/schedule");
  };

  const [dateNow, setDateNow] = useState(new Date());

  console.log(alert.loading);

  return (
    <div>
      <AppLayout2 title="home" desc="home">
        {alert.loading === false ? (
          <div className=" pb-24 items-center mx-auto md:w-5/6 w-full mb-44">
            <div className="grid lg:grid-cols-7 grid-cols-1 mt-12">
              <div className="col-span-2 px-2 ">
                <div className="flex flex-col">
                  <div className="relative w-44 h-2 bg-blue-600 mb-2"></div>
                  <p className="text-lg font-bold text-blue-600">
                    Today's Task ({event?.length})
                  </p>
                </div>
                <div className="mb-6">
                  <div className="rounded-md w-full mb-6">
                    <p className="text-gray-800 text-md font-medium mb-4">
                      {event.length
                        ? formatUTCToDate(new Date())
                        : `No task at ${formatUTCToDate(new Date())}`}
                    </p>
                    {event.slice(0, 5).map((evn, index) => {
                      return (
                        <article
                          key={index}
                          className={`cursor-pointer rounded-md flex text-gray-700 mb-4 
        focus:outline-none bg-white p-4 shadow-md hover:shadow-lg duration-150 hover:border-b-2 `}
                        >
                          <span className="flex-none pr-2 my-auto">
                            <div>
                              {evn.isLearnEvent ? (
                                <img
                                  src="draft.svg"
                                  className="h-6 w-6 my-auto mx-auto"
                                  alt=""
                                />
                              ) : (
                                <EventIcon />
                              )}
                            </div>
                          </span>
                          <div className="w-full pr-16">
                            <header className="mb-1 text-sm w-full">
                              {evn.isLearnEvent ? (
                                <div
                                  className="flex justify-start w-full"
                                  onClick={() => viewEventhandle(evn)}
                                >
                                  <FiberManualRecordIcon
                                    className={`text-${evn.color?.toLowerCase()}-600 -mt-0.5 mr-1`}
                                    style={{ width: "12px" }}
                                  />
                                  <div
                                    className={`font-semibold ${
                                      evn.isDone
                                        ? "text-gray-400 "
                                        : "text-gray-800"
                                    } hover:text-gray-800 hover:underline flex truncate`}
                                  >
                                    <p className="truncate">{evn.name} </p>
                                  </div>
                                  {evn.isDone ? (
                                    <CheckCircleIcon
                                      className="text-blue-600 ml-2"
                                      fontSize="small"
                                    />
                                  ) : null}
                                </div>
                              ) : (
                                <div
                                  className="flex justify-start w-full"
                                  onClick={() => viewEventhandle(evn)}
                                >
                                  <FiberManualRecordIcon
                                    className={`text-${evn.color?.toLowerCase()}-600 -mt-0.5 mr-1`}
                                    style={{ width: "12px" }}
                                  />
                                  <div
                                    className={`font-semibold hover:underline
                              ${
                                new Date(evn.toTime) < dateNow
                                  ? " text-gray-400 line-through"
                                  : "text-gray-800"
                              } flex truncate`}
                                  >
                                    <p className="truncate">{evn.name} </p>
                                  </div>
                                </div>
                              )}
                            </header>
                            <footer className="text-gray-500 mt-2 text-sm">
                              {evn.isLearnEvent ? null : (
                                <p>
                                  {getTimeInDay(evn.fromTime)} -{" "}
                                  {getTimeInDay(evn.toTime)}
                                </p>
                              )}
                            </footer>
                          </div>
                        </article>
                      );
                    })}
                    <Link href="/schedule">
                      <p className="text-sm text-gray-600 hover:underline cursor-pointer hover:text-gray-800">
                        Show more <ChevronRightIcon fontSize="small" />
                      </p>
                    </Link>
                  </div>
                </div>
              </div>
              {numberOfSetsCreated === 0 &&
              numberOfSetsLearning === 0 &&
              alert.loading === false &&
              !numberOfSetsCreated &&
              !numberOfSetsLearning ? (
                <div className="text-center col-span-5 px-2 mx-auto">
                  <p className="text-3xl font-semibold text-gray-700">
                    You have no sets yet
                  </p>
                  <p className="text-md text-gray-600">
                    Sets you create or study will be displayed here.
                  </p>
                  <div className="mt-4 text-center">
                    <Link href="/set/add">
                      <button
                        type="button"
                        className="w-44 text-md rounded-sm px-4 mx-2 py-2
        text-md font-bold bg-blue-500 hover:bg-blue-600 
     text-white focus:outline-none"
                      >
                        Create a new set
                      </button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="col-span-5 px-2">
                  {!numberOfSetsLearning ? null : (
                    <div>
                      <div className="flex justify-between">
                        <div className="flex flex-col">
                          <div className="relative w-44 h-2 bg-blue-600 mb-2"></div>
                          <p className="text-lg font-bold text-blue-600">
                            Learning ({numberOfSetsLearning})
                          </p>{" "}
                        </div>
                        <div className="flex flex-col">
                          <Link
                            href={`/${auth.userResponse?.username}/library/sets?color=WHITE&search_query=`}
                          >
                            <p className="text-sm text-gray-600 hover:underline cursor-pointer hover:text-gray-800">
                              Show more <ChevronRightIcon fontSize="small" />
                            </p>
                          </Link>{" "}
                        </div>
                      </div>
                      <div className=" grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4 w-full my-4">
                        {list4StudySetLeaning.map((set, index) => {
                          return (
                            <div key={index} className="col-span-1">
                              <div
                                className="flex-col col-span-1 rounded-md my-4 bg-white 
        hover:border-gray-300 hover:shadow-lg duration-150 cursor-pointer shadow-md border-b-2 border-gray-200 p-4"
                              >
                                <div className=" w-full flex flex-row mb-2">
                                  <div className="w-full flex justify-between my-auto">
                                    <Link href={`/set/${set.studySetId}`}>
                                      <p className="text-gray-800 dark:text-white text-xl font-medium truncate hover:underline">
                                        {set.color ? (
                                          <FiberManualRecordIcon
                                            className={`py-1 text-${set.color.toLowerCase()}-500`}
                                          />
                                        ) : null}
                                        {set.studySetName}
                                      </p>
                                    </Link>
                                  </div>
                                </div>
                                <div className="mb-4 h-20 text-sm">
                                  {set.ssDescription.length <= 100 ? (
                                    <p className="text-gray-500">
                                      {set.ssDescription}
                                    </p>
                                  ) : (
                                    <p className="text-gray-500">
                                      {set.ssDescription.substring(0, 150)}...
                                    </p>
                                  )}
                                </div>
                                <div className="flex justify-between">
                                  <div>
                                    <div>
                                      <p className="text-blue-500 font-medium text-sm">
                                        Progress:{" "}
                                        {Math.round(set.progress * 100)}%
                                      </p>
                                    </div>
                                    <div className="font-semibold text-gray-500">
                                      <p>{set.numberOfCards} cards</p>
                                    </div>
                                  </div>
                                  <Link
                                    href={`/${set.owner}/library/sets?color=WHITE&search_query=`}
                                  >
                                    <div className="flex">
                                      <img
                                        className="w-5 h-5 my-auto rounded-full object-cover object-center"
                                        src={`${
                                          set.creatorAvatar
                                            ? set.creatorAvatar
                                            : "../../user.svg"
                                        }`}
                                        alt="Avatar Upload"
                                      />
                                      <p className="my-auto ml-2">
                                        <span className="text-gray-600 font-medium text-md hover:underline">
                                          {set.owner}
                                        </span>
                                      </p>
                                    </div>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <hr />
                  {/* ss created */}
                  {!numberOfSetsCreated ? null : (
                    <div className="mt-6">
                      <div className="flex justify-between mb-2">
                        <div className="flex flex-col">
                          <div className="relative w-44 h-2 bg-blue-600 mb-2"></div>
                          <p className="text-lg font-bold text-blue-600">
                            Created ({numberOfSetsCreated})
                          </p>{" "}
                        </div>
                      </div>
                      <div className=" grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4">
                        {list4StudySetCreated.map((set, index) => {
                          return (
                            <div className=" col-span-1" key={index}>
                              <div
                                className="flex-col col-span-1 rounded-md my-4 bg-white 
        hover:border-gray-300 hover:shadow-lg duration-150 cursor-pointer shadow-md border-b-2 border-gray-200 p-4"
                              >
                                <div className=" w-full flex flex-row mb-2">
                                  <div className="w-full flex justify-between my-auto">
                                    <Link href={`/set/${set.id}`}>
                                      <p className="text-gray-800 dark:text-white text-xl font-medium truncate hover:underline">
                                        {set.title}
                                      </p>
                                    </Link>
                                  </div>
                                </div>
                                <div className="mb-4 h-20 text-sm">
                                  {set.description.length <= 150 ? (
                                    <p className="text-gray-500">
                                      {set.description}
                                    </p>
                                  ) : (
                                    <p className="text-gray-500">
                                      {set.description.substring(0, 150)}...
                                    </p>
                                  )}
                                </div>
                                <div className="flex justify-between">
                                  <div className=" mt-1 font-semibold text-gray-500">
                                    <p>{set.numberOfCards} cards</p>
                                  </div>
                                  <div>
                                    <Link
                                      href={`/${set.creator}/library/sets?color=WHITE&search_query=`}
                                    >
                                      <div className="flex">
                                        <img
                                          className="w-5 h-5 my-auto rounded-full object-cover object-center"
                                          src={`${
                                            set.creatorAvatar
                                              ? set.creatorAvatar
                                              : "../../user.svg"
                                          }`}
                                          alt="Avatar Upload"
                                        />
                                        <p className="my-auto ml-2">
                                          <span className="text-gray-600 font-medium text-md hover:underline">
                                            {set.creator}
                                          </span>
                                        </p>
                                      </div>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed 
            inset-0 z-50 backdrop-filter backdrop-blur-md -mt-96"
          >
            <div className="h-screen w-full absolute flex items-center justify-center bg-modal">
              <div className="flex justify-center items-center space-x-1 text-sm text-gray-700">
                <svg
                  fill="none"
                  className="w-6 h-6 animate-spin"
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    d="M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z"
                    fill="currentColor"
                    fillRule="evenodd"
                  />
                </svg>
                <div>Loading ...</div>
              </div>
            </div>
          </div>
        )}
      </AppLayout2>
    </div>
  );
};

export default home;
