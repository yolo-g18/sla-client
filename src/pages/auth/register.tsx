import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import InputGroup from "../../components/InputGroup";
import { IErrors, FormSubmit, InputChange } from "../../utils/TypeScript";
import { registerAction } from "../../redux/actions/authAction";

import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "../../utils/TypeScript";
import Link from "next/link";

const register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailTyping, setIsEmailTyping] = useState(false);
  const [isUsernameTyping, setIsUsernameTyping] = useState(false);
  const [isPasswordTyping, setIsPasswordTyping] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setIsEmailTyping(true);
  }, [email]);

  useEffect(() => {
    setIsUsernameTyping(true);
  }, [username]);

  useEffect(() => {
    setIsPasswordTyping(true);
  }, [password]);

  const handleSubmit = (e: FormSubmit) => {
    setIsEmailTyping(false);
    setIsUsernameTyping(false);
    setIsPasswordTyping(false);

    e.preventDefault();
    const data = { email, username, password };
    console.log(data);

    dispatch(registerAction(data));
  };

  const { alert } = useSelector((state: RootStore) => state);
  const router = useRouter();
  if (alert.success) {
    router.push({
      pathname: "/active-account/[username]",
      query: { username: username },
    });
  }

  console.log(alert.loading);

  return (
    <div>
      <div className="bg-gray-100 min-h-screen flex flex-col">
        <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
          <div className="bg-white px-6 py-8 rounded shadow-sm text-black w-full">
            <h5 className="font-mono mb-1 text-center">Join SLA</h5>
            <h1 className="mb-8 text-3xl text-center">Sign up</h1>
            <form onSubmit={handleSubmit}>
              <InputGroup
                type="text"
                placeholder="Email"
                setValue={setEmail}
                error={!isEmailTyping ? alert.errors?.errors?.email : ""}
                required
                label="Email"
              />
              <InputGroup
                type="text"
                setValue={setUsername}
                placeholder="Username"
                error={!isUsernameTyping ? alert.errors?.errors?.username : ""}
                required
                label="Username"
              />
              <InputGroup
                type="password"
                setValue={setPassword}
                placeholder="Password"
                error={!isPasswordTyping ? alert.errors?.errors?.password : ""}
                required
                label="Password"
              />
              <div className="my-2">
                <small className="font-medium text-red-600">
                  {alert.errors?.message}
                </small>
              </div>
              <button className="w-full text-center py-3 rounded bg-green-500 text-white hover:bg-green-dark focus:outline-none my-1">
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
                  "Create Account"
                )}
              </button>
              <div className="text-center text-sm text-grey-dark mt-4">
                By signing up, you agree to the{" "}
                <a
                  className="no-underline border-b border-gray-400 text-grey-dark"
                  href="#"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  className="no-underline border-b border-gray-400 text-grey-dark"
                  href="#"
                >
                  Privacy Policy
                </a>
              </div>
            </form>
          </div>
          <div className="text-grey-dark mt-6">
            Already have an account?{" "}
            <Link href="/auth/login">
              <a className="no-underline border-b border-blue text-blue-500 hover:underline focus:text-blue-500">
                Log in.
              </a>
            </Link>
            .
          </div>
        </div>
      </div>
    </div>
  );
};

export default register;
