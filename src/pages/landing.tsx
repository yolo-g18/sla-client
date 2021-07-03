import { useSelector, useDispatch } from "react-redux";
import { RootStore } from "../utils/TypeScript";
import { logout as logoutUser } from "../redux/actions/authAction";
import { useEffect } from "react";

const landing = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logoutUser());
  });

  return (
    <div>
      <div className="flex relative z-20 items-center">
        <div className="container mx-auto px-6 flex flex-col justify-between items-center relative py-4">
          <div className="flex flex-col">
            <img
              src="/images/person/11.webp"
              className="rounded-full w-28 mx-auto"
            />
            <p className="text-3xl my-6 text-center dark:text-white">
              Goodbye, I'm Charlie 🤘
            </p>
            <h2 className="max-w-3xl text-5xl md:text-6xl font-bold mx-auto dark:text-white text-gray-800 text-center py-2">
              Building digital products, brands, and experiences.
            </h2>
            <div className="flex items-center justify-center mt-4">
              <a
                href=""
                className="uppercase py-2 my-2 px-4 md:mt-16 bg-transparent dark:text-gray-800 dark:bg-white hover:dark:bg-gray-100 border-2 border-gray-800 text-gray-800 dark:text-white hover:bg-gray-800 hover:text-white text-md"
              >
                CONNECT WITH ME
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default landing;
