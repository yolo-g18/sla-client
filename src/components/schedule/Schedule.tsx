import dynamic from "next/dynamic";
import "tui-calendar/dist/tui-calendar.css";
import "tui-date-picker/dist/tui-date-picker.css";
import "tui-time-picker/dist/tui-time-picker.css";
import { ISchedule, ICalendarInfo } from "tui-calendar";

const Calendar = dynamic(import("@toast-ui/react-calendar"), {
  ssr: false,
});

const Schedule = () => {
  return (
    <div>
      <Calendar
        height="750px"
        calendars={[
          {
            id: "0",
            name: "Private",
            bgColor: "#9e5fff",
            borderColor: "#9e5fff",
          },
          {
            id: "1",
            name: "Company",
            bgColor: "#00a9ff",
            borderColor: "#00a9ff",
          },
        ]}
        disableDblClick={true}
        disableClick={false}
        isReadOnly={false}
        month={{
          startDayOfWeek: 0,
        }}
        scheduleView
        taskView
        template={{
          milestone(schedule) {
            return `<span style="color:#fff;background-color: ${schedule.bgColor};">${schedule.title}</span>`;
          },
          milestoneTitle() {
            return "Milestone";
          },
          allday(schedule) {
            return `${schedule.title}<i class="fa fa-refresh"></i>`;
          },
          alldayTitle() {
            return "All Day";
          },
        }}
        useDetailPopup
        useCreationPopup
        week={{
          showTimezoneCollapseButton: true,
          timezonesCollapsed: true,
        }}
      />
    </div>
  );
};

export default Schedule;
