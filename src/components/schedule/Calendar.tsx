import dayjs from "dayjs";
import _, { stubFalse } from "lodash";
import Link from "next/link";

import { useEffect, useState } from "react";

import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import { IEventRes, RootStore } from "../../utils/TypeScript";
import { convertTime, convertTimeToMySQl } from "./convertTime";

import EditIcon from "@material-ui/icons/Edit";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import { useDispatch, useSelector } from "react-redux";
import { ALERT } from "../../redux/types/alertType";
import { PARAMS } from "../../common/params";
import { getAPI } from "../../utils/FetchData";

import TextField from "@material-ui/core/TextField";
import CloseIcon from "@material-ui/icons/Close";
import InputArea from "../input/InputArea";
import InputGroup from "../input/InputGroup";
import TocRoundedIcon from "@material-ui/icons/TocRounded";
import EventNoteRoundedIcon from "@material-ui/icons/EventNoteRounded";
import LocalOfferOutlinedIcon from "@material-ui/icons/LocalOfferOutlined";
import { useClickOutside } from "../../hook/useClickOutside";
import { putEvent } from "../../redux/actions/eventAction";

interface Props {}

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];
const todayObj = dayjs();

const Calendar = (props: Props) => {
  const dispatch = useDispatch();
  const { auth, alert, event } = useSelector((state: RootStore) => state);

  const [dayObj, setDayObj] = useState(dayjs());
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<IEventRes | any>({});
  const [caledarChange, setCalendarChange] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [fromTime, setFromTime] = useState();
  const [toTime, setToTime] = useState();
  const [isLearnEvent, setIsLearnEvent] = useState(false);
  const [eventColor, setEventColor] = useState("BLUE");
  const [listColors, setListColors] = useState<string[]>([]);

  //click out side
  let domNode = useClickOutside(() => {
    setShowModalEdit(false);
  });

  //to check number of event display each day
  const [weekDayOf1Evn, setWeekDayOf1Evn] = useState<
    { i: number; evn: number }[]
  >([]);
  const [dayInMonthtEvn, setDayInMonthtEvn] = useState<
    { i: number; evn: number }[]
  >([]);
  const [weekDayOfLastEvn, setWeekDayOfLastEvn] = useState<
    { i: number; evn: number }[]
  >([]);

  const [showModalColorPicker, setShowModalColorPicker] = useState(false);

  const [listEvent, setListEvent] = useState<IEventRes[]>([]);

  const thisYear = dayObj.year();
  const thisMonth = dayObj.month();
  const daysInMonth = dayObj.daysInMonth();

  const dayObjOf1 = dayjs(`${thisYear}-${thisMonth + 1}-1`);
  const weekDayOf1 = dayObjOf1.day();

  const dayObjOfLast = dayjs(`${thisYear}-${thisMonth + 1}-${daysInMonth}`);
  const weekDayOfLast = dayObjOfLast.day();

  const handlePrev = () => {
    setDayObj(dayObj.subtract(1, "month"));
    setCalendarChange(true);
    setWeekDayOf1Evn([]);
    setDayInMonthtEvn([]);
    setWeekDayOfLastEvn([]);
  };

  const handleNext = () => {
    setDayObj(dayObj.add(1, "month"));
    setCalendarChange(true);
    setWeekDayOf1Evn([]);
    setDayInMonthtEvn([]);
    setWeekDayOfLastEvn([]);
  };

  const jumToToday = () => {
    setDayObj(todayObj);
    setCalendarChange(true);
  };

  const showModalEditHandle = (evn: IEventRes) => {
    setShowModalEdit(true);
    setCurrentEvent(evn);
  };

  //get all event for calendar
  useEffect(() => {
    setWeekDayOf1Evn([]);
    setDayInMonthtEvn([]);
    setWeekDayOfLastEvn([]);
    setCalendarChange(false);
    const fetchData = async () => {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await getAPI(
          `${PARAMS.ENDPOINT}event?from=${convertTimeToMySQl(
            dayObjOf1.subtract(weekDayOf1, "day")
          )}&to=${convertTimeToMySQl(
            dayObjOfLast.add(_.range(6 - weekDayOfLast).length + 1, "day")
          )}`
        );
        dispatch({ type: ALERT, payload: { loading: false } });

        setListEvent(res.data);
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
      }
    };

    fetchData();
  }, [caledarChange]);

  //init color list
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await getAPI(`${PARAMS.ENDPOINT}folder/getColorFolder`);
        dispatch({ type: ALERT, payload: { loading: false } });
        setListColors(res.data);
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const setColorhandle = (color: string) => {
    setShowModalColorPicker(false);
    setEventColor(color);
  };

  const getDate = (day: any, month: any, year: any) => {
    return { day, month, year };
  };

  const [listEvnByDay, setListEvnByDay] = useState<IEventRes[]>([]);

  const showMoreHandle = (dateFrom: any, dateTo: any) => {
    console.log("from: " + convertTimeToMySQl(dateFrom));
    console.log("to: " + convertTimeToMySQl(dateTo));
    const fetchData = async () => {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await getAPI(
          `${PARAMS.ENDPOINT}event?from=${convertTimeToMySQl(
            dateFrom
          )}&to=${convertTimeToMySQl(dateTo)}`
        );
        dispatch({ type: ALERT, payload: { loading: false } });
        setListEvnByDay(res.data);
        console.log("by day: " + JSON.stringify(res.data));
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
      }
    };
    fetchData();
    dispatch(putEvent(listEvnByDay));
  };

  // const learnByDay = (id: string) => {
  //   console.log("id of ss: " + id);
  //   rou
  // };

  return (
    <div>
      <div className="mx-auto pt-2 pb-10 px-4">
        <div className="w-full flex items-cente justify-between">
          <div className="flex flex-wrap">
            <button
              onClick={handlePrev}
              className="text-gray-700 focus:outline-none hover:text-gray-400 rounded-md duration-300 "
            >
              <KeyboardArrowLeftIcon fontSize="default" />
            </button>
            <div>
              {" "}
              <button
                onClick={jumToToday}
                className="py-2 px-6 text-xs xl:text-base text-gray-900 dark:text-gray-100 focus:outline-none hover:text-gray-400"
              >
                Today
              </button>
            </div>
            <button
              onClick={handleNext}
              className="text-gray-700 focus:outline-none hover:text-gray-400 rounded-md duration-300 "
            >
              <KeyboardArrowRightIcon fontSize="default" />
            </button>
          </div>
          <div className="md:flex justify-center hidde">
            <div className="flex items-center ">
              <button>
                <p className="font-bold text-2xl">
                  {dayObj.format("MMM YYYY")}
                </p>
              </button>
            </div>
          </div>
        </div>
        <div className="w-full overflow-x-scroll xl:overflow-x-hidden duration-500">
          <div className="min-w-full bg-white dark:bg-gray-900">
            <div className="grid grid-cols-7">
              {weekDays.map((day, index) => {
                return (
                  <div className=" px-10 h-6 col-span-1 mx-auto" key={index}>
                    <p className="text-sm text-left text-gray-900 uppercase cursor-pointer">
                      {day}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="relative grid grid-cols-7 grid-rows-5 border-l border-gray-200">
              {_.range(weekDayOf1).map((i: number) => (
                <div className="relative">
                  <div
                    className={` h-36 col-span-1 border-r border-b border-gray-200 bg-gray-100 hover:bg-gray-200 cellDay
                    ${i === 0 || i === 6 ? "bg-indigo-50" : ""}
                  `}
                    key={i}
                  >
                    <div className="justify-between flex px-2">
                      <p
                        onClick={() =>
                          showMoreHandle(
                            dayObjOf1.subtract(weekDayOf1 - i, "day"),
                            dayObjOf1.subtract(weekDayOf1 - i - 1, "day")
                          )
                        }
                        className={`text-xs text-gray-400  pt-2 ${
                          dayObjOf1.subtract(weekDayOf1 - i, "day").date() ===
                            todayObj.date() &&
                          thisMonth - 1 === todayObj.month() &&
                          thisYear === todayObj.year()
                            ? "text-red-500 font-bold"
                            : ""
                        }`}
                      >
                        {dayObjOf1.subtract(weekDayOf1 - i, "day").date()}
                      </p>
                    </div>
                    {/* event content */}
                    {listEvent
                      .filter(
                        (evn) =>
                          JSON.stringify(convertTime(evn.fromTime)) ===
                          JSON.stringify(
                            getDate(
                              dayObjOf1.subtract(weekDayOf1 - i, "day").date(),
                              thisMonth === 0 ? 11 : thisMonth - 1,
                              thisMonth === 0 ? thisYear - 1 : thisYear
                            )
                          )
                      )
                      .slice(0, 4)
                      .map((evn) => {
                        return (
                          <button
                            key={evn.id}
                            onClick={() => showModalEditHandle(evn)}
                            className="flex  px-2 w-full my-1.5"
                          >
                            <img
                              src="draft.svg"
                              className="h-4 w-4 my-auto mr-2"
                              alt=""
                            />
                            <div className="text-xs font-medium text-gray-800 dark:text-gray-100 truncate ">
                              {evn.name}
                            </div>
                            <div className=" hidden xl:block"></div>
                          </button>
                        );
                      })}
                    {listEvent.filter(
                      (evn) =>
                        JSON.stringify(convertTime(evn.fromTime)) ===
                        JSON.stringify(
                          getDate(
                            dayObjOf1.subtract(weekDayOf1 - i, "day").date(),
                            thisMonth === 0 ? 11 : thisMonth - 1,
                            thisMonth === 0 ? thisYear - 1 : thisYear
                          )
                        )
                    ).length > 4 ? (
                      <button
                        className="flex px-2 w-full my-1.5"
                        onClick={() =>
                          showMoreHandle(
                            dayObjOf1.subtract(weekDayOf1 - i, "day"),
                            dayObjOf1.subtract(weekDayOf1 - i - 1, "day")
                          )
                        }
                      >
                        <div className="text-xs font-medium text-blue-500 dark:text-gray-100  truncate hover:underline">
                          Show more
                        </div>
                      </button>
                    ) : null}
                  </div>
                  <div className="hide absolute top-1 right-2">
                    <button
                      onClick={() => setShowModalAdd(true)}
                      className="tooltip text-2xl text-gray-800 hover:text-gray-400 focus:outline-none "
                    >
                      +
                      <span className="text-sm z-50 tooltiptext w-16">add</span>
                    </button>
                  </div>
                </div>
              ))}
              {_.range(daysInMonth).map((i: number) => (
                <div className={`relative`}>
                  <div
                    className={`h-36 col-span-1 border-r border-b border-gray-200   hover:bg-gray-200 cellDay  
                     ${
                       (i + _.range(weekDayOf1).length) % 7 === 0 ||
                       (i + _.range(weekDayOf1).length) % 7 === 6
                         ? "bg-indigo-50"
                         : ""
                     }  `}
                    key={i}
                  >
                    <div className={`justify-between flex px-2 `}>
                      <p
                        onClick={() =>
                          showMoreHandle(
                            dayjs(`${thisYear}-${thisMonth + 1}-${i + 1}`),
                            dayjs(`${thisYear}-${thisMonth + 1}-${i + 2}`)
                          )
                        }
                        className={`text-xs text-gray-800  pt-2 ${
                          i + 1 === todayObj.date() &&
                          thisMonth === todayObj.month() &&
                          thisYear === todayObj.year()
                            ? "text-red-500 font-bold"
                            : ""
                        }`}
                      >
                        {i + 1}
                      </p>
                    </div>
                    {/* event content */}
                    {listEvent
                      .filter(
                        (evn) =>
                          JSON.stringify(convertTime(evn.fromTime)) ===
                          JSON.stringify(getDate(i + 1, thisMonth, thisYear))
                      )
                      .slice(0, 4)
                      .map((evn) => {
                        return (
                          <button
                            key={evn.id}
                            onClick={() => showModalEditHandle(evn)}
                            className="flex  px-2 w-full my-1.5"
                          >
                            <img
                              src="draft.svg"
                              className="h-4 w-4 my-auto mr-2"
                              alt=""
                            />
                            <div className="text-xs font-medium text-gray-800 dark:text-gray-100 truncate ">
                              {evn.name}
                            </div>
                            <div className=" hidden xl:block"></div>
                          </button>
                        );
                      })}
                    {listEvent.filter(
                      (evn) =>
                        JSON.stringify(convertTime(evn.fromTime)) ===
                        JSON.stringify(getDate(i + 1, thisMonth, thisYear))
                    ).length > 4 ? (
                      <button
                        onClick={() =>
                          showMoreHandle(
                            dayjs(`${thisYear}-${thisMonth + 1}-${i + 1}`),
                            dayjs(`${thisYear}-${thisMonth + 1}-${i + 2}`)
                          )
                        }
                        className="flex px-2 w-full my-1.5"
                      >
                        <div className="text-xs font-medium text-blue-500 dark:text-gray-100  truncate hover:underline">
                          Show more
                        </div>
                      </button>
                    ) : null}
                  </div>
                  <div className="hide absolute top-1 right-2">
                    <button
                      onClick={() => setShowModalAdd(true)}
                      className=" tooltip text-2xl text-gray-800 hover:text-gray-400 focus:outline-none "
                    >
                      +
                      <span className="text-sm absolute z-50 tooltiptext w-16">
                        add
                      </span>
                    </button>
                  </div>
                </div>
              ))}
              {_.range(6 - weekDayOfLast).map((i) => (
                <div className="relative">
                  <div
                    className={`h-36 col-span-1 border-r border-b border-gray-200 bg-gray-100  hover:bg-gray-200 cellDay
                    ${
                      i + 1 === _.range(6 - weekDayOfLast).length
                        ? "bg-indigo-50"
                        : ""
                    }
                  `}
                    key={i}
                  >
                    <div className="justify-between flex px-2">
                      <p
                        onClick={() =>
                          showMoreHandle(
                            dayObjOfLast.add(i + 1, "day"),
                            dayObjOfLast.add(i + 2, "day")
                          )
                        }
                        className={`text-xs text-gray-500 dark:text-gray-100 pt-2 ${
                          dayObjOfLast.add(i + 1, "day").date() ===
                            todayObj.date() &&
                          thisMonth + 1 === todayObj.month() &&
                          thisYear === todayObj.year()
                            ? "text-red-500 font-bold"
                            : ""
                        }`}
                      >
                        {dayObjOfLast.add(i + 1, "day").date()}
                      </p>
                    </div>
                    {/* event content */}
                    {listEvent
                      .filter(
                        (evn) =>
                          JSON.stringify(convertTime(evn.fromTime)) ===
                          JSON.stringify(
                            getDate(
                              dayObjOfLast.add(i + 1, "day").date(),
                              thisMonth === 11 ? 0 : thisMonth + 1,
                              thisMonth === 11 ? thisYear + 1 : thisYear
                            )
                          )
                      )
                      .slice(0, 4)
                      .map((evn) => {
                        return (
                          <button
                            key={evn.id}
                            onClick={() => showModalEditHandle(evn)}
                            className="flex  px-2 w-full my-2"
                          >
                            <img
                              src="draft.svg"
                              className="h-4 w-4 my-auto mr-2"
                              alt=""
                            />
                            <div className="text-xs font-medium text-gray-800 dark:text-gray-100 truncate ">
                              {evn.name}
                            </div>
                            <div className=" hidden xl:block"></div>
                          </button>
                        );
                      })}
                    {listEvent.filter(
                      (evn) =>
                        JSON.stringify(convertTime(evn.fromTime)) ===
                        JSON.stringify(
                          getDate(
                            dayObjOfLast.add(i + 1, "day").date(),
                            thisMonth === 11 ? 0 : thisMonth + 1,
                            thisMonth === 11 ? thisYear + 1 : thisYear
                          )
                        )
                    ).length > 4 ? (
                      <button
                        onClick={() =>
                          showMoreHandle(
                            dayObjOfLast.add(i + 1, "day"),
                            dayObjOfLast.add(i + 2, "day")
                          )
                        }
                        className="flex px-2 w-full my-1.5"
                      >
                        <div className="text-xs font-medium text-blue-500 dark:text-gray-100  truncate hover:underline">
                          Show more
                        </div>
                      </button>
                    ) : null}
                  </div>
                  <div className="hide absolute top-1 right-2">
                    <button
                      onClick={() => setShowModalAdd(true)}
                      className="tooltip text-2xl text-gray-800 hover:text-gray-400 focus:outline-none "
                    >
                      +
                      <span className="text-sm absolute z-50 tooltiptext w-16">
                        add
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
        @media screen and (min-width: 375px) {
            .custom-width {
                width: 40rem;
            }
        }

        @media screen and (min-width: 1300px) {
            .custom-width {
                width: 50%;
            }
        }`}
      </style>
      {showModalEdit ? (
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 backdrop-filter backdrop-brightness-50 -mt-12">
          <div className=" w-full absolute flex items-center justify-center bg-modal">
            <div className="bg-white rounded shadow p-6 m-4 max-w-xs max-h-full">
              <div className="mb-8">
                <div className="grid grid-cols-8">
                  <div className="col-span-7 grid grid-cols-1">
                    <div>
                      <img
                        src="draft.svg"
                        className="h-4 w-4 my-auto mr-2"
                        alt=""
                      />
                      <p className="text-lg font-bold text-gray-600 dark:text-gray-100">
                        {currentEvent.name}
                      </p>
                    </div>

                    <div className="flex justify-between mt-2">
                      <p className="text-xs text-gray-600">
                        {weekDays[new Date(currentEvent.fromTime).getDay()] +
                          " " +
                          convertTime(currentEvent.fromTime).day +
                          "-" +
                          monthNames[convertTime(currentEvent.fromTime).month] +
                          ", " +
                          convertTime(currentEvent.fromTime).year}
                      </p>
                    </div>
                    <p>Review</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Link href={`/set/${currentEvent.description}/learn`}>
                  <button className=" text-white w-32 py-1 mx-4 rounded bg-green-500 hover:bg-green-600 focus:outline-none">
                    Review
                  </button>
                </Link>

                <button
                  onClick={() => setShowModalEdit(false)}
                  className="bg-gray-100 border-2 text-gray-700 w-28 py-1 mr-1 rounded-md text-sm font-medium hover:bg-gray-300"
                  type="button"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {showModalAdd ? (
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 backdrop-filter backdrop-brightness-50 -mt-12">
          <div className="w-full flex justify-center h-screen items-center">
            <div className="rounded-xl bg-white w-full md:w-2/3 lg:w-1/3 ">
              <div className="px-5 py-3 flex items-center border-b float-right">
                <button onClick={() => setShowModalAdd(false)}>
                  <CloseIcon />
                </button>
              </div>
              <div className="p-6">
                <div className=" flex flex-col w-full">
                  <div className="flex w-full ">
                    <TocRoundedIcon className="my-auto mr-4" />
                    <InputGroup
                      type="text"
                      setValue={setEventName}
                      placeholder="add title"
                      value={eventName}
                      label="Title"
                      // error={titleErr}
                      required
                    />
                  </div>

                  <div className="flex w-full">
                    <EventNoteRoundedIcon className="my-auto mr-4" />
                    <InputArea
                      setValue={setEventDesc}
                      placeholder="add description"
                      // error={alert.errors?.errors?.bio}
                      value={eventDesc}
                      // error={descErr}
                      label="Description"
                    />
                  </div>
                  <div className="my-6 flex">
                    <LocalOfferOutlinedIcon className="my-auto" />
                    <div className="w-full flex relative ml-4">
                      <div>
                        <button
                          onClick={() =>
                            setShowModalColorPicker(!showModalColorPicker)
                          }
                          className={`w-6 h-6 rounded-full focus:outline-none focus:shadow-outline inline-flex p-2 shadow 
                                bg-${eventColor.toLocaleLowerCase()}-400`}
                        ></button>
                        {showModalColorPicker ? (
                          <div className="origin-top-right absolute z-50  mt-6 w-40 rounded-md shadow-lg hover:shadow-xl">
                            <div className="rounded-md bg-white shadow-xs px-4 py-3">
                              <div className="flex flex-wrap -mx-2">
                                {listColors.map((color, index) => {
                                  return (
                                    <div key={index} className="px-2">
                                      {eventColor === color ? (
                                        <div
                                          className={`w-8 h-8 inline-flex rounded-full cursor-pointer border-4 border-white 
                                                bg-${color.toLocaleLowerCase()}-400 hover:bg-${color.toLocaleLowerCase()}-500`}
                                        ></div>
                                      ) : (
                                        <div
                                          onClick={() => setColorhandle(color)}
                                          className={`w-8 h-8 inline-flex rounded-full cursor-pointer border-4 border-white focus:outline-none focus:shadow-outline 
                                                bg-${color.toLocaleLowerCase()}-400 hover:bg-${color.toLocaleLowerCase()}-500`}
                                        ></div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-around">
                    <TextField
                      id="datetime-local"
                      label="From"
                      type="datetime-local"
                      defaultValue={todayObj}
                      className="text-gray-600 mx-1"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <TextField
                      id="datetime-local"
                      label="To"
                      type="datetime-local"
                      defaultValue={todayObj}
                      className="text-gray-600 mx-1"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center text-blue-400 justify-between py-6 px-4 border-t float-right">
                <button
                  // onClick={() => setShowModalEdit(false)}
                  className=" text-white w-32 py-1 mx-4 rounded bg-blue-500 hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
export default Calendar;
