import { useRouter } from "next/router";
import AppLayout2 from "../layout/AppLayput2";
import { RootStore } from "../../utils/TypeScript";
import { useSelector } from "react-redux";
import Link from "next/link";

interface Props {
  children: React.ReactNode;
}

const LibraryLayout = (props: Props) => {
  const { auth, alert } = useSelector((state: RootStore) => state);

  const router = useRouter();
  const {
    query: { username },
  } = router;

  //call api get user profile by username de lay ra fullname, address, email, school, job de hien thi
  const userProfileFake = {
    username: "_testuser0",
    fullname: "Nguyen Thai Duong",
    address: "Haiphong, Vietnam",
    school: "Fpt Uni",
    job: "student",
  };

  return (
    <div>
      <AppLayout2 title="library" desc="library">
        <h1 className="text-4xl pl-12 pt-6 font-semibold text-gray-800 dark:text-white">
          Library
        </h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8 overflow-auto h-screen">
          <div className=" col-span-1">
            <div className="flex flex-col justify-between items-center pt-10">
              <svg
                width="200"
                fill="currentColor"
                height="200"
                className="text-gray-800"
                viewBox="0 0 1792 1792"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M1523 1339q-22-155-87.5-257.5t-184.5-118.5q-67 74-159.5 115.5t-195.5 41.5-195.5-41.5-159.5-115.5q-119 16-184.5 118.5t-87.5 257.5q106 150 271 237.5t356 87.5 356-87.5 271-237.5zm-243-699q0-159-112.5-271.5t-271.5-112.5-271.5 112.5-112.5 271.5 112.5 271.5 271.5 112.5 271.5-112.5 112.5-271.5zm512 256q0 182-71 347.5t-190.5 286-285.5 191.5-349 71q-182 0-348-71t-286-191-191-286-71-348 71-348 191-286 286-191 348-71 348 71 286 191 191 286 71 348z" />
              </svg>
              <div className="w-full px-24">
                {userProfileFake.fullname ? (
                  <h2 className="text-xl pt-4">{userProfileFake.fullname}</h2>
                ) : null}
                <h2 className="font-bold text-2xl pt-4">
                  {userProfileFake.username}
                </h2>
                {userProfileFake.job ? (
                  <h2 className="text-md pt-1">
                    {userProfileFake.job},{" "}
                    {userProfileFake.school ? (
                      <span>{userProfileFake.school}</span>
                    ) : null}
                  </h2>
                ) : null}
                {userProfileFake.address ? (
                  <h2 className="text-md pt-2">{userProfileFake.address}</h2>
                ) : null}

                {userProfileFake.username === auth.userResponse?.username ? (
                  <button className="w-full mt-4 text-center py-1 rounded  text-gray-600 border-gray-300 border-2 hover:text-gray-900 my-1">
                    Edit profile
                  </button>
                ) : null}
              </div>
            </div>
          </div>
          <div className=" col-span-2 ">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 border-b border-gray-200">
              <div className="col-span-1 grid grid-cols-3 gap-2 mt-4 justify-around text-md text-gray-600 cursor-pointe">
                <Link
                  href={{
                    pathname: "/[username]/library/sets",
                    query: { username: username },
                  }}
                >
                  <a
                    className={`col-span-1 py-3 flex flex-grow justify-center hover:text-gray-900 ${
                      router.pathname.indexOf("/sets") !== -1
                        ? "justify-start border-b-2 border-yellow-500"
                        : ""
                    }`}
                  >
                    Sets
                  </a>
                </Link>
                <Link
                  href={{
                    pathname: "/[username]/library/folders",
                    query: { username: username },
                  }}
                >
                  <a
                    className={`col-span-1 py-3 flex flex-grow justify-center hover:text-gray-900 ${
                      router.pathname.indexOf("/folders") !== -1
                        ? "justify-start border-b-2 border-yellow-500"
                        : ""
                    }`}
                  >
                    Folders
                  </a>
                </Link>
                <Link
                  href={{
                    pathname: "/[username]/library/rooms",
                    query: { username: username },
                  }}
                >
                  <a
                    className={`col-span-1 py-3 flex flex-grow justify-center hover:text-gray-900 ${
                      router.pathname.indexOf("/room") !== -1
                        ? "justify-start border-b-2 border-yellow-500"
                        : ""
                    }`}
                  >
                    Rooms
                  </a>
                </Link>
              </div>
              <div className="col-span-2 mt-4 flex justify-around text-md text-gray-600  cursor-pointer">
                <div className="text-gray-900 py-3 flex flex-grow justify-center">
                  filter bar
                </div>
              </div>
            </div>
            <div className="bg-yellow-50">{props.children}</div>
          </div>
        </div>
      </AppLayout2>
    </div>
  );
};

export default LibraryLayout;
