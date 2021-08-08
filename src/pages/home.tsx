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
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import CircularProgress, {
  CircularProgressProps,
} from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import dayjs from "dayjs";
import {
  convertTimeEvnLearn,
  convertTimeToMySQl,
  formatUTCToDate,
  getTimeInDay,
} from "../components/schedule/convertTime";
import { putEvent } from "../redux/actions/eventAction";
import { route } from "next/dist/next-server/server/router";
import router from "next/router";
import { eventHandleDispatch } from "../redux/actions/eventHandleAction";

const todayObj = dayjs();

const home = () => {
  const dispatch = useDispatch();
  const { auth, alert, event } = useSelector((state: RootStore) => state);

  const [numberOfSetsCreated, setNumberSetsCreated] = useState(0);
  const [numberOfSetsLearning, setNumberSetsLearning] = useState(0);

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
        listTemp.map(async (item, index) => {
          if (item.isLearnEvent) {
            try {
              const res = await getAPI(
                `${PARAMS.ENDPOINT}learn/learnByDate?studySet=${
                  item.description
                }&date=${convertTimeEvnLearn(item.fromTime)}`
              );
              dispatch({ type: ALERT, payload: { loading: false } });
              if (res.data.length) {
                listTemp[index].isDone = false;
              } else listTemp[index].isDone = true;
            } catch (err) {
              console.log(err);
            }
          }
        });
        if (!alert.loading) dispatch(putEvent(res.data));
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
      }
    };
    fetchData();
  }, []);

  const [list4StudySetLeaning, setList4StudySetLearning] = useState<
    IStudySetLearning[]
  >([]);
  const [list4StudySetCreated, setList4StudySetCreated] = useState<
    IStudySetInfo2[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      //list 6 ss created
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const listSSCreatedRes = await getAPI(
          `${PARAMS.ENDPOINT}lib/ss/created?userId=${auth.userResponse?._id}`
        );
        dispatch({ type: ALERT, payload: { loading: false } });
        setNumberSetsCreated(listSSCreatedRes.data.length);
        setList4StudySetCreated(listSSCreatedRes.data);

        console.log(JSON.stringify(listSSCreatedRes.data.slice(0, 6)));
      } catch (err) {
        console.log(err);
        dispatch({ type: ALERT, payload: { loading: false } });
      }

      //list 6 studyset learning
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const listSSLearningRes = await getAPI(
          `${PARAMS.ENDPOINT}lib/ss/learning`
        );
        dispatch({ type: ALERT, payload: { loading: false } });
        setNumberSetsLearning(listSSLearningRes.data.length);
        setList4StudySetLearning(listSSLearningRes.data.slice(0, 6));

        console.log(JSON.stringify(listSSLearningRes.data));
      } catch (err) {
        console.log(err);
        dispatch({ type: ALERT, payload: { loading: false } });
      }

      //
    };

    fetchData();
  }, [auth.userResponse?._id]);

  const viewEventhandle = (evn: IEventRes) => {
    dispatch(eventHandleDispatch({ typeAction: 2, currentEvn: evn }));
    router.push("/schedule");
  };

  if (numberOfSetsCreated === 0 && numberOfSetsLearning === 0) {
    return (
      <AppLayout2 title="home" desc="home">
        <div className="text-center mt-12">
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
                className="w-40 text-md rounded-sm px-4 mx-2 py-2
                      text-md font-bold bg-blue-500 hover:bg-blue-600 
                   text-white focus:outline-none"
              >
                Create a new set
              </button>
            </Link>
          </div>
        </div>
      </AppLayout2>
    );
  }

  return (
    <div>
      <AppLayout2 title="home" desc="home">
        <div className="pt-4 pb-24 items-center mx-auto w-5/6 mb-44">
          <div className="grid lg:grid-cols-7 grid-cols-1 mt-12">
            <div className="col-span-2 px-2 ">
              <div className="flex flex-col">
                <div className="relative w-44 h-2 bg-blue-600 mb-2"></div>
                <p className="text-lg font-bold text-blue-600">
                  Today Task ({event?.length})
                </p>
              </div>
              <div className="mb-6">
                <div className="rounded-md w-full p-4 overflow-auto mb-6">
                  <div className="w-full flex items-center justify-between">
                    <p className="text-gray-800 dark:text-white text-xl font-medium">
                      Calendar
                    </p>
                  </div>
                  <p className="text-gray-800 text-md font-medium mb-4 w-full">
                    {event.length
                      ? formatUTCToDate(event[0]?.fromTime)
                      : "No task at this day"}
                  </p>
                  {event.slice(0, 9).map((evn, index) => {
                    return (
                      <article
                        onClick={() => viewEventhandle(evn)}
                        key={index}
                        className={`cursor-pointer  rounded-md p-1 flex text-gray-700 mb-2 
                    focus:outline-none`}
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
                          <div
                            className={`bg-${evn.color?.toLowerCase()}-500 w-2 h-2 rounded-full mx-auto mt-2`}
                          ></div>
                        </span>
                        <div className="">
                          <header className="mb-1 text-sm truncate">
                            {evn.isLearnEvent ? (
                              <span
                                className={`font-semibold ${
                                  evn.isDone
                                    ? "text-gray-400 "
                                    : "text-gray-800"
                                }`}
                              >
                                {evn.name}{" "}
                                {evn.isDone ? (
                                  <CheckCircleIcon
                                    className="text-blue-600 ml-2"
                                    fontSize="small"
                                  />
                                ) : null}
                              </span>
                            ) : (
                              <span className="font-semibold truncate">
                                {evn.name}
                              </span>
                            )}
                          </header>
                          <p className="text-gray-600 text-sm">
                            {evn.isLearnEvent ? null : evn.description}
                          </p>
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
                </div>
              </div>
            </div>
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
                        href={{
                          pathname: "/[username]/library/sets",
                          query: { username: auth.userResponse?.username },
                        }}
                      >
                        <p className="text-sm text-gray-600 hover:underline cursor-pointer hover:text-gray-800">
                          Show more <ChevronRightIcon fontSize="small" />
                        </p>
                      </Link>{" "}
                    </div>
                  </div>
                  <div className=" grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4">
                    {list4StudySetLeaning.map((set, index) => {
                      return (
                        <div className="col-span-1 ">
                          <div
                            key={index}
                            className="grid grid-rows-5 flex-col col-span-1 rounded-md p-2 h-40 my-4 bg-white 
                          hover:border-gray-300 hover:shadow-lg cursor-pointer shadow-md border-b-2 border-gray-200"
                          >
                            <div className="row-span-1 w-full flex flex-row mb-2">
                              <div className="w-full">
                                <p className="text-gray-800 dark:text-white text-xl font-medium leading-none">
                                  <a
                                    href={`/set/${set.studySetId}`}
                                    className="hover:underline"
                                  >
                                    {set.studySetName.length <= 6
                                      ? set.studySetName
                                      : set.studySetName.substring(0, 6) +
                                        "..."}{" "}
                                  </a>
                                  {set.color ? (
                                    <FiberManualRecordIcon
                                      className={`text-${set.color?.toLowerCase()}-400`}
                                    />
                                  ) : null}
                                  <FiberManualRecordIcon
                                    className={`text-yellow-50-400`}
                                  />
                                  {"  "}
                                  <a href={`/${set.owner}/library/sets`}>
                                    <span className="text-gray-500 text-sm hover:underline">
                                      {set.owner}
                                    </span>
                                  </a>
                                </p>
                              </div>
                            </div>
                            <div className="row-span-3 mb-12">
                              {set.ssDescription.length <= 50 ? (
                                <p className="text-gray-500">
                                  {set.ssDescription}
                                </p>
                              ) : (
                                <p className="text-gray-500">
                                  {set.ssDescription.substring(0, 60)}...
                                </p>
                              )}
                            </div>
                            <div>
                              <p className="text-gray-500 text-sm">
                                Progress: {Math.round(set.progress * 100)}%
                              </p>
                            </div>

                            <div className="row-span-1 mt-1">
                              <p>{set.numberOfCards} cards</p>
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
                            className="grid grid-rows-5 flex-row col-span-1 rounded-md p-2 h-40 my-4 bg-white dark:bg-gray-800 
                        hover:border-gray-300 hover:shadow-lg cursor-pointer shadow-md border-b-2 border-gray-200"
                          >
                            <div className="row-span-1 w-full mb-2">
                              <div className="w-full">
                                <p className="text-gray-800 dark:text-white text-xl font-medium ">
                                  <a
                                    href={`/set/${set.id}`}
                                    className="hover:underline"
                                  >
                                    {set.title.length <= 6
                                      ? set.title
                                      : set.title.substring(0, 6) + "..."}{" "}
                                  </a>
                                  <a href={`/${set.creator}/library/sets`}>
                                    <span className="text-gray-500 text-sm hover:underline">
                                      {set.creator}
                                    </span>
                                  </a>
                                </p>
                              </div>
                            </div>
                            <div className="row-span-3 mb-12">
                              {set.description.length <= 50 ? (
                                <p className="text-gray-500">
                                  {set.description}
                                </p>
                              ) : (
                                <p className="text-gray-500">
                                  {set.description.substring(0, 50)}...
                                </p>
                              )}
                            </div>
                            <div className="row-span-1 mt-2">
                              <p>{set.numberOfCards} cards</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </AppLayout2>
    </div>
  );
};

export default home;
