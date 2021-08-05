import dayjs from "dayjs";
import _, { stubFalse } from "lodash";
import Link from "next/link";
import "date-fns";

import { useEffect, useState } from "react";

import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import { FormSubmit, IEventRes, RootStore } from "../../utils/TypeScript";
import {
  convertTime,
  convertTimeToMySQl,
  formatDate2,
  getTimeInDay,
} from "./convertTime";

import EditIcon from "@material-ui/icons/Edit";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";

import { useDispatch, useSelector } from "react-redux";
import { ALERT } from "../../redux/types/alertType";
import { PARAMS } from "../../common/params";
import { getAPI, postAPI } from "../../utils/FetchData";

import TextField from "@material-ui/core/TextField";
import CloseIcon from "@material-ui/icons/Close";
import InputArea from "../input/InputArea";
import InputGroup from "../input/InputGroup";
import TocRoundedIcon from "@material-ui/icons/TocRounded";
import EventNoteRoundedIcon from "@material-ui/icons/EventNoteRounded";
import LocalOfferOutlinedIcon from "@material-ui/icons/LocalOfferOutlined";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import { useClickOutside } from "../../hook/useClickOutside";
import { putEvent } from "../../redux/actions/eventAction";

interface Props {}

//alert
function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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

  const [listColors, setListColors] = useState<string[]>([]);

  const [eventName, setEventName] = useState("New event");
  const [eventDesc, setEventDesc] = useState("");
  const [fromTime, setFromTime] = useState();
  const [toTime, setToTime] = useState();
  const [isLearnEvent, setIsLearnEvent] = useState(false);
  const [eventColor, setEventColor] = useState("BLUE");

  const [isSuccess, setIsSuccess] = useState(false);

  //click out side

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
  };

  const handleNext = () => {
    setDayObj(dayObj.add(1, "month"));
    setCalendarChange(true);
  };

  const jumToToday = () => {
    setDayObj(todayObj);
    setCalendarChange(true);

    const fetchData = async () => {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await getAPI(
          `${PARAMS.ENDPOINT}event?from=${convertTimeToMySQl(
            todayObj.startOf("day")
          )}&to=${convertTimeToMySQl(todayObj.endOf("day"))}`
        );
        dispatch({ type: ALERT, payload: { loading: false } });
        dispatch(putEvent(res.data));
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
      }
    };

    fetchData();
  };
  const showModalEditHandle = (evn: IEventRes) => {
    setShowModalEdit(true);
    setCurrentEvent(evn);
  };

  //get all event for calendar
  useEffect(() => {
    setIsSuccess(false);
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
  }, [caledarChange, isSuccess]);

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

  const showMoreHandle = (dateFrom: any, dateTo: any) => {
    console.log(
      convertTimeToMySQl(dateFrom) + " to " + convertTimeToMySQl(dateTo)
    );

    const fetchData = async () => {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await getAPI(
          `${PARAMS.ENDPOINT}event?from=${convertTimeToMySQl(
            dateFrom
          )}&to=${convertTimeToMySQl(dateTo)}`
        );

        console.log(
          convertTimeToMySQl(dateFrom) + " to " + convertTimeToMySQl(dateTo)
        );

        dispatch({ type: ALERT, payload: { loading: false } });
        dispatch(putEvent(res.data));
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
      }
    };
    fetchData();
  };

  const [dateEventPick, setDateEventPick] = useState<Date | null>(
    new Date(todayObj.toString())
  );
  const [timeFromPick, setTimeFromPick] = useState<Date | null>(
    dateEventPick
      ? new Date(dateEventPick.toString())
      : new Date(todayObj.toString())
  );
  const [timeToPick, setTimeToPick] = useState<Date | null>(
    dateEventPick
      ? new Date(dateEventPick.toString())
      : new Date(todayObj.toString())
  );

  //handle open add modal
  const addClickHandle = (date: any) => {
    setDateEventPick(new Date(date.toString()));
    setTimeFromPick(new Date(date.toString()));

    const d = new Date(dateEventPick ? dateEventPick : "");
    d?.setDate(d.getDate() + 1);
    console.log(convertTimeToMySQl(d));

    setShowModalAdd(true);
  };

  const [evnNameErr, setEvnNameErr] = useState("");
  const [descErr, setDescNameErr] = useState("");
  const [timePickerErr, setTimePickerErr] = useState("");

  //state of alert
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [typeToast, setTypeToast] = useState("success");
  const [messageToast, setMessageToast] = useState("");

  //handel close toast
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setIsToastOpen(false);
  };

  //change time to, time from when user change date evn
  useEffect(() => {
    setTimeFromPick(dateEventPick);
  }, [dateEventPick]);

  //change totime when from time change
  useEffect(() => {
    const time = new Date(timeFromPick ? timeFromPick : "");
    if (time) {
      time.setTime(time.getTime() + 60 * 60 * 1000);
      setTimeToPick(time);
    }
  }, [timeFromPick]);

  //validate input
  useEffect(() => {
    if (eventName.length <= 0) {
      setEvnNameErr("Title is required.");
    } else if (eventName.length > 50) {
      setEvnNameErr("Title cannot exceed 50 character.");
    } else {
      setEvnNameErr("");
    }

    if (eventDesc.length > 150) {
      setDescNameErr("Description cannot exceed 150 characters.");
    } else {
      setDescNameErr("");
    }
    if (timeFromPick && timeToPick) {
      if (timeFromPick > timeToPick) {
        setTimePickerErr("Invalid time");
      } else {
        setTimePickerErr("");
      }
    }
  }, [eventName, eventDesc, timeToPick, timeFromPick]);

  const addEventHandle = () => {
    //check error
    if (evnNameErr || descErr || timePickerErr) return;

    const dataEvn = {
      color: eventColor,
      name: eventName,
      description: eventDesc,
      fromTime: timeFromPick?.toISOString(),
      toTime: timeToPick?.toISOString(),
      isLearnEvent: false,
    };

    if (eventName.length === 0) {
      setEvnNameErr("");
    }

    const fetchDate = async () => {
      const t = new Date(dateEventPick ? dateEventPick : "");
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await postAPI(`${PARAMS.ENDPOINT}event`, dataEvn);
        dispatch({ type: ALERT, payload: { loading: false } });
        setIsToastOpen(true);
        setTypeToast("success");
        setShowModalAdd(false);
        setMessageToast("😎 Added");
        setIsSuccess(true);
        setEventName("New event");
        setEventDesc("");
        setEventColor("BLUE");

        // convert date
        await t?.setDate(t.getDate() + 1);

        showMoreHandle(dateEventPick, t);
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
        setIsToastOpen(true);
        setTypeToast("error");
        setMessageToast("An error occurred");
        setIsSuccess(false);
      }
    };

    fetchDate();
  };

  const handleCloseModalAdd = () => {
    setShowModalAdd(false);
    setEventName("New event");
    setEventDesc("");
    setEventColor("BLUE");
  };

  return (
    <div>
      <div className="mx-auto pt-2 pb-10">
        <div className="w-full flex items-center justify-between">
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
                        return evn.isLearnEvent ? (
                          <button
                            key={evn.id}
                            onClick={() => showModalEditHandle(evn)}
                            className="flex px-2 w-full my-1.5"
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
                        ) : (
                          <button
                            key={evn.id}
                            onClick={() => showModalEditHandle(evn)}
                            className={`flex w-full my-1.5 bg-${evn.color?.toLocaleLowerCase()}-200
                             px-2 rounded justify-between`}
                          >
                            <div className="text-xs font-medium text-gray-800 truncate">
                              {evn.name}
                            </div>
                            <div className="text-xs justify- hidden xl:block lg:hidden font-medium text-gray-800">
                              {getTimeInDay(evn.fromTime)}
                            </div>
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
                      onClick={() =>
                        addClickHandle(
                          dayjs(`${dayObjOf1.subtract(weekDayOf1 - i, "day")}`)
                        )
                      }
                      className="tooltip text-2xl text-gray-800 hover:text-gray-400 focus:outline-none "
                    >
                      +
                      <span className="text-sm z-50 tooltiptext w-16">add</span>
                    </button>
                  </div>
                </div>
              ))}
              {_.range(daysInMonth).map((i: number) => (
                <div
                  onClick={() =>
                    showMoreHandle(
                      dayjs(`${thisYear}-${thisMonth + 1}-${i + 1}`),
                      dayjs(`${thisYear}-${thisMonth + 1}-${i + 2}`)
                    )
                  }
                  className={`relative`}
                >
                  <div
                    className={`h-36 col-span-1 border-r border-b border-gray-200 hover:bg-gray-200 cellDay  
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
                        return evn.isLearnEvent ? (
                          <button
                            key={evn.id}
                            onClick={() => showModalEditHandle(evn)}
                            className="flex px-2 w-full my-1.5"
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
                        ) : (
                          <button
                            key={evn.id}
                            onClick={() => showModalEditHandle(evn)}
                            className={`flex w-full my-1.5 bg-${evn.color?.toLocaleLowerCase()}-200
                             px-2 rounded justify-between`}
                          >
                            <div className="text-xs font-medium text-gray-800 truncate">
                              {evn.name}
                            </div>
                            <div className="text-xs justify- hidden xl:block lg:hidden font-medium text-gray-800">
                              {getTimeInDay(evn.fromTime)}
                            </div>
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
                      onClick={() =>
                        addClickHandle(
                          dayjs(`${thisYear}-${thisMonth + 1}-${i + 1}`)
                        )
                      }
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
                        return evn.isLearnEvent ? (
                          <button
                            key={evn.id}
                            onClick={() => showModalEditHandle(evn)}
                            className="flex px-2 w-full my-1.5"
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
                        ) : (
                          <button
                            key={evn.id}
                            onClick={() => showModalEditHandle(evn)}
                            className={`flex w-full my-1.5 bg-${evn.color?.toLocaleLowerCase()}-200
                             px-2 rounded justify-between`}
                          >
                            <div className="text-xs font-medium text-gray-800 truncate">
                              {evn.name}
                            </div>
                            <div className="text-xs justify- hidden xl:block lg:hidden font-medium text-gray-800">
                              {getTimeInDay(evn.fromTime)}
                            </div>
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
                      onClick={() =>
                        addClickHandle(
                          dayjs(`${dayObjOfLast.add(i + 1, "day")}`)
                        )
                      }
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
        <div
          className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0
         z-50 backdrop-filter backdrop-brightness-50 -mt-12"
        >
          <div className="h-screen w-full absolute flex items-center justify-center bg-modal">
            <div className="bg-white rounded-md shadow p-2 m-4 max-w-md max-h-full">
              <div className="px-2 py-2 flex items-center float-right">
                <button onClick={handleCloseModalAdd}>
                  <CloseIcon />
                </button>
              </div>
              <form className="p-4">
                <div className=" flex flex-col w-full">
                  <div className="flex">
                    <TocRoundedIcon className="my-auto mr-4" />
                    <InputGroup
                      type="text"
                      setValue={setEventName}
                      placeholder="add title"
                      value={eventName}
                      label="Title"
                      error={evnNameErr}
                      required
                    />
                  </div>

                  <div className="flex w-full">
                    <EventNoteRoundedIcon className="my-auto mr-4" />
                    <InputArea
                      setValue={setEventDesc}
                      placeholder="add description"
                      value={eventDesc}
                      error={descErr}
                      label="Description"
                    />
                  </div>
                  <div className="my-6 flex">
                    <LocalOfferOutlinedIcon className="my-auto" />
                    <div className="w-full flex relative ml-4">
                      <div>
                        <div
                          onClick={() =>
                            setShowModalColorPicker(!showModalColorPicker)
                          }
                          className={`w-6 h-6 rounded-full focus:outline-none focus:shadow-outline inline-flex p-2 shadow 
                                bg-${eventColor.toLocaleLowerCase()}-400 cursor-pointer hover:bg-${eventColor.toLocaleLowerCase()}-300`}
                        ></div>
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
                                          onClick={() => {
                                            setColorhandle(color);
                                          }}
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
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <div className="flex mb-2">
                      <div className="w-10"></div>
                      <div className="grid grid-cols-1">
                        <div className="col-span-1">
                          <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="Date"
                            value={dateEventPick}
                            onChange={setDateEventPick}
                            KeyboardButtonProps={{
                              "aria-label": "change date",
                            }}
                            className="w-52"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="w-16"></div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="col-span-1">
                          <KeyboardTimePicker
                            margin="normal"
                            id="time-picker"
                            label="From"
                            ampm={false}
                            value={timeFromPick}
                            onChange={setTimeFromPick}
                            KeyboardButtonProps={{
                              "aria-label": "change time",
                            }}
                          />
                        </div>
                        <div className="ml-4 col-span-1">
                          <KeyboardTimePicker
                            margin="normal"
                            id="time-picker"
                            label="To"
                            ampm={false}
                            value={timeToPick}
                            onChange={setTimeToPick}
                            KeyboardButtonProps={{
                              "aria-label": "change time",
                            }}
                            minDateMessage={setTimePickerErr}
                          />
                          <small className="font-medium text-red-600">
                            {timePickerErr}
                          </small>
                        </div>
                      </div>
                    </div>
                  </MuiPickersUtilsProvider>
                </div>
              </form>
              <div className="flex items-center text-blue-400 justify-between py-3 px-2 border-t float-right">
                <button
                  onClick={() => addEventHandle()}
                  className=" text-white w-32 py-1 mx-4 rounded-sm bg-blue-500 hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <Snackbar
        open={isToastOpen}
        autoHideDuration={1000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={
            typeToast === "success"
              ? "success"
              : typeToast === "error"
              ? "error"
              : "warning"
          }
        >
          {messageToast}
        </Alert>
      </Snackbar>
    </div>
  );
};
export default Calendar;
