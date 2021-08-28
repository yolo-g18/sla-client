import { errorsApiRes, FormSubmit, RootStore } from "../../utils/TypeScript";
import { useDispatch, useSelector } from "react-redux";
import ProfileSettingLayout from "../../components/layout/ProfileSettingLayout";
import InputGroup from "../../components/input/InputGroup";
import InputArea from "../../components/input/InputArea";

import { useState, useEffect } from "react";
import { postAPI, putAPI } from "../../utils/FetchData";
import { PARAMS } from "../../common/params";
import { ALERT } from "../../redux/types/alertType";
import { getUserProfile } from "../../redux/actions/authAction";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

//alert
function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

let emailRegex = new RegExp(PARAMS.EMAIL_REGEX);

const profile = () => {
  const { auth, alert } = useSelector((state: RootStore) => state);

  const [firstname, setFirstName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [address, setAddress] = useState("");
  const [job, setJob] = useState("");
  const [major, setMajor] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [avatar, setAvatar] = useState("");

  const [isToastOpen, setIsToastOpen] = useState(false);
  const [typeToast, setTypeToast] = useState("success");
  const [messageToast, setMessageToast] = useState("");

  const [emailErr, setEmailErr] = useState("");
  const [bioErr, setBioErr] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const dispatch = useDispatch();

  //handel close toast
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setIsToastOpen(false);
  };

  useEffect(() => {
    setIsUploading(false);
    if (!emailRegex.test(email)) {
      setEmailErr("Email is invalid");
    } else setEmailErr("");

    //check bio length
    if (bio.length > 500) {
      setBioErr("Bio can not exceed 500 characters");
    }
  }, [email, bio]);

  //int value to form
  useEffect(() => {
    setFirstName(
      auth.userResponse?.firstname ? auth.userResponse?.firstname : ""
    );
    setLastname(auth.userResponse?.lastname ? auth.userResponse?.lastname : "");
    setEmail(auth.userResponse?.email ? auth.userResponse?.email : "");
    setBio(auth.userResponse?.bio ? auth.userResponse?.bio : "");
    setAddress(auth.userResponse?.address ? auth.userResponse?.address : "");
    setJob(auth.userResponse?.job ? auth.userResponse?.job : "");
    setMajor(auth.userResponse?.major ? auth.userResponse?.major : "");
    setSchoolName(
      auth.userResponse?.schoolName ? auth.userResponse?.schoolName : ""
    );
    setAvatar(auth.userResponse?.avatar ? auth.userResponse.avatar : "");
  }, [auth.userResponse]);

  const handleSubmit = async (e: any) => {
    if (emailErr || bioErr) return;

    const data = {
      firstname,
      lastname,
      email,
      bio,
      major,
      job,
      schoolName,
      address,
      avatar,
    };

    console.log(data);

    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      const res = await putAPI(`${PARAMS.ENDPOINT}me`, data);
      dispatch({ type: ALERT, payload: { loading: false } });
      dispatch(getUserProfile());
      setMessageToast("Updated");
      setTypeToast("success");
      setIsToastOpen(true);
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data } });
      dispatch({ type: ALERT, payload: { loading: false } });
      setIsToastOpen(true);
      setTypeToast("error");
      setMessageToast("An error occurred");
    }
  };

  const handleInputChange = async (e: any) => {
    const data = new FormData();
    data.append("file", e.target.files[0]);
    console.log("data: " + JSON.stringify(data));

    try {
      setIsUploading(true);
      const res = await postAPI(`${PARAMS.ENDPOINT}storage/upload`, data);
      setIsUploading(false);
      setAvatar(res.data);
      console.warn(res.data);
    } catch (err) {
      setIsUploading(false);
      setIsToastOpen(true);
      setTypeToast("warning");
      setMessageToast("Please make sure the uploaded file is less than 5MB");
    }
  };

  return (
    <div>
      <ProfileSettingLayout>
        <div className="grid grid-cols-3 h-full">
          <div className="col-span-2 px-4">
            <div>
              <p className="text-xl font-bold text-gray-600 mb-4">
                Public Profile
              </p>
              <form className="w-full max-w-lg">
                <div className="flex flex-wrap my-1">
                  <div className="lg:w-1/2 px-1">
                    <InputGroup
                      type="text"
                      setValue={setFirstName}
                      placeholder="your first name"
                      value={firstname}
                      label="First name"
                    />
                  </div>
                  <div className="lg:w-1/2 px-1">
                    <InputGroup
                      type="text"
                      setValue={setLastname}
                      placeholder="your last name"
                      value={lastname}
                      label="Last name"
                    />
                  </div>
                  <p className="text-gray-600 text-xs px-1 -mt-3 mb-2">
                    Your name may appear around SLA with your study sets.
                  </p>
                </div>

                <div className="px-1">
                  <InputArea
                    setValue={setBio}
                    placeholder="your bio"
                    error={bioErr}
                    value={bio}
                    label="Bio"
                  />
                </div>

                <div className="px-1">
                  <InputGroup
                    type="text"
                    setValue={setAddress}
                    placeholder="your address"
                    value={address}
                    label="Address"
                  />
                </div>
                <div className="flex flex-wrap my-1">
                  <div className="lg:w-1/2 px-1">
                    <InputGroup
                      type="text"
                      setValue={setJob}
                      placeholder="your job"
                      value={job}
                      label="Job"
                    />
                  </div>
                  <div className="lg:w-1/2 px-1">
                    <InputGroup
                      type="text"
                      setValue={setMajor}
                      placeholder="your major"
                      // error={
                      //   !isUsernameTyping ? alert.errors?.errors?.username : ""
                      // }
                      value={major}
                      label="Major"
                    />
                  </div>
                </div>

                <div className="px-1">
                  <InputGroup
                    type="text"
                    setValue={setSchoolName}
                    placeholder="your school"
                    // error={
                    //   !isUsernameTyping ? alert.errors?.errors?.username : ""
                    // }
                    value={schoolName}
                    label="School"
                  />
                </div>
                <div className="px-1">
                  <button
                    className="w-36 mt-2 shadow bg-blue-500 hover:bg-blue-600 text-sm focus:outline-none text-white py-2 rounded-sm"
                    type="button"
                    onClick={(e) => handleSubmit(e)}
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
                      "Update profile"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="col-span-1 px-4">
            <div className="py-3 center mx-auto">
              <div className=" px-4 py-5 text-center w-48">
                <div className="mb-4">
                  <img
                    className="w-40 h-40 mx-auto rounded-full object-cover object-center"
                    src={`${avatar ? avatar : "../../user.svg"}`}
                    alt="Avatar Upload"
                  />
                </div>
                <label className="cursor-pointer mt-6">
                  <span className="mt-2 leading-normal px-4 py-2 bg-blue-500 text-white text-sm rounded-sm">
                    {isUploading ? "Loading..." : "Select Avatar"}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    name="upload_file"
                    onChange={(e) => handleInputChange(e)}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
        <Snackbar
          open={isToastOpen}
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity={
              typeToast === "success"
                ? "success"
                : typeToast === "error"
                ? "error"
                : "warning"
            }
          >
            {messageToast}
          </Alert>
        </Snackbar>
      </ProfileSettingLayout>
    </div>
  );
};

export default profile;
