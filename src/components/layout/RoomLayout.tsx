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
import { INewRoom, ISetAdd, IFolder, FormSubmit } from "../../utils/TypeScript";
import { getAPI, putAPI, deleteAPI, postAPI } from "../../utils/FetchData";
import { useDispatch } from "react-redux";
import { ALERT } from "../../redux/types/alertType";
import { PARAMS } from "../../common/params";
import AddBoxRoundedIcon from "@material-ui/icons/AddBoxRounded";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import InputGroup from "../input/InputGroup";

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

const colorFolderList: String[] = [];
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

  const [isShowEditModal, setIsShowEditModal] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isTitleTyping, setIsTitleTyping] = React.useState(false);
  const [isDescriptionTyping, setIsDescriptionTyping] = React.useState(false);
  const [titleErr, setTitleErr] = useState("");
  const [descErr, setDescErr] = useState("");

  const [isShowRemoveRoomModal, setIsShowRemoveRoomModal] = React.useState(false);

  const [isShowRemoveAllMemberModal, setIsShowRemoveAllMemberModal] = React.useState(false);

  const [idRemoveRoom, setIdRemoveRoom]: [
    number,
    (idRemoveRoom: number) => void
  ] = React.useState<number>(0);

  const [isShowCreateFolderModal, setIsShowCreateFolderModal] = React.useState(false);

  // set state for array color
  const [colors, setColors]: [String[], (colors: String[]) => void] =
    React.useState(colorFolderList);

  // get value of color in select
  const [stateColorFolder, setStateColorFolder] = React.useState({ color: "" });

  const formValue = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStateColorFolder({
      ...stateColorFolder,
      [event.target.name]: event.target.value.trim(),
    });
  };

  const color_folder = React.useRef<HTMLSelectElement>(null);

  React.useEffect(() => {
    // load folder color
    async function excute() {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await getAPI(`${PARAMS.ENDPOINT}folder/getColorFolder`);
        dispatch({ type: ALERT, payload: { loading: false } });
        setColors(res.data);
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
        setError(err);
      }
    }
    excute();
  }, []);

  React.useEffect(() => {
    // check member permisson
    async function excute() {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await getAPI(`${PARAMS.ENDPOINT}room/isMemberOfRoom/${id}`);
        dispatch({ type: ALERT, payload: { loading: false } });

        const btn = (document.getElementById('btnRequest') as HTMLInputElement);

        if (btn) {

          btn.disabled = res.data;

        }
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
        setError(err);
      }
    }
    excute();
  }, []);

  React.useEffect(() => {
    // check member permisson
    async function excute() {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await getAPI(`${PARAMS.ENDPOINT}room/isUserRequestPending/${id}`);
        dispatch({ type: ALERT, payload: { loading: false } });

        const btn = (document.getElementById('btnRequest') as HTMLInputElement);

        if (btn) {

          if (res.data === true) {

            btn.style.backgroundColor = 'gray';
            btn.disabled = true;
            btn.textContent = 'Sent request';

          }


        }
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
        setError(err);
      }
    }
    excute();
  }, [id,alert.success]);

  // load option for select of folder color
  const listColorItems = colors.map((item) => (
    <option key={item.toString()}>{item}</option>
  ));
  React.useEffect(() => {

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
  }, [auth.userResponse?._id, alert.success]);

  React.useEffect(() => {
    // load detail data of room

    async function excute() {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await getAPI(`${PARAMS.ENDPOINT}room/getRoom/${id}`);
        setRoom(res.data);
        setTitle(res.data.name);
        setDescription(res.data.description);

        dispatch({ type: ALERT, payload: { loading: false } });


      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
        setError(err);
      }
    }

    excute();
  }, [id, alert.success]);


  React.useEffect(() => {

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
  }, [auth.userResponse?._id, alert.success]);

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

      if (res.data === "cancel adding") {
        setMessageToast("set existed");
        setTypeToast("error");
        setIsToastOpen(true);
      }
      else {
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

      if (res.data === "cancel adding") {
        setMessageToast("folder existed");
        setTypeToast("error");
        setIsToastOpen(true);
      }
      else {
        setMessageToast("folder added");
        setTypeToast("success");
        setIsToastOpen(true);
      }



    } catch (err) {

      dispatch({ type: ALERT, payload: { loading: false } });


    }
  }

  // share link
  function shareLink() {
    navigator.clipboard.writeText(window.location.href);
    setMessageToast("copied link");
    setTypeToast("success");
    setIsToastOpen(true);
  }
  useEffect(() => {
    if (title.length <= 0) {
      setTitleErr("Title is required.");
    } else if (title.length > 20) {
      setTitleErr("Title cannot exceed 20 character.");
    } else {
      setTitleErr("");
    }

    if (description.length > 150) {
      setDescErr("Description cannot exceed 150 characters.");
    } else {
      setDescErr("");
    }
  }, [title, description]);

  // edit room
  const editRoom = async (e: FormSubmit) => {
    setIsTitleTyping(false);
    setIsDescriptionTyping(false);

    e.preventDefault();


    const data = {
      "id": id,
      "name": title,
      "description": description
    }
      ;

    async function excute() {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await putAPI(`${PARAMS.ENDPOINT}room/editRoom`, data);
        dispatch({ type: ALERT, payload: { loading: false, success: "ss" } });
        setMessageToast("room updated");
        setTypeToast("success");
        setIsToastOpen(true);

      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
        setError(err);

      }
    }

    excute();

    setIsShowEditModal(!isShowEditModal);
  };

  //handel close toast
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setIsToastOpen(false);
  };

  async function removeRoom() {

    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      const res = await deleteAPI(
        `${PARAMS.ENDPOINT}room/deleteRoom/` + idRemoveRoom
      );
      dispatch({ type: ALERT, payload: { loading: false, success: "ss" } });
      setMessageToast("room deleted");
      setTypeToast("success");
      setIsToastOpen(true);
      router.push({
        pathname: "/[username]/library/rooms",
        query: { username: room.ownerName },
      });
    } catch (err) {
      dispatch({ type: ALERT, payload: { loading: false } });

    }

    setIsShowRemoveRoomModal(!isShowRemoveRoomModal);
  }


  const handleRemoveRoom = (room_id: number) => {
    setIsShowRemoveRoomModal(!isShowRemoveRoomModal);
    setIdRemoveRoom(room_id);
  };

  const closeRemoveRoomModal = () => {
    setIsShowRemoveRoomModal(!isShowRemoveRoomModal);
  };

  async function removeAllMember() {

    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      const res = await deleteAPI(
        `${PARAMS.ENDPOINT}room/removeAllMemberOfRoom/` + idRemoveRoom
      );
      dispatch({ type: ALERT, payload: { loading: false, success: "ss" } });
      setMessageToast("all members deleted");
      setTypeToast("success");
      setIsToastOpen(true);

    } catch (err) {
      dispatch({ type: ALERT, payload: { loading: false } });

    }

    setIsShowRemoveAllMemberModal(!isShowRemoveAllMemberModal);
  }


  const handleRemoveAllMember = (room_id: number) => {
    setIsShowRemoveAllMemberModal(!isShowRemoveAllMemberModal);
    setIdRemoveRoom(room_id);
  };

  const closeRemoveAllMemberModal = () => {
    setIsShowRemoveAllMemberModal(!isShowRemoveAllMemberModal);
  };

  function openCreateFolderModal() {
    setIsShowCreateFolderModal(true);
    setIsShowAddFolderModal(false);
  }

  const createNewFolder = async (e: FormSubmit) => {
    {
      // create new folder 
      setIsDescriptionTyping(false);
      setIsTitleTyping(false);

      e.preventDefault();
      const color = "" + color_folder.current?.value;
      const creator_id = "" + auth.userResponse?._id;
      const data = { title, description, color, creator_id };
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await postAPI(
          `${PARAMS.ENDPOINT}folder/createFolder`,
          data
        );
        dispatch({
          type: ALERT,
          payload: { loading: false, success: "ss" },
        });

      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });

      }

      // get id of folder just created
      let justFolderId = 0;

      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await getAPI(
          `${PARAMS.ENDPOINT}folder/getMaxIdOfFolder`
        );
        justFolderId = res.data;
        dispatch({
          type: ALERT,
          payload: { loading: false, success: "ss" },
        });

      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });

      }

      // add this folder to room
      addFolderToRoom(justFolderId);

      setIsShowCreateFolderModal(false);
    }
  };

  async function requestAttendRoom() {

    
    const data = {
      "room_id": id,
      "user_id": auth.userResponse?._id
    }

    dispatch({ type: ALERT, payload: { loading: true } });
    try {
      const res = await putAPI(
        `${PARAMS.ENDPOINT}room/requestAttendRoom`, data
      );

      dispatch({ type: ALERT, payload: { loading: false , success:"xxx"} });

      setMessageToast("request sent");
      setTypeToast("success");
      setIsToastOpen(true);



    } catch (err) {
      dispatch({ type: ALERT, payload: { loading: false } });


    }


  }
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
                <a href={`/${room.ownerName}/library/rooms`}>
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
                      onClick={() => setIsShowEditModal(!isShowEditModal)}
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
                    id="btnRequest"

                    onClick={requestAttendRoom}
                    className="w-32 text-md rounded-md px-4 py-1 mx-2
                  text-sm font-medium bg-green-500 hover:bg-green-600 
               text-white focus:outline-none"
                  >
                    <p className="text-md">Request to join</p>
                  </button>


                )}

                <button
                  onClick={shareLink}
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
                                onClick={() => handleRemoveAllMember(room.room_id)}
                              >
                                <span className="flex flex-col">
                                  <span>remove all members</span>
                                </span>
                              </a>
                              <a
                                className="block px-4 py-1 font-medium text-sm text-gray-500 hover:bg-yellow-500
                             hover:text-white  dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600 cursor-pointer"
                                role="menuitem"
                                onClick={() => handleRemoveRoom(room.room_id)}
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

                    <button
                      type="button"
                      className="w-40 text-md rounded-md px-4 mx-2 py-2
                          text-md font-bold bg-green-500 hover:bg-green-600 
                       text-white focus:outline-none"
                      onClick={() => openCreateFolderModal()}
                    >
                      Create a new folder
                    </button>

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
        {isShowEditModal ? (
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 backdrop-filter backdrop-brightness-50 -mt-12">
            <div className="h-screen w-full absolute flex items-center justify-center bg-modal">
              <div className="bg-white rounded-xl shadow p-6 m-4 max-w-xs max-h-full">
                <div className="px-4 pb-6 pt-8 rounded-t">
                  <p className="text-gray-700 font-semibold text-lg text-center">
                    Edit room
                  </p>
                </div>
                <form onSubmit={editRoom}>
                  <div className="w-full px-4 mb-8 flex-wrap">
                    <InputGroup
                      type="text"
                      value={title}
                      setValue={setTitle}
                      placeholder="Title"
                      error={titleErr}
                      required
                      label="Title"
                    />
                    <InputGroup
                      type="text"
                      value={description}
                      setValue={setDescription}
                      placeholder="Description"
                      error={descErr}
                      label="Description"
                    />

                  </div>
                  <div className="flex items-center justify-end px-4">
                    <button
                      className=" bg-green-500 text-white w-28 py-1  mx-4 rounded-md text-sm font-medium hover:bg-green-600"
                      type="submit"
                    >
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
                        "Save"
                      )}
                    </button>
                    <button
                      className="bg-gray-100 border-2 text-gray-700 w-28 py-1 mx-4 rounded-md text-sm font-medium hover:bg-gray-300"
                      type="button"
                      onClick={() => setIsShowEditModal(!isShowEditModal)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : null}
        {isShowCreateFolderModal ? (
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 backdrop-filter backdrop-brightness-50 -mt-12">
            <div className="h-screen w-full absolute flex items-center justify-center bg-modal">
              <div className="bg-white rounded-xl shadow p-6 m-4 max-w-xs max-h-full">
                <div className="px-4 pb-6 pt-8 rounded-t">
                  <p className="text-gray-700 font-semibold text-lg text-center">
                    Create New Folder
                  </p>
                </div>
                <form onSubmit={createNewFolder}>
                  <div className="w-full px-4 mb-8 flex-wrap">
                    <InputGroup
                      type="text"

                      setValue={setTitle}
                      placeholder="Title"
                      error={titleErr}
                      required
                      label="Title"
                    />
                    <InputGroup
                      type="text"

                      setValue={setDescription}
                      placeholder="Description"
                      error={descErr}
                      label="Description"
                    />
                    <div className="relative mb-4">
                      <div className="flex items-center justify-between">
                        <label className="text-gray-700 text-sm font-bold mb-2">
                          Colors
                        </label>
                      </div>
                      <select
                        id="color"
                        className="block border border-grey-light w-full p-2 rounded-md mb-1 focus:outline-none text-sm"
                        ref={color_folder}
                        name="color"
                        onChange={formValue}
                        value={stateColorFolder.color}
                      >
                        {listColorItems}
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center justify-end px-4">
                    <button
                      className=" bg-green-500 text-white w-28 py-1  mx-4 rounded-md text-sm font-medium hover:bg-green-600"
                      type="submit"
                    >
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
                        "Save"
                      )}
                    </button>
                    <button
                      className="bg-gray-100 border-2 text-gray-700 w-28 py-1 mx-4 rounded-md text-sm font-medium hover:bg-gray-300"
                      type="button"
                      onClick={() => setIsShowCreateFolderModal(!isShowCreateFolderModal)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : null}
        {isShowRemoveRoomModal ? (
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 backdrop-filter backdrop-brightness-50 -mt-12">
            <div className="h-screen w-full absolute flex items-center justify-center bg-modal">
              <div className="bg-white rounded-xl shadow p-6 m-4 max-w-xs max-h-full text-center">
                <div className="mb-4"></div>
                <div className="mb-8">
                  <p className="text-xl font-semibold">
                    Are you sure want to delete this room?
                  </p>
                  <small>
                    No one will be able to access this class ever again.
                  </small>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={removeRoom}
                    className="text-white w-32 rounded mx-4 bg-yellow-500 hover:bg-yellow-600"
                  >
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
                      "Delete"
                    )}
                  </button>
                  <button
                    onClick={closeRemoveRoomModal}
                    className=" text-white w-32 py-1 mx-4 rounded bg-green-500 hover:bg-green-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {isShowRemoveAllMemberModal ? (
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 backdrop-filter backdrop-brightness-50 -mt-12">
            <div className="h-screen w-full absolute flex items-center justify-center bg-modal">
              <div className="bg-white rounded-xl shadow p-6 m-4 max-w-xs max-h-full text-center">
                <div className="mb-4"></div>
                <div className="mb-8">
                  <p className="text-xl font-semibold">
                    Are you sure want to remove all members this room?
                  </p>
                  <small>
                    There is no one in room
                  </small>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={removeAllMember}
                    className="text-white w-32 rounded mx-4 bg-yellow-500 hover:bg-yellow-600"
                  >
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
                      "Remove"
                    )}
                  </button>
                  <button
                    onClick={closeRemoveAllMemberModal}
                    className=" text-white w-32 py-1 mx-4 rounded bg-green-500 hover:bg-green-600"
                  >
                    Cancel
                  </button>
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
