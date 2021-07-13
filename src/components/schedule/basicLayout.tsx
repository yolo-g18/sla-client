import * as React from "react";
// import * as PropTypes from "prop-types";
// import { withStyles } from "@material-ui/core/styles";
// import classNames from "clsx";
// import Grid from "@material-ui/core/Grid";
// import {
//   TITLE_TEXT_EDITOR,
//   MULTILINE_TEXT_EDITOR,
//   TITLE,
//   REPEAT_TYPES,
//   handleChangeFrequency,
// } from "@devexpress/dx-scheduler-core";

// import TextField from "@material-ui/core/TextField";
// import DateFnsUtils from "@date-io/date-fns";
// import japanLocale from "date-fns/locale/ja";
// import {
//   KeyboardDateTimePicker,
//   MuiPickersUtilsProvider,
// } from "@material-ui/pickers";
// import { makeStyles } from "@material-ui/core/styles";
// import { MyContext } from "./demo";

// const SMALL_LAYOUT_WIDTH = 700;

// const LAYOUT_MEDIA_QUERY = `@media (max-width: ${SMALL_LAYOUT_WIDTH}px)`;

// const styles = ({ spacing, typography }: any) => ({
//   root: {
//     width: "650px",
//     paddingTop: spacing(3),
//     paddingBottom: spacing(3),
//     paddingLeft: spacing(4),
//     paddingRight: spacing(4),
//     boxSizing: "border-box",
//     transition: `all 400ms cubic-bezier(0, 0, 0.2, 1)`,
//     [`${LAYOUT_MEDIA_QUERY}`]: {
//       width: "100%",
//       maxWidth: "700px",
//       paddingRight: spacing(2),
//       paddingLeft: spacing(2),
//       paddingBottom: 0,
//     },
//   },
//   fullSize: {
//     paddingBottom: spacing(3),
//   },
//   halfSize: {
//     "@media (min-width: 700px) and (max-width: 850px)": {
//       width: "400px",
//     },
//     "@media (min-width: 850px) and (max-width: 1000px)": {
//       width: "480px",
//     },
//     "@media (min-width: 1000px) and (max-width: 1150px)": {
//       width: "560px",
//     },
//   },
//   labelWithMargins: {
//     marginBottom: spacing(0.5),
//     marginTop: spacing(0.5),
//   },
//   notesEditor: {
//     marginTop: spacing(0),
//   },
//   dateEditor: {
//     width: "45%",
//     paddingTop: "0px!important",
//     marginTop: spacing(2),
//     paddingBottom: "0px!important",
//     marginBottom: 0,
//   },
//   dividerLabel: {
//     ...typography.body2,
//     width: "10%",
//     textAlign: "center",
//     paddingTop: spacing(2),
//   },
//   booleanEditors: {
//     marginTop: spacing(0.875),
//   },
//   "@media (max-width: 570px)": {
//     dateEditors: {
//       flexDirection: "column",
//     },
//     booleanEditors: {
//       flexDirection: "column",
//       marginTop: spacing(1.875),
//     },
//     dateEditor: {
//       width: "100%",
//       "&:first-child": {
//         marginBottom: 0,
//       },
//       "&:last-child": {
//         marginTop: spacing(2),
//       },
//     },
//     dividerLabel: {
//       display: "none",
//     },
//   },
// });
// const isValidDate = (d: any) => {
//   return d instanceof Date && !isNaN(d);
// };
// const useStyle = makeStyles(({ spacing }) => ({
//   dateEditor: {
//     paddingBottom: spacing(1.5),
//   },
// }));
// const JapanDateEditor = (props: any) => {
//   const classes = useStyle();

//   const {
//     onValueChange,
//     value,
//     readOnly,
//     excludeTime,
//     className,
//     error,
//     helperText,
//   } = props;
//   const [isInvalidDate, setIsInvalidDate] = React.useState(false);
//   const memoizedChangeHandler = React.useCallback(
//     (nextDate) => {
//       setIsInvalidDate(!isValidDate(nextDate));
//       return nextDate && onValueChange(nextDate);
//     },
//     [onValueChange, setIsInvalidDate]
//   );
//   const dateFormat = excludeTime ? "dd/MM/yyyy" : "dd/MM/yyyy hh:mm";

//   return (
//     <MuiPickersUtilsProvider utils={DateFnsUtils} locale={japanLocale}>
//       <KeyboardDateTimePicker
//         variant="inline"
//         disabled={readOnly}
//         className={classNames(classes.dateEditor, className)}
//         margin="normal"
//         value={value}
//         onChange={memoizedChangeHandler}
//         format={dateFormat}
//         inputVariant="filled"
//         hiddenLabel
//         error={error || isInvalidDate}
//         helperText={
//           isInvalidDate ? "Custom error message" : error ? helperText : null
//         }
//       />
//     </MuiPickersUtilsProvider>
//   );
// };

// const LayoutBase = ({
//   children,
//   locale,
//   classes,
//   className,
//   getMessage,
//   readOnly,
//   onFieldChange,
//   appointmentData,
//   fullSize,
//   resources,
//   appointmentResources,
//   textEditorComponent: TextEditor,
//   dateEditorComponent: DateEditor,
//   selectComponent: Select,
//   labelComponent: Label,
//   booleanEditorComponent: BooleanEditor,
//   resourceEditorComponent: ResourceEditor,
//   ...restProps
// }) => {
//   const changeTitle = React.useCallback(
//     (title) => onFieldChange({ title }),
//     [onFieldChange]
//   );
//   const changeNotes = React.useCallback(
//     (notes) => onFieldChange({ notes }),
//     [onFieldChange]
//   );
//   const changeStartDate = React.useCallback(
//     (startDate) => onFieldChange({ startDate }),
//     [onFieldChange]
//   );
//   const changeEndDate = React.useCallback(
//     (endDate) => onFieldChange({ endDate }),
//     [onFieldChange]
//   );
//   const changeAllDay = React.useCallback(
//     (allDay) => onFieldChange({ allDay }),
//     [onFieldChange]
//   );
//   const changeResources = React.useCallback(
//     (resource) => onFieldChange(resource),
//     [onFieldChange]
//   );

//   const { rRule, startDate } = appointmentData;
//   const changeFrequency = React.useCallback(
//     (value) =>
//       handleChangeFrequency(
//         value ? REPEAT_TYPES.DAILY : REPEAT_TYPES.NEVER,
//         rRule,
//         startDate,
//         onFieldChange
//       ),
//     [rRule, startDate, onFieldChange]
//   );
//   const errors = React.useContext(MyContext);
//   console.log("basicLayout_errors", errors);
//   return (
//     <div
//       className={classNames(
//         {
//           [classes.root]: true,
//           [classes.fullSize]: fullSize,
//           [classes.halfSize]: !fullSize,
//         },
//         className
//       )}
//       {...restProps}
//     >
//       <Label text={getMessage("detailsLabel")} type={TITLE} />
//       <TextEditor
//         error={errors.title ? true : false}
//         helperText={errors.title ? errors.title.message : null}
//         placeholder={getMessage("titleLabel")}
//         readOnly={readOnly}
//         type={TITLE_TEXT_EDITOR}
//         value={errors.title ? errors.title.value : appointmentData.title}
//         onValueChange={changeTitle}
//       />
//       <Grid container alignItems="center" className={classes.dateEditors}>
//         <JapanDateEditor
//           className={classes.dateEditor}
//           readOnly={readOnly}
//           value={
//             errors.startDate
//               ? errors.startDate.value
//               : appointmentData.startDate
//           }
//           onValueChange={changeStartDate}
//           locale={locale}
//           error={errors.startDate ? true : false}
//           helperText={errors.startDate ? errors.startDate.message : null}
//           excludeTime={appointmentData.allDay}
//         />
//         <Label text="-" className={classes.dividerLabel} />
//         <JapanDateEditor
//           className={classes.dateEditor}
//           readOnly={readOnly}
//           value={
//             errors.endDate ? errors.endDate.value : appointmentData.endDate
//           }
//           onValueChange={changeEndDate}
//           locale={locale}
//           excludeTime={appointmentData.allDay}
//           error={errors.endDate ? true : false}
//           helperText={errors.endDate ? errors.endDate.message : null}
//         />
//       </Grid>
//       <Grid container className={classes.booleanEditors}>
//         <BooleanEditor
//           label={getMessage("allDayLabel")}
//           readOnly={readOnly}
//           value={appointmentData.allDay}
//           onValueChange={changeAllDay}
//         />
//         <BooleanEditor
//           label={getMessage("repeatLabel")}
//           readOnly={readOnly}
//           value={!!appointmentData.rRule}
//           onValueChange={changeFrequency}
//         />
//       </Grid>
//       <Label
//         text={getMessage("moreInformationLabel")}
//         type={TITLE}
//         className={classes.labelWithMargins}
//       />
//       <TextEditor
//         placeholder={getMessage("notesLabel")}
//         readOnly={readOnly}
//         type={MULTILINE_TEXT_EDITOR}
//         value={appointmentData.notes}
//         onValueChange={changeNotes}
//         className={classes.notesEditor}
//       />
//       {resources.map((resource) => (
//         <React.Fragment key={resource.fieldName}>
//           <Label
//             text={resource.title}
//             type={TITLE}
//             className={classes.labelWithMargins}
//           />
//           <ResourceEditor
//             readOnly={readOnly}
//             resource={resource}
//             appointmentResources={appointmentResources}
//             onResourceChange={changeResources}
//           />
//         </React.Fragment>
//       ))}

//       {children}
//     </div>
//   );
// };

// LayoutBase.propTypes = {
//   textEditorComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
//     .isRequired,
//   dateEditorComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
//     .isRequired,
//   selectComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
//     .isRequired,
//   labelComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
//     .isRequired,
//   booleanEditorComponent: PropTypes.oneOfType([
//     PropTypes.func,
//     PropTypes.object,
//   ]).isRequired,
//   resourceEditorComponent: PropTypes.oneOfType([
//     PropTypes.func,
//     PropTypes.object,
//   ]).isRequired,
//   locale: PropTypes.oneOfType([
//     PropTypes.string,
//     PropTypes.arrayOf(PropTypes.string),
//   ]).isRequired,
//   children: PropTypes.node,
//   className: PropTypes.string,
//   classes: PropTypes.object.isRequired,
//   getMessage: PropTypes.func.isRequired,
//   onFieldChange: PropTypes.func,
//   appointmentData: PropTypes.shape({
//     title: PropTypes.string,
//     startDate: PropTypes.instanceOf(Date),
//     endDate: PropTypes.instanceOf(Date),
//     rRule: PropTypes.string,
//     notes: PropTypes.string,
//     additionalInformation: PropTypes.string,
//     allDay: PropTypes.bool,
//   }).isRequired,
//   resources: PropTypes.array,
//   appointmentResources: PropTypes.array,
//   readOnly: PropTypes.bool,
//   fullSize: PropTypes.bool.isRequired,
// };

// LayoutBase.defaultProps = {
//   onFieldChange: () => undefined,
//   resources: [],
//   appointmentResources: [],
//   className: undefined,
//   readOnly: false,
//   children: null,
// };

// export const Layout = withStyles(styles)(LayoutBase);
