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
import CreateNewFolderOutlinedIcon from "@material-ui/icons/CreateNewFolderOutlined";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useEffect, useRef, useState } from "react";
import _ from "lodash";
import { INewRoom, ISetAdd, IFolder } from "../../utils/TypeScript";
import { getAPI, putAPI } from "../../utils/FetchData";
import { useDispatch } from "react-redux";
import { ALERT } from "../../redux/types/alertType";
import { PARAMS } from "../../common/params";
import AddBoxRoundedIcon from "@material-ui/icons/AddBoxRounded";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
interface Props {
  children: React.ReactNode;
}

//alert
function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
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
  ownerName: "",
  setNumbers: 0,
  folderNumbers: 0
}

const defaulAddSets: ISetAdd[] = [];
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

  // populate form add SS to room
  const [addSets, setAddSets]: [ISetAdd[], (addSets: ISetAdd[]) => void] =
    React.useState(defaulAddSets);

  const [isShowAddSetModal, setIsShowAddSetModal] = React.useState(false);
  const [isShowAddFolderModal, setIsShowAddFolderModal] = React.useState(false);
  const [folders, setFolders] = React.useState<IFolder[]>([]);

  const [isToastOpen, setIsToastOpen] = React.useState(false);
  const [typeToast, setTypeToast] = React.useState("success");
  const [messageToast, setMessageToast] = React.useState("");
  React.useEffect(() => {
    setIsSuccess(false);
    // list all folders of user
    async function excute() {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await getAPI(
          `${PARAMS.ENDPOINT}folder/getFolderListOfUser/${auth.userResponse?._id}`
        );

        dispatch({ type: ALERT, payload: { loading: false } });
        setFolders(res.data);

      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
      }
    }
    excute();
  }, [auth.userResponse?._id, isSuccess, alert.success]);

  React.useEffect(() => {
    // load detail data of room
    setIsSuccess(false);
    async function excute() {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await getAPI(`${PARAMS.ENDPOINT}room/getRoom/${id}`);
        setRoom(res.data);
        console.log("set: " + room.setNumbers);

        dispatch({ type: ALERT, payload: { loading: false } });


      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
        setError(err);
      }
    }

    excute();
  }, [id, isSuccess, alert.success]);


  React.useEffect(() => {
    setIsSuccess(false);
    // load SS of user for adding to folder
    async function excute() {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await getAPI(
          `${PARAMS.ENDPOINT}lib/ss/created?userId=${auth.userResponse?._id}`
        );
        dispatch({ type: ALERT, payload: { loading: false } });
        setAddSets(res.data);
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
        setError(err);
      }
    }

    excute();
  }, [auth.userResponse?._id, isSuccess]);

  // populate SS to li in ul
  const listSetAdd = addSets.map((set) => (
    <div key={set.title} className="flex flex-row ">
      <div className="select-none cursor-pointer flex flex-1 items-center py-4 px-6">
        <div className="flex-1">
          <div className="font-semibold text-xl">{set.title}</div>
        </div>
        <button
          onClick={() => addStudySetToRoom(set.id)}
          className="w-24 text-right flex justify-end focus:outline-none"
          type="button"
        >
          <AddBoxRoundedIcon
            fontSize="large"
            className="text-green-500 hover:text-green-600"
          />
        </button>
      </div>
    </div>
  ));

  // add existing SS to Room
  async function addStudySetToRoom(studySetAdd_id: number) {

    const data = {
      "studySet_id": studySetAdd_id,
      "room_id": id
    };

    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      const res = await putAPI(
        `${PARAMS.ENDPOINT}room/addStudySetToRoom`,
        data
      );
      dispatch({ type: ALERT, payload: { loading: false, success: "ss" } });

      if(res.data === "cancel adding")
      {
        setMessageToast("set existed");
        setTypeToast("error");
        setIsToastOpen(true);
      }
      else
      {
        setMessageToast("set added");
        setTypeToast("success");
        setIsToastOpen(true);
      }
      
    } catch (err) {
      dispatch({ type: ALERT, payload: { loading: false } });

    }
  }

  // populate folder to li in ul
  const listFolderAdd = folders.map((set) => (
    <div key={set.title} className="flex flex-row ">
      <div className="select-none cursor-pointer flex flex-1 items-center py-4 px-6">
        <div className="flex-1">
          <div className="font-semibold text-xl">{set.title}</div>
        </div>
        <button
          onClick={() => addFolderToRoom(set.folder_id)}
          className="w-24 text-right flex justify-end focus:outline-none"
          type="button"
        >
          <AddBoxRoundedIcon
            fontSize="large"
            className="text-green-500 hover:text-green-600"
          />
        </button>
      </div>
    </div>
  ));

  async function addFolderToRoom(folderAdd_id: number) {
    const data = {
      "folder_id": folderAdd_id,
      "room_id": id
    };

    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      const res = await putAPI(
        `${PARAMS.ENDPOINT}room/addFolderToRoom`,
        data
      );
      
      dispatch({ type: ALERT, payload: { loading: false, success: "ss" } });
      
      if(res.data === "cancel adding")
      {
        setMessageToast("folder existed");
        setTypeToast("error");
        setIsToastOpen(true);
      }
      else
      {
        setMessageToast("folder added");
        setTypeToast("success");
        setIsToastOpen(true);
      }

   

    } catch (err) {

     dispatch({ type: ALERT, payload: { loading: false } });
     

    }
  }

    //handel close toast
    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
      if (reason === "clickaway") {
        return;
      }
  
      setIsToastOpen(false);
    };
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
                      onClick={() => setIsShowAddSetModal(!isShowAddSetModal)}
                      className="mx-2 tooltip focus:outline-none"
                    >
                      <AddIcon
                        fontSize="default"
                        className="hover:text-gray-400 text-gray-700"
                      />
                      <span className="tooltiptext w-32">add study sets</span>
                    </button>
                    <button
                      onClick={() => setIsShowAddFolderModal(!isShowAddFolderModal)}
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
                      className={`py-2 px-4 flex hover:text-black ${router.pathname.indexOf("/library") !== -1
                          ? "justify-start border-b-2 border-yellow-500"
                          : ""
                        }`}
                    >
                      Library
                    </a>
                  </Link>
                  <Link href={`/room/${room.room_id}/members`}>
                    <a
                      className={`py-2 px-4 flex hover:text-black ${router.pathname.indexOf("/members") !== -1
                          ? "justify-start border-b-2 border-yellow-500"
                          : ""
                        }`}
                    >
                      Members
                    </a>
                  </Link>
                  <Link href={`/room/${room.room_id}/requests`}>
                    <a
                      className={`py-2 px-4 flex hover:text-black ${router.pathname.indexOf("/requests") !== -1
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
        {isShowAddSetModal ? (
          <div className="justify-between items-center flex overflow-x-hidden my-auto fixed inset-0 z-50 backdrop-filter backdrop-brightness-50">
            <div className="w-full flex items-center justify-center bg-modal">
              <div className="bg-white rounded-xl shadow py-4">
                <div>
                  <div className="mt-2 text-center">
                    <p className="text-xl font-semibold">Add a set</p>
                  </div>
                  <div className="mt-4 text-center">
                    <Link
                      href={{
                        pathname: "/set/add",
                      }}
                    >
                      <button
                        type="button"
                        className="w-40 text-md rounded-md px-4 mx-2 py-2
                          text-md font-bold bg-green-500 hover:bg-green-600 
                       text-white focus:outline-none"
                      >
                        Create a new set
                      </button>
                    </Link>
                  </div>

                  <div
                    className=" mx-auto w-full mt-4 overflow-y-auto bg-white rounded-lg"
                    style={{ height: 550, width: 450 }}
                  >
                    <div
                      id="ulSetAdd"
                      className="flex flex-col divide divide-y "
                    >
                      {listSetAdd}
                    </div>
                  </div>
                  <div className="flex items-center justify-center px-6 py-2 mt-4">
                    <button
                      className="bg-gray-100 border-2 text-gray-700 w-28 py-1 rounded-md text-sm font-medium hover:text-gray-900 focus:outline-none"
                      type="button"
                      onClick={() => setIsShowAddSetModal(!isShowAddSetModal)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {isShowAddFolderModal ? (
          <div className="justify-between items-center flex overflow-x-hidden my-auto fixed inset-0 z-50 backdrop-filter backdrop-brightness-50">
            <div className="w-full flex items-center justify-center bg-modal">
              <div className="bg-white rounded-xl shadow py-4">
                <div>
                  <div className="mt-2 text-center">
                    <p className="text-xl font-semibold">Add a folder</p>
                  </div>
                  <div className="mt-4 text-center">
                    <Link
                      href={{
                        pathname: "/set/add",
                      }}
                    >
                      <button
                        type="button"
                        className="w-40 text-md rounded-md px-4 mx-2 py-2
                          text-md font-bold bg-green-500 hover:bg-green-600 
                       text-white focus:outline-none"
                      >
                        Create a new folder
                      </button>
                    </Link>
                  </div>

                  <div
                    className=" mx-auto w-full mt-4 overflow-y-auto bg-white rounded-lg"
                    style={{ height: 550, width: 450 }}
                  >
                    <div
                      id="ulSetAdd"
                      className="flex flex-col divide divide-y "
                    >
                      {listFolderAdd}
                    </div>
                  </div>
                  <div className="flex items-center justify-center px-6 py-2 mt-4">
                    <button
                      className="bg-gray-100 border-2 text-gray-700 w-28 py-1 rounded-md text-sm font-medium hover:text-gray-900 focus:outline-none"
                      type="button"
                      onClick={() => setIsShowAddFolderModal(!isShowAddFolderModal)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <Snackbar
          open={isToastOpen}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity={typeToast === "success" ? "success" : "error"}
          >
            {messageToast}
          </Alert>
        </Snackbar>
      </AppLayout>
    </div>
  );
};

export default RoomLayout;
