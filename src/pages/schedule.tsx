import AppLayout2 from "../components/layout/AppLayout";
import * as React from "react";
import Paper from "@material-ui/core/Paper";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  DayView,
  Appointments,
} from "@devexpress/dx-react-scheduler-material-ui";

const currentDate = "2018-11-01";
const schedulerData = [
  {
    startDate: "2018-11-01T09:45",
    endDate: "2018-11-01T11:00",
    title: "Meeting",
  },
  {
    startDate: "2018-11-01T12:00",
    endDate: "2018-11-01T13:30",
    title: "Go to a gym",
  },
];

const schedule = () => {
  return (
    <div>
      <AppLayout2 title="library" desc="library">
        <div className="grid grid-cols-4 py-6">
          <div className="col-span-1"></div>
          <div className="col-span-3">
            <Paper>
              <Scheduler data={schedulerData}>
                <ViewState currentDate={currentDate} />
                <DayView startDayHour={9} endDayHour={14} />
                <Appointments />
              </Scheduler>
            </Paper>
          </div>
        </div>
      </AppLayout2>
    </div>
  );
};

export default schedule;
