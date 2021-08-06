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
  convertTimeToMySQl,
  formatUTCToDate,
  getTimeInDay,
} from "../components/schedule/convertTime";
import { PARAMS } from "../common/params";
import { putEvent } from "../redux/actions/eventAction";

const todayObj = dayjs();

const schedule = () => {
  const dispatch = useDispatch();
  const { alert, event } = useSelector((state: RootStore) => state);

  useEffect(() => {
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
  }, []);

  return (
    <div>
      <AppLayout2 title="Schedule" desc="Schedule">
        <div className=" grid grid-cols-1 lg:grid-cols-5 w-full px-4 mb-36">
          <div className="col-span-1 px-2 mt-2">
            <div
              className="shadow-lg rounded-md w-full p-4 bg-white overflow-auto mb-6 md:h-64"
              style={{ height: "780px" }}
            >
              <div className="w-full flex items-center justify-between">
                <p className="text-gray-800 dark:text-white text-xl font-medium">
                  Calendar
                </p>
                <button className="flex items-center text-3xl text-gray-800 hover:text-gray-400 focus:outline-none">
                  +
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
                    className={`cursor-pointer border rounded-md p-1 bg-white flex text-gray-700 mb-2 
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
                    <div className="flex-1 relative">
                      <header className="mb-1 text-sm truncate">
                        <span className="font-semibold">{evn.name}</span>
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
