import { FormSubmit } from "../../utils/TypeScript";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import InputGroup from "../../components/input/InputGroup";

import { RootStore } from "../../utils/TypeScript";
import Link from "next/link";
import { loginAction, clearError } from "../../redux/actions/authAction";
import { PARAMS } from "../../common/params";
import { ALERT } from "../../redux/types/alertType";
import { postAPIWithoutHeaders } from "../../utils/FetchData";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

//alert
function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const emailRegex = new RegExp(PARAMS.EMAIL_REGEX);

const login = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isUsernameTyping, setIsUsernameTyping] = useState(false);
  const [isPasswordTyping, setIsPasswordTyping] = useState(false);

  const [emailErr, setEmailErr] = useState("");

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

  const dispatch = useDispatch();

  useEffect(() => {
    if (!emailRegex.test(email)) {
      setEmailErr("Email is invalid");
    } else setEmailErr("");
  }, [email]);

  useEffect(() => {
    setIsUsernameTyping(true);
  }, [username]);

  useEffect(() => {
    setIsPasswordTyping(true);
  }, [password]);

  const handleSubmit = async (e: FormSubmit) => {
    setIsUsernameTyping(false);
    setIsPasswordTyping(false);

    e.preventDefault();
    if (showResetPassword) {
      if (emailErr) return;
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await postAPIWithoutHeaders(
          `${PARAMS.ENDPOINT}auth/forgotPassword`,
          {
            email,
          }
        );
        dispatch({ type: ALERT, payload: { loading: false } });
        setMessageToast(
          "You should have received a confirmation email notifying you that your password has been reset"
        );
        setTypeToast("success");
        setIsToastOpen(true);
        setShowModalPassword(false);
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
        setEmailErr(err.response.data.message);
      }
    } else {
      const data = { username, password };
      dispatch(loginAction(data));
    }
  };

  const { auth, alert } = useSelector((state: RootStore) => state);
  const router = useRouter();
  useEffect(() => {
    if (auth.roles) {
      if (auth.roles?.includes("ROLE_ADMIN")) {
        router.push("/admin");
      } else {
        router.push("/home");
      }
    } else {
      if (localStorage.getItem("access-token")) {
        router.push("/home");
      }
    }
  }, [auth.roles]);

  const clearError = () => {
    dispatch(clearError());
  };

  const [showResetPassword, setShowModalPassword] = useState(false);

  const handelForgotPassword = async () => {};

  return (
    <div>
      <div className="bg-gray-100 min-h-screen flex flex-col">
        <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
          <div className="bg-white px-6 py-8 rounded shadow-lg text-black w-full">
            <h1 className="font-mono text-3xl mb-16 text-center">Join SLA</h1>

            <div className="mt-10">
              <form onSubmit={handleSubmit}>
                <InputGroup
                  type="text"
                  setValue={setUsername}
                  placeholder="Username"
                  error={
                    !isUsernameTyping ? alert.errors?.errors?.username : ""
                  }
                  label="Username"
                />
                <InputGroup
                  type="password"
                  setValue={setPassword}
                  placeholder="Password"
                  error={
                    !isPasswordTyping ? alert.errors?.errors?.password : ""
                  }
                  label="Password"
                />
                <div className="my-2">
                  <small className="font-medium text-red-600">
                    {alert.errors?.message}
                  </small>
                </div>
                <Link href="#">
                  <a
                    className="text-sm float-right text-blue-600 hover:underline focus:text-blue-600"
                    onClick={() => setShowModalPassword(!showResetPassword)}
                  >
                    {showResetPassword ? "Cancel" : "Forgot Password?"}
                  </a>
                </Link>
                {showResetPassword ? (
                  <div>
                    <p className="my-6 text-gray-700">Reset password</p>
                    <InputGroup
                      type="text"
                      placeholder="Email"
                      setValue={setEmail}
                      error={emailErr}
                      required
                      label="Email"
                    />
                    {/* <div className="my-2">
                      <small className="font-medium text-red-600">
                        {resetPwsErr}
                      </small>
                    </div> */}
                    <div className="   mx-auto text-center">
                      <small className="text-gray-600 text-xs px-1 mb-2">
                        *Enter your email address and we'll email you a reset
                        password
                      </small>
                    </div>
                  </div>
                ) : null}
                <button
                  className="w-full mt-10 text-center py-2 rounded bg-blue-500 hover:bg-blue-600
                 text-white hover:bg-green-dark focus:outline-none my-1"
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
                  ) : showResetPassword ? (
                    "Reset"
                  ) : (
                    "Login"
                  )}
                </button>
              </form>
            </div>
          </div>
          <div className="text-grey-dark mt-10">
            New to SLA?{" "}
            <Link href="/auth/register">
              <a
                className="no-underline border-b border-blue text-blue-600 hover:underline focus:text-blue-600"
                onClick={clearError}
              >
                Create an account.
              </a>
            </Link>
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
          severity={typeToast === "success" ? "success" : "error"}
        >
          {messageToast}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default login;
