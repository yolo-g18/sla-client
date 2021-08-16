import { useDispatch } from "react-redux";
import Link from "next/link";
import { logout as logoutUser } from "../redux/actions/authAction";
import { useEffect } from "react";

const goodbye = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logoutUser());
  }, []);

  return (
    <div>
      <div className="flex relative z-20 items-center ">
        <div className="container mx-auto px-6 flex flex-col justify-between items-center relative py-4">
          {/* <img
            src="goodbye_bg.png"
            alt=""
            width="500px"
            className="my-auto backdrop-filter backdrop-blur-lg opacity-20"
          /> */}
        </div>
      </div>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 backdrop-filter backdrop-blur-md -mt-12">
        <div className="flex absolute top-16">
          <div className="ml-3 relative">
            <Link href="/auth/login">
              <button className="flex p-2 items-center text-gray-600 rounded-lg hover:text-gray-400 text-xl font-medium focus:outline-none">
                Login
              </button>
            </Link>
          </div>
          <div className="px-0 ml-4 relative">
            <Link href="/auth/register">
              <button className="flex p-2 items-center text-gray-600 rounded-lg hover:text-gray-400 text-xl font-medium focus:outline-none">
                Sign up
              </button>
            </Link>
          </div>
        </div>
        <h1 className="text-6xl font-bold text-gray-700">Goodbye</h1>
      </div>
    </div>
  );
};

export default goodbye;
