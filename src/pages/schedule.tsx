import AppLayout2 from "../components/layout/AppLayout";
import { useEffect, useState } from "react";
import Calendar from "../components/schedule/Calendar";
import EventIcon from "@material-ui/icons/Event";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import dayjs from "dayjs";

import { useDispatch, useSelector } from "react-redux";
import { IEventRes, RootStore } from "../utils/TypeScript";
import { ALERT } from "../redux/types/alertType";
import { getAPI } from "../utils/FetchData";

import {
  convertTime,
  convertTimeEvnLearn,
  convertTimeToMySQl,
  formatUTCToDate,
  getTimeInDay,
} from "../components/schedule/convertTime";
import { PARAMS } from "../common/params";
import { putEvent } from "../redux/actions/eventAction";
import { eventHandleDispatch } from "../redux/actions/eventHandleAction";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

const todayObj = dayjs();

const schedule = () => {
  const dispatch = useDispatch();
  const { alert, event, eventHandle } = useSelector(
    (state: RootStore) => state
  );
  const [dateNow, setDateNow] = useState(new Date());

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
                dispatch({ type: ALERT, payload: { loading: false } });
                if (res.data.length) {
                  listTemp[index].isDone = false;
                } else listTemp[index].isDone = true;
              } catch (err) {
                console.log(err);
                dispatch({ type: ALERT, payload: { loading: false } });
              }
            }
          })
        ).then(() => dispatch(putEvent(res.data)));
        dispatch({ type: ALERT, payload: { loading: false } });
      } catch (err) {
        console.log(err);
        dispatch({ type: ALERT, payload: { loading: false } });
      }
    };
    fetchData();
  }, []);

  const addEventHandle = () => {
    console.log(new Date(todayObj.format("MM/dd/yyyy")));

    dispatch(
      eventHandleDispatch({
        typeAction: 1,
      })
    );
  };

  const viewEventhandle = (evn: IEventRes) => {
    dispatch(eventHandleDispatch({ typeAction: 2, currentEvn: evn }));
  };

  return (
    <div>
      <AppLayout2 title="Schedule" desc="Schedule">
        <div className=" grid grid-cols-1 lg:grid-cols-5 w-full px-4 mb-36">
          <div className="col-span-1 px-2 mt-2">
            <div
              className="shadow-lg rounded-md w-full p-4 bg-white mb-6 md:h-64"
              style={{ height: "780px" }}
            >
              <div className="w-full flex items-center justify-between">
                <p className="text-gray-800 dark:text-white text-xl font-medium">
                  Calendar
                </p>
                <button
                  onClick={addEventHandle}
                  className="tooltip flex items-center text-3xl text-gray-800 hover:text-gray-400 focus:outline-none"
                >
                  +
                  <span className="text-sm tooltiptext w-20 px-1">
                    Add today
                  </span>
                </button>
              </div>
              <p className="text-gray-800 dark:text-white text-md font-medium mb-4">
                {event.length
                  ? formatUTCToDate(event[0]?.fromTime)
                  : "No task at this day"}
              </p>
              {event.map((evn, index) => {
                return (
                  <article
                    key={index}
                    className={`cursor-pointer rounded-md bg-white flex text-gray-700 mb-2 `}
                    onClick={() => viewEventhandle(evn)}
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
                    <div className="flex-1 w-full pr-6">
                      <header className="mb-1 text-sm w-full">
                        {evn.isLearnEvent ? (
                          <div className="flex justify-between">
                            <div
                              className={`font-semibold ${
                                evn.isDone ? "text-gray-400 " : "text-gray-800"
                              } hover:text-gray-800 hover:underline truncate`}
                              onClick={() => viewEventhandle(evn)}
                            >
                              {evn.name}{" "}
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
                            className={`font-semibold truncate hover:underline
                              ${
                                new Date(evn.toTime) < dateNow
                                  ? " text-gray-400 line-through"
                                  : "text-gray-800 "
                              }`}
                            onClick={() => viewEventhandle(evn)}
                          >
                            {evn.name}
                          </div>
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
          <div className="lg:col-span-4 col-span-1 px-2">
            <Calendar />
          </div>
        </div>
      </AppLayout2>
    </div>
  );
};

export default schedule;
