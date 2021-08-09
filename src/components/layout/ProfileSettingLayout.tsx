import AppLayput2 from "./AppLayout";
import { RootStore } from "../../utils/TypeScript";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../sidebar/SideBar";
import { itemListProfile } from "../../common/listCommon";
import Link from "next/link";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

interface Props {
  children: React.ReactNode;
}

const ProfileSettingLayout = (props: Props) => {
  const { auth, alert } = useSelector((state: RootStore) => state);
  return (
    <div>
      <AppLayput2 title="me" desc="me">
        <div className="lg:w-2/3 mx-auto px-4">
          <div className="flex justify-around mt-4 ">
            <div className="flex flex-grow">
              <img
                className="w-8 h-8 my-auto rounded-full object-cover object-center"
                src={`${
                  auth.userResponse?.avatar
                    ? auth.userResponse?.avatar
                    : "../../user.svg"
                }`}
                alt="Avatar Upload"
              />
              <h2 className="font-bold text-2xl my-auto ml-4">
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
                <p className="text-sm text-gray-600 hover:underline cursor-pointer hover:text-gray-800">
                  <ChevronLeftIcon />
                  go to your library
                </p>
              </Link>
            </div>
          </div>
          <div className="grid lg:grid-cols-5 grid-cols-1 ">
            <div className="col-span-1 w-50 inset-y-0 left-0">
              <Sidebar links={itemListProfile} />.
            </div>
            <div className="col-span-4 mt-4 mb-44">{props.children}</div>
          </div>
        </div>
      </AppLayput2>
    </div>
  );
};

export default ProfileSettingLayout;
