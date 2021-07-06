import { FormSubmit } from "../../utils/TypeScript";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import InputGroup from "../../components/input/InputGroup";

import { RootStore } from "../../utils/TypeScript";
import Link from "next/link";
import { loginAction, clearError } from "../../redux/actions/authAction";

const login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isUsernameTyping, setIsUsernameTyping] = useState(false);
  const [isPasswordTyping, setIsPasswordTyping] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setIsUsernameTyping(true);
  }, [username]);

  useEffect(() => {
    setIsPasswordTyping(true);
  }, [password]);

  const handleSubmit = (e: FormSubmit) => {
    setIsUsernameTyping(false);
    setIsPasswordTyping(false);

    e.preventDefault();
    const data = { username, password };
    console.log(data);
    dispatch(loginAction(data));
  };

  const { auth, alert } = useSelector((state: RootStore) => state);
  const router = useRouter();
  useEffect(() => {
    if (auth.authenticationToken) router.push("/home");
  }, [auth.authenticationToken]);

  const clearError = () => {
    dispatch(clearError());
  };

  console.log(auth);

  return (
    <div>
      <div className="bg-gray-100 min-h-screen flex flex-col">
        <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
          <div className="bg-white px-6 py-8 rounded shadow-sm text-black w-full">
            <h1 className="font-mono text-3xl mb-1 text-center">Join SLA</h1>
            <div className="rounded-t mb-0 px-6 py-6">
              <div className="text-center mb-3">
                <h6 className="text-gray-600 text-sm font-bold">
                  Sign in with
                </h6>
              </div>
              <div className="btn-wrapper text-center">
                <button
                  className="bg-white active:bg-gray-100 text-gray-800 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center text-xs"
                  type="button"
                >
                  <img
                    src="https://img.icons8.com/ios-filled/150/000000/facebook-new.png"
                    className="w-5 mr-1"
                  />
                  Facebook
                </button>
                <button
                  className="bg-white active:bg-gray-100 text-gray-800 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 uppercase shadow hover:shadow-md inline-flex items-center text-xs"
                  type="button"
                >
                  <img
                    alt="..."
                    className="w-5 mr-1"
                    src="https://img.icons8.com/color/144/000000/google-logo.png"
                  />
                  Google
                </button>
              </div>
              <hr className="mt-6 border-b-1 border-gray-400" />
            </div>
            <div>
              <div className="text-gray-500 text-center mb-3 font-bold">
                <small>Or sign in with credentials</small>
              </div>
              <form onSubmit={handleSubmit}>
                <InputGroup
                  type="text"
                  setValue={setUsername}
                  placeholder="Username"
                  error={
                    !isUsernameTyping ? alert.errors?.errors?.username : ""
                  }
                  required
                  label="Username"
                />
                <InputGroup
                  type="password"
                  setValue={setPassword}
                  placeholder="Password"
                  error={
                    !isPasswordTyping ? alert.errors?.errors?.password : ""
                  }
                  required
                  label="Password"
                />
                <div className="my-2">
                  <small className="font-medium text-red-600">
                    {alert.errors?.message}
                  </small>
                </div>
                <Link href="#">
                  <a
                    href="#"
                    className="text-sm float-right text-blue-600 hover:underline focus:text-blue-600"
                  >
                    Forgot Password?
                  </a>
                </Link>

                <button className="w-full mt-4 text-center py-3 rounded bg-green-500 hover:bg-green-600 text-white hover:bg-green-dark focus:outline-none my-1">
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
                    "Login"
                  )}
                </button>
              </form>
            </div>
          </div>
          <div className="text-grey-dark mt-4">
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
    </div>
  );
};

export default login;
