import Link from "next/link";
import { useRouter } from "next/router";
import AppLayout from "./AppLayout";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import { useSelector } from "react-redux";
import { RootStore } from "../../utils/TypeScript";
import React from "react";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import ShareIcon from "@material-ui/icons/Share";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import FolderOutlinedIcon from "@material-ui/icons/FolderOutlined";
import CreateNewFolderOutlinedIcon from "@material-ui/icons/CreateNewFolderOutlined";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useEffect, useRef, useState } from "react";
import _ from "lodash";
import { INewRoom } from "../../utils/TypeScript";
import { getAPI } from "../../utils/FetchData";
import { useDispatch } from "react-redux";
import { ALERT } from "../../redux/types/alertType";
import { PARAMS } from "../../common/params";


interface Props {
  children: React.ReactNode;
}

let useClickOutside = (handler: any) => {
  let domNode: any = useRef();

  useEffect(() => {
    let maybeHandler = (event: any) => {
      if (!domNode.current.contains(event.target)) {
        handler();
      }
    };

    document.addEventListener("mousedown", maybeHandler);

    return () => {
      document.removeEventListener("mousedown", maybeHandler);
    };
  });

  return domNode;
};

const defaultRoom = {
  room_id: 0,
  name: "",
  description: "",
  createdDate: "",
  ownerName:"",
  setNumbers:0
}

const RoomLayout = (props: Props) => {
  const router = useRouter();

  let domNode = useClickOutside(() => {
    setIsMenuOpen(false);
  });

  const {
    query: { id },
  } = router;

  const dispatch = useDispatch();
  const { auth, alert, search } = useSelector((state: RootStore) => state);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isSuccess, setIsSuccess] = React.useState(false);
  const [error, setError]: [string, (error: string) => void] =
  React.useState("not found");
  
  const [room, setRoom] = React.useState<INewRoom>(defaultRoom);
 
  React.useEffect(() => {
    // load detail data of room
    setIsSuccess(false);
    async function excute() {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await getAPI(`${PARAMS.ENDPOINT}room/getRoom/${id}`);
        setRoom(res.data);
        console.log(res.data);
        dispatch({ type: ALERT, payload: { loading: false } });
       
        
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
        setError(err);
      }
    }

    excute();
  }, [id, isSuccess]);

  return (
    <div>
      <AppLayout title={`Room | ${room.name}`} desc="room">
        <div className="grid lg:grid-cols-4 gap-6 grid-cols-1 self-center lg:w-4/5 w-full px-2 mt-4">
          {/* left side */}
          <div className="col-span-1 px-2">
            <div className=" w-full px-2">
              <div className="w-full flex items-center">
                <div>
                  <PeopleAltIcon fontSize="large" className="text-3xl" />
                </div>
                <div className="px-3 mr-auto">
                  <h4 className="font-bold text-xl">{room.name}</h4>
                  <small className="text-md">
                    create by{" "}
                    <Link href={`${room.ownerName}/library/sets`}>
                      {room.ownerName}
                    </Link>
                  </small>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-light text-gray-800">{room.description}</p>
              </div>
            </div>
          </div>
          {/* right side */}
          <div className="col-span-3 h-screen">
            <div className="flex justify-between mt-2">
              <div className="fex flex-col">
                <a href={`/${room.ownerName}/library/folders`}>
                  <span className="hover:underline hover:text-gray-700">
                    back to library
                  </span>
                </a>
              </div>
              {/* toolbar */}
              <div className="flex flex-row">
                {room.ownerName === auth.userResponse?.username ? (
                  <div>
                    <button
                      // onClick={() => setIsShowEditModal(!isShowEditModal)}
                      className="mx-2 tooltip focus:outline-none"
                    >
                      <EditIcon
                        fontSize="small"
                        className="hover:text-gray-400 text-gray-700"
                      />
                      <span className="tooltiptext w-16">edit</span>
                    </button>
                    <button
                      //   onClick={() => setIsShowAddModal(!isShowAddModal)}
                      className="mx-2 tooltip focus:outline-none"
                    >
                      <AddIcon
                        fontSize="default"
                        className="hover:text-gray-400 text-gray-700"
                      />
                      <span className="tooltiptext w-32">add study sets</span>
                    </button>
                    <button
                      //   onClick={() => setIsShowEditModal(!isShowEditModal)}
                      className="mx-2 tooltip"
                    >
                      <CreateNewFolderOutlinedIcon
                        fontSize="default"
                        className="hover:text-gray-400 text-gray-700"
                      />
                      <span className="tooltiptext w-24">add folder</span>
                    </button>
                    <button
                      // onClick={shareLink}
                      className="mx-2 tooltip focus:outline-none"
                    >
                      <GroupAddIcon
                        fontSize="default"
                        className="hover:text-gray-400 text-gray-700"
                      />
                      <span className="tooltiptext w-28">invite user</span>
                    </button>
                  </div>
                ) : (
                  // sau phai check member hay ko de hien btn join
                  <button
                    className="w-32 text-md rounded-md px-4 py-1 mx-2
                  text-sm font-medium bg-green-500 hover:bg-green-600 
               text-white focus:outline-none"
                  >
                    <p className="text-md">Request to join</p>
                  </button>
                )}

                <button
                  // onClick={shareLink}
                  className="mx-2 tooltip focus:outline-none"
                >
                  <ShareIcon
                    fontSize="small"
                    className="hover:text-gray-400 text-gray-700"
                  />
                  <span className="tooltiptext w-16">share</span>
                </button>

                {/* menu button */}
                <div className="flex mx-2" ref={domNode}>
                  {room.ownerName === auth.userResponse?.username ? (
                    <div>
                      <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="px-1 focus:outline-none"
                      >
                        <ExpandMoreIcon />
                      </button>
                      {isMenuOpen ? (
                        <div className="origin-top-right absolute z-50 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                          <div
                            className={`py-1`}
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="options-menu"
                          >
                            <div>
                              <a
                                className="block px-4 py-1 font-medium text-sm text-gray-700 hover:bg-blue-500 
                            hover:text-white dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600 cursor-pointer"
                                role="menuitem"
                              >
                                <span className="flex flex-col">
                                  <span>remove all members</span>
                                </span>
                              </a>
                              <a
                                className="block px-4 py-1 font-medium text-sm text-gray-500 hover:bg-yellow-500
                             hover:text-white  dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600 cursor-pointer"
                                role="menuitem"
                                // onClick={() => setShowModalDelete(true)}
                              >
                                <span className="flex flex-col ">
                                  <span>delete</span>
                                </span>
                              </a>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
                {/* end menu btn */}
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center font-semibold border-b border-gray-200">
                <nav className=" text-gray-700 dark:text-white text-sm lg:flex items-center hidden">
                  {/* default */}
                  <Link href={`/room/${room.room_id}/library`}>
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
                  <Link href={`/room/${room.room_id}/members`}>
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
                  <Link href={`/room/${room.room_id}/requests`}>
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
            <div>{props.children}</div>
            <div className="h-40 "></div>
          </div>
        </div>
      </AppLayout>
    </div>
  );
};

export default RoomLayout;
