import React from "react";
import moment from "moment";
import Paper from "@material-ui/core/Paper";
import FormGroup from "@material-ui/core/FormGroup";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/FormControl";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import _ from "lodash";
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
  ConfirmationDialog,
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
  const [colorList, setColorList] = useState([
    { colorId: "RED", text: "Red", color: "#F87171" },
    { colorId: "YELLOW", text: "Yellow", color: "#FBBF24" },
    { colorId: "GREEN", text: "Green", color: "#10B981" },
    { colorId: "BLUE", text: "Blue", color: "#3B82F6" },
    { colorId: "PURPLE", text: "Purple", color: "#A78BFA" },
    { colorId: "PINK", text: "Pink", color: "#F472B6" },
  ]);
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
      fieldName: "color",
      title: "Color",
      instances: [
        { id: "RED", text: "Red", color: "#F87171" },
        { id: "YELLOW", text: "Yellow", color: "#FBBF24" },
        { id: "GREEN", text: "Green", color: "#10B981" },
        { id: "BLUE", text: "Blue", color: "#3B82F6" },
        { id: "PURPLE", text: "Purple", color: "#A78BFA" },
        { id: "PINK", text: "Pink", color: "#F472B6" },
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
          borderRadius: "",
        }}
      >
        {children}
      </Appointments.Appointment>
    );
  };

  // const getEventById = (id: number) => {
  //   return _.find(data, { id: id });
  // };

  // const getColorById = (id: string) => {
  //   return _.find(colorList, { id: id });
  // };

  // const onAppointmentFormOpening = (data: any, color: any) => {
  //   let form = data.form,
  //     event = getEventById(data.id) || {
  //       title: null,
  //       notes: null,
  //       id: null,
  //       color: null,
  //     },
  //     startDate = data.startDate,
  //     endDate = data.endDate;
  //   form.option("items", [
  //     {
  //       label: {
  //         text: "Title",
  //       },
  //       name: "title",
  //       editorType: "dxTextBox",
  //       editorOptions: {
  //         value: event.title,
  //       },
  //     },
  //     {
  //       dataField: "startDate",
  //       editorType: "dxDateBox",
  //       editorOptions: {
  //         width: "100%",
  //         type: "datetime",
  //         onValueChanged: function (args: any) {
  //           startDate = args.value;
  //         },
  //       },
  //     },
  //     {
  //       dataField: "endDate",
  //       editorType: "dxDateBox",
  //       editorOptions: {
  //         width: "100%",
  //         type: "datetime",
  //         onValueChanged: function (args: any) {
  //           endDate = args.value;
  //         },
  //       },
  //     },
  //     {
  //       label: {
  //         text: "Description",
  //       },
  //       name: "notes",
  //       editorType: "dxTextArea",
  //       editorOptions: {
  //         value: event.notes,
  //       },
  //     },
  //     {
  //       label: {
  //         text: "Color",
  //       },
  //       name: "",
  //       editorType: "dxSelectBox",
  //       editorOptions: {
  //         value: event.notes,
  //       },
  //     },
  //   ]);
  // };

  // const CommandButton = (props: any) => {
  //   if (props.id !== "cancelButton")
  //     return <AppointmentForm.CommandButton {...props} />;
  //   else {
  //     const cancelClick = () => {
  //       console.log("cancel");
  //       // this.setState({
  //       //   errors: {}
  //       // });
  //       props.onExecute();
  //     };
  //     return (
  //       <AppointmentForm.CommandButton {...props} onExecute={cancelClick} />
  //     );
  //   }
  // };

  const Header = ({
    children,
    appointmentData,
    ...restProps
  }: ComponentType<HeaderProps>) => {
    <AppointmentTooltip.Header {...restProps} appointmentData={appointmentData}>
      <button
        /* eslint-disable-next-line no-alert */
        onClick={() => alert(JSON.stringify(appointmentData))}
      ></button>
    </AppointmentTooltip.Header>;
  };

  return (
    <React.Fragment>
      <Paper>
        <Scheduler data={data} height={750}>
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
          <ConfirmationDialog />
          <Appointments appointmentComponent={Appointment} />
          <Resources data={resources} />
          <AppointmentTooltip
            headerComponent={Header}
            // contentComponent={}
            showOpenButton
            showDeleteButton={allowDeleting}
          />
          <AppointmentForm
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
