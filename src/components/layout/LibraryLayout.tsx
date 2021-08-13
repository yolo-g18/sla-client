import { useRouter } from "next/router";
import AppLayout from "./AppLayout";
import { IUser, RootStore } from "../../utils/TypeScript";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { useEffect, useState } from "react";
import SelectBox from "../ddm/SelectBox";
import { itemsFoldersFilter, itemsSetsFilter } from "../../common/listCommon";

import DomainIcon from "@material-ui/icons/Domain";
import RoomIcon from "@material-ui/icons/Room";
import ClassIcon from "@material-ui/icons/Class";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import WorkOutlineIcon from "@material-ui/icons/WorkOutline";
import { getUserByUsername } from "../../redux/actions/userAction";
import { FormSubmit } from "../../utils/TypeScript";

import { postAPI, putAPI } from "../../utils/FetchData";
import { getAPI } from "../../utils/FetchData";
import InputGroup from "../input/InputGroup";
import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { ALERT } from "../../redux/types/alertType";
import { PARAMS } from "../../common/params";
import { GetStaticProps } from "next";

//alert
function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

interface Props {
  children?: React.ReactNode;
}

const colorFolderList: String[] = [];

const LibraryLayout = (props: Props) => {
  const dispatch = useDispatch();

  const router = useRouter();
  const {
    query: { username, type, search_query },
  } = router;

  //call api get user profile by username de lay ra fullname, address, email, school, job de hien thi
  useEffect(() => {
    console.log("username: " + username);
    console.log("redux: " + user.username);

    if (!username) return;
    dispatch(getUserByUsername(`${username}`));
  }, [username]);

  function handleAddNew() {
    if (router.pathname.includes("sets")) {
      router.push({
        pathname: "/set/add",
      });
    } else {
      setShowModal(true);
      setTitle("Untitle");
      setName("Untitle");
      setDescription("");
    }
  }

  const { auth, alert, user } = useSelector((state: RootStore) => state);

  const [showModal, setShowModal] = useState(false);

  // state in form add folder/room
  const [title, setTitle] = useState("a");
  const [description, setDescription] = useState("");
  const [isTitleTyping, setIsTitleTyping] = useState(false);
  const [isDescriptionTyping, setIsDescriptionTyping] = useState(false);
  const [name, setName] = useState("a");
  const [isNameTyping, setIsNameTyping] = useState(false);

  //state of error input form
  const [titleErr, setTitleErr] = useState("");
  const [descErr, setDescErr] = useState("");
  const [nameErr, setNameErr] = useState("");

  // set state for array color
  const [colors, setColors]: [String[], (colors: String[]) => void] =
    React.useState(colorFolderList);

  const [isToastOpen, setIsToastOpen] = React.useState(false);
  const [typeToast, setTypeToast] = React.useState("success");
  const [messageToast, setMessageToast] = React.useState("");
  React.useEffect(() => {
    // call api folder color
    async function excute() {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await getAPI(`${PARAMS.ENDPOINT}folder/getColorFolder`);
        setColors(res.data);
        dispatch({ type: ALERT, payload: { loading: false } });
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
        setMessageToast("An error occurred");
        setTypeToast("error");
        setIsToastOpen(true);
      }
    }

    excute();
  }, [username]);

  // load option for select of folder color
  const listColorItems = colors.map((item) => (
    <option key={item.toString()}>{item}</option>
  ));

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
    setIsDescriptionTyping(true);
  }, [description]);

  React.useEffect(() => {
    setIsNameTyping(true);
  }, [name]);

  React.useEffect(() => {
    setIsTitleTyping(true);
  }, [title]);

  const handleSubmit = async (e: FormSubmit) => {
    e.preventDefault();
    // create new folder and create new room
    setIsDescriptionTyping(false);

    if (title.trim().length <= 0) {
      setTitleErr("Title is required.");
    } else if (title.trim().length > 20) {
      setTitleErr("Title cannot exceed 20 character.");
    } else {
      setTitleErr("");
    }

    if (name.trim().length <= 0) {
      setNameErr("Name is required.");
    } else if (name.trim().length > 20) {
      setNameErr("Name cannot exceed 20 character.");
    } else {
      setNameErr("");
    }

    if (description.trim().length > 150) {
      setDescErr("Description cannot exceed 150 characters.");
    } else {
      setDescErr("");
    }

    if (titleErr || nameErr || descErr) {
      return;
    }
    if (router.pathname.includes("folders")) {
      const color = "" + color_folder.current?.value;
      const creator_id = "" + user._id;
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
        setMessageToast("folder created");
        setTypeToast("success");
        setIsToastOpen(true);
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
        setMessageToast("An error occurred");
        setTypeToast("error");
        setIsToastOpen(true);
      }
    }

    if (router.pathname.includes("rooms")) {
      //creating new room
      setIsNameTyping(false);
      e.preventDefault();
      const owner_id = "" + user._id;
      const data = { owner_id, name, description };
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await postAPI(`${PARAMS.ENDPOINT}room/createRoom`, data);

        dispatch({ type: ALERT, payload: { loading: false } });
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
        setMessageToast("An error occurred");
        setTypeToast("error");

        setIsToastOpen(true);
      }

      // get id of just created room
      let maxIdRoom = 0;

      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await getAPI(`${PARAMS.ENDPOINT}room/getMaxIdRoom`);
        maxIdRoom = res.data;
        dispatch({ type: ALERT, payload: { loading: false } });
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
        setMessageToast("An error occurred");
        setTypeToast("error");
        setIsToastOpen(true);
      }

      // set creator is member
      const roomMember = {
        room_id: maxIdRoom,
        member_id: owner_id,
      };

      dispatch({ type: ALERT, payload: { loading: true } });
      try {
        const res = await putAPI(
          `${PARAMS.ENDPOINT}room/addMemberToRoom`,
          roomMember
        );

        dispatch({
          type: ALERT,
          payload: { loading: false, success: "abc" },
        });

        setMessageToast("room created");
        setTypeToast("success");
        setIsToastOpen(true);
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
      }
    }

    setShowModal(false);
  };

  //handel close toast
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setIsToastOpen(false);
  };
  //valid form add
  useEffect(() => {
    if (title.trim().length <= 0) {
      setTitleErr("Title is required.");
    } else if (title.trim().length > 20) {
      setTitleErr("Title cannot exceed 20 character.");
    } else {
      setTitleErr("");
    }

    if (name.trim().length <= 0) {
      setNameErr("Name is required.");
    } else if (name.trim().length > 20) {
      setNameErr("Name cannot exceed 20 character.");
    } else {
      setNameErr("");
    }

    if (description.trim().length > 150) {
      setDescErr("Description cannot exceed 150 characters.");
    } else {
      setDescErr("");
    }
  }, [title, description, name]);

  const [keyWord, setKeyWord] = useState(
    search_query ? search_query.toString() : ""
  );
  const seachHandle = () => {
    setTimeout(() => {}, 1000);
    if (!user.username) return;
    if (router.pathname.indexOf("/sets") !== -1) {
      if (type) {
        router.push(
          `/${username}/library/sets?type=${type}&search_query=${keyWord.trim()}`
        );
      } else
        router.push(`/${username}/library/sets?search_query=${keyWord.trim()}`);
    }
    if (router.pathname.indexOf("/folders") !== -1) {
      router.push(
        `/${username}/library/folders?search_query=${keyWord.trim()}`
      );
    }
    if (router.pathname.indexOf("/rooms") !== -1) {
      router.push(`/${username}/library/rooms?search_query=${keyWord.trim()}`);
    }
  };

  useEffect(() => seachHandle(), [keyWord]);

  if (!user._id) {
    return (
      <>
        <AppLayout title={`${username} | SLA`} desc="library">
          <div className="col-span-2 text-center mx-auto mt-24">
            <p className="text-3xl font-semibold text-gray-700">
              Not found {username}
            </p>
          </div>
        </AppLayout>
      </>
    );
  }

  return (
    <div>
      <AppLayout title={`${username} | SLA`} desc="library">
        <div className="grid grid-cols-1 lg:grid-cols-3 mt-8 xl:w-3/4 w-11/12 mx-auto">
          <div className="col-span-1 px-2">
            <div className="flex flex-col justify-between items-center pt-10">
              <img
                className="w-56 h-56 my-auto rounded-full object-cover object-center"
                src={`${user.avatar ? user.avatar : "../../user.svg"}`}
                alt="Avatar Upload"
              />
              <div className=" px-2 w-full justify-between">
                <p className=" mt-4">
                  <span className="w-full text-2xl font-medium">
                    {user.firstname} {user.lastname}
                  </span>
                  <br />
                  <span className="text-md font-mono text-gray-700">
                    {username}
                  </span>
                </p>
                <p className="text-left mt-4">
                  <span className="">{user.bio}</span>
                </p>
                <p className="text-left mt-4 text-sm">
                  {user.schoolName ? (
                    <span>
                      <DomainIcon
                        fontSize="small"
                        className="text-gray-600 -mt-1"
                      />{" "}
                      {user.schoolName}
                      <br />
                    </span>
                  ) : null}
                  {user.address ? (
                    <span>
                      <RoomIcon fontSize="small" className="text-gray-600" />{" "}
                      {user.address}
                      <br />
                    </span>
                  ) : null}

                  <span>
                    {user.major ? (
                      <span>
                        {" "}
                        <ClassIcon
                          fontSize="small"
                          className="text-gray-600"
                        />{" "}
                        {user.major}
                        <br />
                      </span>
                    ) : null}
                  </span>
                  <span>
                    {user.email ? (
                      <MailOutlineIcon
                        fontSize="small"
                        className="text-gray-600"
                      />
                    ) : null}{" "}
                    {user.email}
                  </span>
                  <br />
                  <span>
                    {user.job ? (
                      <WorkOutlineIcon
                        fontSize="small"
                        className="text-gray-600"
                      />
                    ) : null}{" "}
                    {user.job}
                  </span>
                </p>

                {username === auth.userResponse?.username ? (
                  <Link href="/me/profile">
                    <button
                      className="w-3/5 flex mx-auto justify-center mt-8 py-1 rounded-md text-gray-600 border-gray-300 border-2
                    hover:text-gray-900 hover:bg-gray-100 my-1 focus:outline-none"
                    >
                      Edit profile
                    </button>
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
          <div className=" col-span-2 px-2">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 border-b border-gray-200">
              <div className="col-span-1 grid grid-cols-3 gap-2 mt-4 justify-around text-md text-gray-600 cursor-pointe">
                <Link
                  href={{
                    pathname: "/[username]/library/sets",
                    query: { username: username },
                  }}
                >
                  <a
                    className={`col-span-1 py-2 flex flex-grow justify-center hover:text-gray-900 ${
                      router.pathname.indexOf("/sets") !== -1
                        ? "justify-start border-b-2 border-yellow-500"
                        : ""
                    }`}
                  >
                    <p className="font-bold">Sets</p>
                  </a>
                </Link>
                <Link
                  href={{
                    pathname: "/[username]/library/folders",
                    query: { username: username },
                  }}
                >
                  <a
                    className={`col-span-1 py-2 flex flex-grow justify-center hover:text-gray-900 ${
                      router.pathname.indexOf("/folders") !== -1
                        ? "justify-start border-b-2 border-yellow-500"
                        : ""
                    }`}
                  >
                    <p className="font-bold">Folders</p>
                  </a>
                </Link>
                <Link
                  href={{
                    pathname: "/[username]/library/rooms",
                    query: { username: username },
                  }}
                >
                  <a
                    className={`col-span-1 py-2 flex flex-grow justify-center hover:text-gray-900 ${
                      router.pathname.indexOf("/rooms") !== -1
                        ? "justify-start border-b-2 border-yellow-500 "
                        : ""
                    }`}
                  >
                    <p className="font-bold">Rooms</p>
                  </a>
                </Link>
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <div className="col-span-2 flex justify-around text-md text-gray-600  cursor-pointer">
                <div className="text-gray-900 py-3 flex flex-grow">
                  {router.pathname.indexOf("/sets") !== -1 &&
                  username === auth.userResponse?.username ? (
                    <SelectBox
                      items={
                        auth.userResponse?.username === username
                          ? itemsSetsFilter
                          : itemsSetsFilter.slice(0, 1)
                      }
                      typeResult="sets"
                      username={username}
                    />
                  ) : null}
                </div>
              </div>
              <div className="flex flex-wrap right-2 ">
                <div className="text-gray-900 py-3 flex relative ">
                  <form>
                    <svg
                      className="absolute left-0 mt-2.5 w-4 h-4 ml-4 text-gray-500 pointer-events-none fill-current group-hover:text-gray-400 sm:block"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                    </svg>
                    <input
                      type="text"
                      className="block w-full py-1.5 pl-10 pr-4 leading-normal rounded-md focus:border-transparent focus:outline-none 
                  bg-gray-100 dark:bg-gray-800 text-gray-400"
                      placeholder="Search"
                      value={keyWord}
                      onChange={(e) => {
                        setKeyWord(e.target.value);
                      }}
                      onKeyPress={(e) => {
                        e.key === "Enter" && e.preventDefault();
                      }}
                    />
                  </form>
                </div>
                <div className="py-3 flex relative">
                  {username === auth.userResponse?.username ? (
                    <button
                      id="btnAddNew"
                      onClick={handleAddNew}
                      className="w-24 h-8 text-md flex items-center justify-center rounded-sm px-4 
                   text-sm font-medium py-1 bg-blue-500 hover:bg-blue-600 ml-4
                text-white  focus:outline-none"
                    >
                      Create
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="mb-44">{props.children}</div>
          </div>
        </div>
      </AppLayout>
      {/* popup editor */}

      {showModal ? (
        <>
          <div
            hidden
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 backdrop-filter backdrop-brightness-50 -mt-12"
          >
            <div className="relative w-auto my-6">
              {/*content*/}
              <div className="border-0 rounded-md shadow-md flex flex-col w-full bg-white outline-none focus:outline-none p-2">
                {/*header*/}
                <div className="justify-between px-4 pb-6 pt-8 rounded-t">
                  <p className="text-gray-700 font-semibold text-lg text-center">
                    {router.pathname.includes("folders")
                      ? "Create Folder"
                      : "Create Room"}
                  </p>
                </div>
                {/*body*/}
                <form onSubmit={handleSubmit}>
                  <div className="w-full px-4 flex-wrap">
                    {router.pathname.includes("folders") ? (
                      <>
                        <InputGroup
                          type="text"
                          setValue={setTitle}
                          value={title}
                          placeholder="Title"
                          error={titleErr}
                          label="Title"
                        />
                      </>
                    ) : (
                      <>
                        <InputGroup
                          type="text"
                          setValue={setName}
                          value={name}
                          placeholder="Name"
                          error={nameErr}
                          label="Name"
                        />
                      </>
                    )}

                    <InputGroup
                      type="text"
                      setValue={setDescription}
                      value={description}
                      placeholder="Description"
                      error={descErr}
                      label="Description"
                    />
                    <div className="my-2">
                      <small className="font-medium text-red-600">
                        {alert.errors?.message}
                      </small>
                    </div>
                    {router.pathname.includes("folders") ? (
                      <>
                        <div className="relative mb-4">
                          <div className="flex items-center justify-between">
                            <label className="text-gray-700 text-sm font-bold mb-2">
                              Colors
                            </label>
                          </div>
                          <select
                            id="color"
                            className="block border border-grey-light w-full p-2 rounded-md mb-1 focus:border-purple-400 text-sm"
                            ref={color_folder}
                            name="color"
                            onChange={formValue}
                            value={stateColorFolder.color}
                          >
                            {listColorItems}
                          </select>
                        </div>
                      </>
                    ) : null}
                  </div>

                  {/*footer*/}
                  <div className="flex justify-between px-12 py-6">
                    <button
                      className="bg-gray-100 border-2 text-gray-700 w-28 py-1 mx-2 rounded-sm text-sm font-medium hover:bg-gray-300"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className=" bg-blue-500 text-white w-28 py-1 mx-2 rounded-sm text-sm font-medium hover:bg-blue-600"
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
                        "Create"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
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
    </div>
  );
};

export default LibraryLayout;
