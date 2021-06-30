import Link from "next/link";
import { useRouter } from "next/router";

interface Props {
  isHide: boolean;
}

const SideBar = (props: Props) => {
  const router = useRouter();

  const sidebarMenu = (
    <nav className="mt-10">
      <Link href="/home">
        <a
          className={`hover:text-gray-700 hover:bg-gray-100 flex items-center pl-6 py-2 my-6 transition-colors dark:hover:text-white dark:hover:bg-gray-600 duration-200 ${
            router.pathname.indexOf("/home") !== -1
              ? "justify-start border-r-4 border-green-500"
              : ""
          } `}
        >
          <img src="blackboard.svg" width="20" height="20" />
          <span className="mx-4 text-lg font-normal">Home</span>
          <span className="flex-grow text-right"></span>
        </a>
      </Link>
      <Link href="/schedule">
        <a
          className={`hover:text-gray-700 hover:bg-gray-100 flex items-center pl-6 py-2 my-6 transition-colors dark:hover:text-white dark:hover:bg-gray-600 duration-200 ${
            router.pathname.indexOf("/schedule") !== -1
              ? "ustify-start border-r-4 border-green-500"
              : ""
          } `}
        >
          <img src="schedule.svg" width="20" height="20" />
          <span className="mx-4 text-lg font-normal">Schedule</span>
          <span className="flex-grow text-right"></span>
        </a>
      </Link>
      <Link href="/library">
        <a
          className={`hover:text-gray-700 hover:bg-gray-100 flex items-center pl-6 py-2 my-6 transition-colors dark:hover:text-white dark:hover:bg-gray-600 duration-200 ${
            router.pathname.indexOf("/library") !== -1
              ? "ustify-start border-r-4 border-green-500"
              : ""
          } `}
        >
          <img src="library.svg" width="20" height="20" />
          <span className="mx-4 text-lg font-normal">Library</span>
          <span className="flex-grow text-right"></span>
        </a>
      </Link>
      <Link href="/activity">
        <a
          className={`hover:text-gray-700 hover:bg-gray-100 flex items-center pl-6 py-2 my-6 transition-colors dark:hover:text-white dark:hover:bg-gray-600 duration-200 ${
            router.pathname.indexOf("/activity") !== -1
              ? "justify-start border-r-4 border-green-500"
              : ""
          } `}
        >
          <img src="notebook.svg" width="20" height="20" />
          <span className="mx-4 text-lg font-normal">Activity Overview</span>
          <span className="flex-grow text-right"></span>
        </a>
      </Link>
      <Link href="/explore">
        <a
          className={`hover:text-gray-700 hover:bg-gray-100 flex items-center pl-6 py-2 my-6 transition-colors dark:hover:text-white dark:hover:bg-gray-600 duration-200 ${
            router.pathname.indexOf("/explore") !== -1
              ? "ustify-start border-r-4 border-green-500"
              : ""
          } `}
        >
          <img src="telescope.svg" width="20" height="20" />
          <span className="mx-4 text-lg font-normal">Explore</span>
          <span className="flex-grow text-right"></span>
        </a>
      </Link>
    </nav>
  );

  return (
    <div>
      {!props.isHide ? (
        <div className="h-screen my-4 ml-1 shadow-lg relative w-80 lg:block hidden">
          <div className="bg-white h-full rounded-2xl dark:bg-gray-700">
            <div className="flex items-center justify-start pt-6 ml-8">
              <Link href="/home">
                <span className="text-gray-600 dark:text-gray-300 ml-4 text-2xl font-bold">
                  SLA
                </span>
              </Link>
            </div>
            {sidebarMenu}
          </div>
        </div>
      ) : (
        <div className="absolute h-screen lg:hidden block pb-4 mb-4 w-80 ">
          <div className="bg-white h-full rounded-2xl dark:bg-gray-700 shadow-sm">
            <div className="flex left-2 items-center justify-start pt-4 ml-8">
              <svg
                width="20"
                height="20"
                className="text-gray-400"
                fill="currentColor"
                viewBox="0 0 1792 1792"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M1664 1344v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45z"></path>
              </svg>
              <Link href="/home">
                <span className="text-gray-600 dark:text-gray-300 ml-4 text-2xl font-bold">
                  SLA
                </span>
              </Link>
            </div>
            {sidebarMenu}
          </div>
        </div>
      )}
    </div>
  );
};

export default SideBar;
