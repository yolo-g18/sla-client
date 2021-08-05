import AppLayout2 from "../components/layout/AppLayout";
import { useEffect, useState } from "react";
import Calendar from "../components/schedule/Calendar";
import EventIcon from "@material-ui/icons/Event";
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

const todayObj = dayjs();

const schedule = () => {
  const dispatch = useDispatch();
  const { alert, event } = useSelector((state: RootStore) => state);

  const [listEvnDisplay, setListEvnDisplay] = useState<IEventRes[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>();

  console.log(alert.success);

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
        setListEvnDisplay(res.data);
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
      }
    };
    if (event.length === 0) fetchData();
    else setListEvnDisplay(event);
    setCurrentDate(event[0]?.fromTime);
  }, [event, alert.success]);

  console.log("dd: " + currentDate);

  return (
    <div>
      <AppLayout2 title="Schedule" desc="Schedule">
        <div className=" grid grid-cols-1 lg:grid-cols-5 w-full px-4 mb-36">
          <div className="col-span-1 px-2 mt-2">
            <div
              className="shadow-lg rounded-md w-full p-4 bg-white overflow-auto mb-6"
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
                {formatUTCToDate(listEvnDisplay[0]?.fromTime)}
              </p>
              {listEvnDisplay.map((evn, index) => {
                return (
                  <div
                    key={index}
                    className={`flex items-center mb-2 rounded justify-between p-3 bg-${
                      evn.color ? evn.color.toLocaleLowerCase() : "green"
                    }-100`}
                  >
                    <span className="rounded-lg p-2 bg-white">
                      {evn.isLearnEvent ? (
                        <img
                          src="draft.svg"
                          className="h-6 w-6 my-auto mx-auto"
                          alt=""
                        />
                      ) : (
                        <EventIcon />
                      )}
                    </span>

                    <div className="flex w-full ml-2 items-center justify-between truncate relative">
                      <div className="w-3/5">
                        <p className="truncate">{evn.name}</p>
                      </div>
                      <div className="w-12">
                        <p>{getTimeInDay(evn.fromTime)}</p>
                      </div>
                    </div>
                  </div>
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
