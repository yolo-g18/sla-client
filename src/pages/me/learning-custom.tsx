import { useState } from "react";
import ProfileSettingLayout from "../../components/layout/ProfileSettingLayout";

import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
} from "@material-ui/pickers";
import { useEffect } from "react";
import { getAPI, putAPI } from "../../utils/FetchData";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "../../utils/TypeScript";
import dayjs from "dayjs";
import { ALERT } from "../../redux/types/alertType";
import { PARAMS } from "../../common/params";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { getUserProfile } from "../../redux/actions/authAction";

//alert
function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const todayObj = dayjs();

const learningCustom = () => {
  const dispatch = useDispatch();
  const { auth, alert } = useSelector((state: RootStore) => state);

  const [favourTimeFrom, setFavourTimeFrom] = useState<Date | null>();
  const [favourTimeTo, setFavourTimeTo] = useState<Date | null>();

  const [timeInputErr, setTimeInputErr] = useState("");

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

  useEffect(() => {
    setFavourTimeFrom(
      auth.userResponse?.favourTimeFrom
        ? auth.userResponse?.favourTimeFrom
        : new Date(todayObj.toString())
    );
    setFavourTimeTo(
      auth.userResponse?.favourTimeTo
        ? auth.userResponse?.favourTimeTo
        : new Date(todayObj.toString())
    );
    console.log(favourTimeTo + ":" + favourTimeFrom);
  }, [auth.userResponse]);

  useEffect(() => {
    console.log("onChange: " + favourTimeFrom + ":" + favourTimeTo);
    const from = new Date(
      favourTimeFrom?.toString() ? favourTimeFrom?.toString() : ""
    );
    const to = new Date(
      favourTimeTo?.toString() ? favourTimeTo?.toString() : ""
    );
    if (favourTimeFrom && favourTimeTo) {
      if (from > to) {
        setTimeInputErr("Invalid time");
      } else {
        setTimeInputErr("");
      }
    }
  }, [favourTimeFrom, favourTimeTo]);

  const handleSubmit = async () => {
    if (timeInputErr) return;

    const data = {
      favourTimeFrom: favourTimeFrom,
      favourTimeTo: favourTimeTo,
    };
    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      const res = await putAPI(`${PARAMS.ENDPOINT}me/changeFavorTime`, data);
      dispatch({ type: ALERT, payload: { loading: false } });
      dispatch(getUserProfile());
      setMessageToast("Updated");
      setTypeToast("success");
      setIsToastOpen(true);
    } catch (err) {
      console.log(err);
      dispatch({ type: ALERT, payload: { loading: false } });
      setIsToastOpen(true);
      setTypeToast("error");
      setMessageToast("An error occurred");
    }
  };

  return (
    <div>
      <ProfileSettingLayout>
        <div className="lg:w-2/3 w-full">
          <p className="text-xl font-bold text-gray-600">
            Let us know the ideal time of day for you to study
          </p>
          <small className="text-gray-600 font-normal">
            *This time will be reminded by SLA every day
          </small>
          <div className="mt-4">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
                <div className="col-span-1">
                  <KeyboardTimePicker
                    margin="normal"
                    id="time-picker"
                    label="From"
                    ampm={false}
                    value={favourTimeFrom}
                    onChange={setFavourTimeFrom}
                    KeyboardButtonProps={{
                      "aria-label": "change time",
                    }}
                  />
                </div>
                <div className="col-span-1">
                  <KeyboardTimePicker
                    margin="normal"
                    id="time-picker"
                    label="To"
                    ampm={false}
                    value={favourTimeTo}
                    onChange={setFavourTimeTo}
                    KeyboardButtonProps={{
                      "aria-label": "change time",
                    }}
                  />
                  <small className="font-medium text-red-600">
                    {timeInputErr}
                  </small>
                </div>
              </div>
            </MuiPickersUtilsProvider>
          </div>

          <div className="mt-10">
            <button
              className="w-36 mt-2 shadow bg-blue-500 hover:bg-blue-600 text-sm focus:outline-none text-white py-2 rounded-sm"
              type="button"
              onClick={handleSubmit}
            >
              {alert.loading ? (
                <div className="flex justify-center items-center space-x-1">
                  <svg
                    fill="none"
                    className="w-6 h-6 animate-spin"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      clipRule="evenodd"
                      d="M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z"
                      fill="currentColor"
                      fillRule="evenodd"
                    />
                  </svg>
                </div>
              ) : (
                "Update"
              )}
            </button>
          </div>
        </div>
        <Snackbar
          open={isToastOpen}
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity={typeToast === "success" ? "success" : "error"}
          >
            {messageToast}
          </Alert>
        </Snackbar>
      </ProfileSettingLayout>
    </div>
  );
};

export default learningCustom;
