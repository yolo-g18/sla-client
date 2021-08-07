import { isFuture } from "date-fns/esm";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PARAMS } from "../../common/params";
import InputGroup from "../../components/input/InputGroup";
import ProfileSettingLayout from "../../components/layout/ProfileSettingLayout";
import { ALERT } from "../../redux/types/alertType";
import { putAPI } from "../../utils/FetchData";
import { FormSubmit, RootStore } from "../../utils/TypeScript";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { isBuffer } from "lodash";

//alert
function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const account = () => {
  const dispatch = useDispatch();
  const { auth, alert } = useSelector((state: RootStore) => state);

  const [oldPws, setOldPws] = useState("");
  const [newPws, setNewPws] = useState("");
  const [reNewPws, setReNewPws] = useState("");

  const [oldPwsErr, setOldPwsErr] = useState("");
  const [newPwsErr, setNewPwsErr] = useState("");
  const [reNewPwsErr, setReNewPwsErr] = useState("");

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
    setOldPwsErr("");
  }, [oldPws]);
  useEffect(() => {
    setNewPwsErr("");
  }, [newPws]);
  useEffect(() => {
    setReNewPwsErr("");
  }, [reNewPws]);

  const checkValid = () => {
    if (oldPws.length < 5 || oldPws.length > 20) {
      setOldPwsErr("Password length must be between 5 and 20 characters");
    } else setOldPwsErr("");
    if (newPws.length < 5 || newPws.length > 20) {
      setNewPwsErr("Password length must be between 5 and 20 characters");
    } else setNewPwsErr("");
    if (reNewPws.length < 5 || reNewPws.length > 20) {
      setReNewPwsErr("Password length must be between 5 and 20 characters");
    } else setReNewPwsErr("");
    if (newPws !== reNewPws) {
      setReNewPwsErr("Not match");
    }
  };

  const handleSubmit = async () => {
    checkValid();
    if (
      oldPws.length < 5 ||
      oldPws.length > 20 ||
      newPws.length < 5 ||
      newPws.length > 20 ||
      reNewPws.length < 5 ||
      reNewPws.length > 20 ||
      newPws !== reNewPws
    ) {
      return;
    }
    const data = {
      oldPassword: oldPws,
      newPassword: newPws,
    };

    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      const res = await putAPI(`${PARAMS.ENDPOINT}me/changePassword`, data);
      dispatch({ type: ALERT, payload: { loading: false } });
      setMessageToast("Updated");
      setTypeToast("success");
      setIsToastOpen(true);
      setOldPws("");
      setNewPws("");
      setReNewPws("");
    } catch (err) {
      dispatch({ type: ALERT, payload: { loading: false } });
      if (err.response.data.status === 400) {
        setIsToastOpen(true);
        setTypeToast("error");
        setMessageToast(err.response.data.message);
      } else {
        setIsToastOpen(true);
        setTypeToast("error");
        setMessageToast("An error occurred");
      }
      console.log(err.response.data.message);
    }
  };
  return (
    <div>
      <ProfileSettingLayout>
        <p className="text-xl font-bold text-gray-600 mb-4">Change Password</p>
        <form>
          <div className="lg:w-2/5 w-full">
            <InputGroup
              type="password"
              setValue={setOldPws}
              placeholder=""
              value={oldPws}
              label="Current Password"
              error={oldPwsErr}
              required
            />
            <InputGroup
              type="password"
              setValue={setNewPws}
              placeholder=""
              value={newPws}
              label="New Password"
              error={newPwsErr}
              required
            />
            <InputGroup
              type="password"
              setValue={setReNewPws}
              placeholder=""
              value={reNewPws}
              label="Confirm New Password"
              error={reNewPwsErr}
              required
            />
          </div>
          <div className="px-1">
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
        </form>
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

export default account;
