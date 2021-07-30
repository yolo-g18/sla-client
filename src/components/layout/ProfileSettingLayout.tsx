import AppLayput2 from "./AppLayout";
import { RootStore } from "../../utils/TypeScript";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../sidebar/SideBar";
import { itemListProfile } from "../../common/listCommon";
import Link from "next/link";

interface Props {
  children: React.ReactNode;
}

const ProfileSettingLayout = (props: Props) => {
  const { auth, alert } = useSelector((state: RootStore) => state);
  return (
    <div>
      <AppLayput2 title="me" desc="me">
        <div className="lg:w-2/3 mx-auto">
          <div className="flex justify-around mt-4 b">
            <div className="flex flex-grow">
              <svg
                width="40"
                height="40"
                fill="currentColor"
                className="text-gray-800"
                viewBox="0 0 1792 1792"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M1523 1339q-22-155-87.5-257.5t-184.5-118.5q-67 74-159.5 115.5t-195.5 41.5-195.5-41.5-159.5-115.5q-119 16-184.5 118.5t-87.5 257.5q106 150 271 237.5t356 87.5 356-87.5 271-237.5zm-243-699q0-159-112.5-271.5t-271.5-112.5-271.5 112.5-112.5 271.5 112.5 271.5 271.5 112.5 271.5-112.5 112.5-271.5zm512 256q0 182-71 347.5t-190.5 286-285.5 191.5-349 71q-182 0-348-71t-286-191-191-286-71-348 71-348 191-286 286-191 348-71 348 71 286 191 191 286 71 348z" />
              </svg>
              <h2 className="font-bold text-2xl pt-4">
                {auth.userResponse?.username}
              </h2>
            </div>
            <div className="py-3 flex relative">
              <Link
                href={{
                  pathname: "/[username]/library/sets",
                  query: { username: auth.userResponse?.username },
                }}
              >
                <button
                  className="w-40 h-8 text-md flex items-center justify-center rounded-md px-4 
                   text-sm font-medium py-1 bg-white hover:text-gray-900 border-gray-300 border-2
                text-gray-600 hover:bg-green-dark focus:outline-none"
                >
                  go to your library
                </button>
              </Link>
            </div>
          </div>
          <div className="grid lg:grid-cols-5 grid-cols-1 ">
            <div className="col-span-1 w-50 inset-y-0 left-0">
              <Sidebar links={itemListProfile} />.
            </div>
            <div className="col-span-4 mb-44">{props.children}</div>
          </div>
        </div>
      </AppLayput2>
    </div>
  );
};

export default ProfileSettingLayout;
