import Link from "next/link";
import { useRouter } from "next/router";
import AppLayout from "./AppLayout";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import { useSelector } from "react-redux";
import { RootStore } from "../../utils/TypeScript";

import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import ShareIcon from "@material-ui/icons/Share";

interface Props {
  children: React.ReactNode;
}

const RoomLayout = (props: Props) => {
  const router = useRouter();

  const {
    query: { id },
  } = router;

  const { auth, alert, search } = useSelector((state: RootStore) => state);

  const room = {
    id: 1,
    name: "G18",
    desc: "Lớp Đồ Án This example uses a typographic feature called ligatures, which allows rendering of an icon glyph simply by using its textual name.",
    owner_name: "_testuser2",
    member: [
      { username: "Nguyen Van A", avatar: "andas" },
      { username: "Nguyen Van A", avatar: "andas" },
      { username: "Nguyen Van A", avatar: "andas" },
      { username: "Nguyen Van A", avatar: "andas" },
    ],
    sets: [
      {
        set_id: 1,
        title: "MAD101",
        desc: "dadas",
        numberOfCard: 34,
      },
      {
        set_id: 1,
        title: "MAD101",
        desc: "dadas",
        numberOfCard: 34,
      },
      {
        set_id: 1,
        title: "MAD101",
        desc: "dadas",
        numberOfCard: 34,
      },
      {
        set_id: 1,
        title: "MAD101",
        desc: "dadas",
        numberOfCard: 34,
      },
    ],
    folders: [
      { title: "folder1", desc: "dasdas" },
      { title: "folder1", desc: "dasdas" },
      { title: "folder1", desc: "dasdas" },
      { title: "folder1", desc: "dasdas" },
    ],
  };

  return (
    <div>
      <AppLayout title="room" desc="room">
        <div className="grid lg:grid-cols-4 gap-6 grid-cols-1 self-center lg:w-4/5 w-full px-2 mt-4">
          {/* left side */}
          <div className="col-span-1 px-2 border-r-2 border-gray-200  ">
            <div className=" w-full px-2">
              <div className="w-full flex items-center">
                <div>
                  <PeopleAltIcon fontSize="large" className="text-3xl" />
                </div>
                <div className="px-3 mr-auto">
                  <h4 className="font-bold text-xl">{room.name}</h4>
                  <small className="text-md">
                    create by{" "}
                    <a href={`${room.owner_name}/library/sets`}>
                      {room.owner_name}
                    </a>
                  </small>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-light text-gray-800">{room.desc}</p>
              </div>
            </div>
          </div>
          {/* right side */}
          <div className="col-span-3 h-screen">
            <div className="flex justify-between mt-2">
              <div className="fex flex-col">
                <a href={`/${room.owner_name}/library/folders`}>
                  <span className="hover:underline hover:text-gray-700">
                    back to library folder
                  </span>
                </a>
              </div>
              {/* toolbar */}
              <div className="flex flex-row">
                {room.owner_name === auth.userResponse?.username ? (
                  <div>
                    <button
                      //   onClick={() => setIsShowAddModal(!isShowAddModal)}
                      className="mx-2 tooltip"
                    >
                      <AddIcon className="hover:text-gray-900 text-gray-700" />
                      <span className="tooltiptext w-32">add study sets</span>
                    </button>
                    <button
                      //   onClick={() => setIsShowEditModal(!isShowEditModal)}
                      className="mx-2 tooltip"
                    >
                      <EditIcon className="hover:text-gray-900 text-gray-700" />
                      <span className="tooltiptext w-16">edit</span>
                    </button>
                  </div>
                ) : null}
                <button
                  // onClick={shareLink}
                  className="mx-2 tooltip"
                >
                  <ShareIcon className="hover:text-gray-900 text-gray-700" />
                  <span className="tooltiptext w-16">share</span>
                </button>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center font-semibold border-b border-gray-200">
                <nav className=" text-gray-700 dark:text-white text-sm lg:flex items-center hidden">
                  {/* default */}
                  <Link href={`/room/${room.id}/library`}>
                    <a
                      className={`py-2 px-4 flex hover:text-black ${
                        router.pathname.indexOf("/library") !== -1
                          ? "justify-start border-b-2 border-yellow-500"
                          : ""
                      }`}
                    >
                      Library
                    </a>
                  </Link>
                  <Link href={`/room/${room.id}/members`}>
                    <a
                      className={`py-2 px-4 flex hover:text-black ${
                        router.pathname.indexOf("/members") !== -1
                          ? "justify-start border-b-2 border-yellow-500"
                          : ""
                      }`}
                    >
                      Members
                    </a>
                  </Link>
                  <Link href={`/room/${room.id}/requests`}>
                    <a
                      className={`py-2 px-4 flex hover:text-black ${
                        router.pathname.indexOf("/requests") !== -1
                          ? "justify-start border-b-2 border-yellow-500"
                          : ""
                      }`}
                    >
                      Requests
                    </a>
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </div>
  );
};

export default RoomLayout;
