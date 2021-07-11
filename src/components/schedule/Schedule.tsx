import React from "react";
import moment from "moment";
import Paper from "@material-ui/core/Paper";
import FormGroup from "@material-ui/core/FormGroup";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/FormControl";
import { makeStyles } from "@material-ui/core/styles";
import {
  ViewState,
  EditingState,
  IntegratedEditing,
} from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  WeekView,
  Appointments,
  AppointmentForm,
  AppointmentTooltip,
  DragDropProvider,
  ViewSwitcher,
  TodayButton,
  Toolbar,
  DateNavigator,
  DayView,
  MonthView,
  Resources,
} from "@devexpress/dx-react-scheduler-material-ui";
import { memo, useCallback, useState } from "react";
import { IEventRe } from "../../utils/TypeScript";

import {
  blue,
  green,
  red,
  yellow,
  purple,
  pink,
} from "@material-ui/core/colors";

const currentDate = moment().format("YYYY-MM-DD");

const editingOptionsList = [
  { id: "allowAdding", text: "Adding" },
  { id: "allowDeleting", text: "Deleting" },
  { id: "allowUpdating", text: "Updating" },
  { id: "allowResizing", text: "Resizing" },
  { id: "allowDragging", text: "Dragging" },
];

const Schedule = () => {
  const [data, setData] = useState<IEventRe[]>([]);
  const [addData, setAddData] = useState<any>();
  console.log(data);
  const [editingOptions, setEditingOptions] = useState({
    allowAdding: true,
    allowDeleting: true,
    allowUpdating: true,
    allowDragging: true,
    allowResizing: true,
  });

  const [addedAppointment, setAddedAppointment] = useState({});
  const [isAppointmentBeingCreated, setIsAppointmentBeingCreated] =
    useState(false);

  const {
    allowAdding,
    allowDeleting,
    allowUpdating,
    allowResizing,
    allowDragging,
  } = editingOptions;

  const onCommitChanges = useCallback(
    ({ added, changed, deleted }) => {
      if (added) {
        setAddData(added);

        const startingAddedId =
          data.length > 0 ? data[data.length - 1].id + 1 : 0;
        setData([...data, { id: startingAddedId, ...added }]);
        setAddData({ id: startingAddedId, ...added });
      }
      if (changed) {
        setData(
          data.map((appointment) =>
            changed[appointment.id]
              ? { ...appointment, ...changed[appointment.id] }
              : appointment
          )
        );
      }
      if (deleted !== undefined) {
        setData(data.filter((appointment) => appointment.id !== deleted));
      }
      setIsAppointmentBeingCreated(false);
    },
    [setData, setIsAppointmentBeingCreated, data]
  );

  const onAddedAppointmentChange = useCallback((appointment) => {
    setAddedAppointment(appointment);
    setIsAppointmentBeingCreated(true);
  }, []);
  const TimeTableCell = useCallback(
    memo(({ onDoubleClick, ...restProps }: any) => (
      <WeekView.TimeTableCell
        {...restProps}
        onDoubleClick={allowAdding ? onDoubleClick : undefined}
      />
    )),
    [allowAdding]
  );

  const allowDrag = useCallback(
    () => allowDragging && allowUpdating,
    [allowDragging, allowUpdating]
  );
  const allowResize = useCallback(
    () => allowResizing && allowUpdating,
    [allowResizing, allowUpdating]
  );

  var resources = [
    {
      fieldName: "location",
      title: "Location",
      instances: [
        { id: "RED", text: "Red" },
        { id: "YELLOW", text: "Yellow" },
        { id: "GREEN", text: "Green" },
        { id: "BLUE", text: "Blue" },
        { id: "PURPLE", text: "Purple" },
        { id: "PINK", text: "Pink" },
      ],
    },
  ];

  console.log(data);
  console.log("data is: " + JSON.stringify(addData));

  const Appointment = ({ children, style, ...restProps }: any) => {
    return (
      <Appointments.Appointment
        {...restProps}
        style={{
          backgroundColor: "",
          borderRadius: "8px",
        }}
      >
        {children}
      </Appointments.Appointment>
    );
  };

  const onAppointmentFormOpening = (data: any) => {};

  return (
    <React.Fragment>
      <Paper>
        <Scheduler data={data} height={650}>
          <ViewState
            // currentDate={currentDate}
            defaultCurrentDate={currentDate}
            defaultCurrentViewName="Week"
          />
          <EditingState
            onCommitChanges={onCommitChanges}
            addedAppointment={addedAppointment}
            onAddedAppointmentChange={onAddedAppointmentChange}
          />

          <IntegratedEditing />
          <WeekView
            startDayHour={0}
            endDayHour={24}
            timeTableCellComponent={TimeTableCell}
          />
          <Toolbar />
          <DateNavigator />
          <TodayButton />
          <DayView startDayHour={0} endDayHour={24} />
          <MonthView />
          <Appointments appointmentComponent={Appointment} />
          <Resources data={resources} mainResourceName="color" />
          <AppointmentTooltip showOpenButton showDeleteButton={allowDeleting} />
          <AppointmentForm
            // commandButtonComponent={CommandButton}
            readOnly={isAppointmentBeingCreated ? false : !allowUpdating}
          />
          <DragDropProvider allowDrag={allowDrag} allowResize={allowResize} />
          <ViewSwitcher />
        </Scheduler>
      </Paper>
    </React.Fragment>
  );
};

export default Schedule;
