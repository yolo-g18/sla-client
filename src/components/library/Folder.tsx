import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { IStudySetInfo } from "../../utils/TypeScript";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { RootStore } from "../../utils/TypeScript";
import AppLayout from "../layout/AppLayout";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import ShareIcon from "@material-ui/icons/Share";
import { IFolder } from "../../utils/TypeScript";
import { IStudySet } from "../../utils/TypeScript";
import _, { divide } from "lodash";
import React from "react";
import { deleteAPI } from "../../utils/FetchData";
import { getAPI } from "../../utils/FetchData";
import InputGroup from "../input/InputGroup";
import { FormSubmit } from "../../utils/TypeScript";
import { putAPI } from "../../utils/FetchData";
import Icon from "@material-ui/core/Icon";
import { ISetAdd } from "../../utils/TypeScript";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

//alert
function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const colorFolderList: String[] = [];
const defaultFolder: IFolder = {
  folder_id: 0,
  title: "",
  description: "",
  color: "",
  numberOfSets: 0,
  createdDate: "",
  creatorUserName: "",
};

const defaultStudySets: IStudySet[] = [];

const defaulAddSets: ISetAdd[] = [];

const Folder = () => {
  // add SS to folder
  const [addSets, setAddSets]: [ISetAdd[], (addSets: ISetAdd[]) => void] =
    React.useState(defaulAddSets);
  // set state for array color
  const [colors, setColors]: [String[], (colors: String[]) => void] =
    React.useState(colorFolderList);

  const [isShowRemoveModal, setIsShowRemoveModal] = React.useState(false);

  const [isShowEditModal, setIsShowEditModal] = React.useState(false);

  const [isShowAddModal, setIsShowAddModal] = React.useState(false);

  const { auth, alert, user } = useSelector((state: RootStore) => state);

  const router = useRouter();
  //lay ra id tu path
  const {
    query: { id }, //id of folder get from path
  } = router;

  const [folder, setFolder]: [IFolder, (folders: IFolder) => void] =
    React.useState(defaultFolder);

  const [studySets, setStudySets]: [
    IStudySet[],
    (studySets: IStudySet[]) => void
  ] = React.useState(defaultStudySets);

  const [loading, setLoading]: [boolean, (loading: boolean) => void] =
    React.useState<boolean>(true);

  const [error, setError]: [string, (error: string) => void] =
    React.useState("not found");

  const [idRemoveStudySet, setIdRemoveStudySet]: [
    number,
    (idRemoveStudySet: number) => void
  ] = React.useState<number>(0);

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isTitleTyping, setIsTitleTyping] = React.useState(false);
  const [isDescriptionTyping, setIsDescriptionTyping] = React.useState(false);

  // get value of color in select
  const [stateColorFolder, setStateColorFolder] = React.useState({ color: "" });

  const formValue = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStateColorFolder({
      ...stateColorFolder,
      [event.target.name]: event.target.value.trim(),
    });
  };

  const color_folder = React.useRef<HTMLSelectElement>(null);

  const [isToastOpen, setIsToastOpen] = React.useState(false);
  const [typeToast, setTypeToast] = React.useState("success");
  const [messageToast, setMessageToast] = React.useState("");

  const [isShowEmpty, setIsShowEmpty] = React.useState(false);
  React.useEffect(() => {
    // load detail data of folder
    async function excute() {
      try {
        const res = await getAPI(`http://localhost:8080/getFolder/${id}`);
        setFolder(res.data);
        setTitle(res.data.title);
        setDescription(res.data.description);
        setStateColorFolder({ color: res.data.color });
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err);
      }
    }

    excute();
  }, [id]);

  React.useEffect(() => {
    // list SS already in folder
    async function excute() {
      try {
        const res = await getAPI(
          `http://localhost:8080/listStudySetsOfFolder/${id}`
        );
        setStudySets(res.data);

        if (studySets.length === 0) setIsShowEmpty(true);
        else setIsShowEmpty(false);

        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err);
      }
    }

    excute();
  }, [id, studySets]);

  // remove SS from folder
  const removeStudySet = async () => {
    try {
      const res = await deleteAPI(
        "http://localhost:8080/deleteStudySetFromFolder/" +
          id +
          "/" +
          idRemoveStudySet
      );
      setLoading(false);

      setMessageToast("remove studySet from folder successfully");
      setTypeToast("success");
      setIsToastOpen(true);
    } catch (err) {
      setLoading(false);
      setError(err);
    }

    setIsShowRemoveModal(!isShowRemoveModal);
  };

  const handleRemoveStudySet = (studySet_id: number) => {
    setIsShowRemoveModal(!isShowRemoveModal);
    setIdRemoveStudySet(studySet_id);
  };

  const closeRemoveStudySetModal = () => {
    setIsShowRemoveModal(!isShowRemoveModal);
  };

  // edit folder
  const editFolder = async (e: FormSubmit) => {
    setIsTitleTyping(false);
    setIsDescriptionTyping(false);

    e.preventDefault();

    // update static data
    folder.title = title;
    folder.description = description;
    folder.color = "" + color_folder.current?.value;

    // update dynamic data
    const color = "" + color_folder.current?.value;
    const data = { title, description, color, id };

    async function excute() {
      try {
        const res = await putAPI(`http://localhost:8080/editFolder`, data);
        setLoading(false);
        setMessageToast("edit folder successfully");
        setTypeToast("success");
        setIsToastOpen(true);
      } catch (err) {
        setLoading(false);
        setError(err);
      }
    }

    excute();

    setIsShowEditModal(!isShowEditModal);
  };

  // share link
  function shareLink() {
    navigator.clipboard.writeText(window.location.href);
    setMessageToast("copied link");
    setTypeToast("success");
    setIsToastOpen(true);
  }

  React.useEffect(() => {
    // load folder color
    async function excute() {
      try {
        const res = await getAPI(`http://localhost:8080/getColorFolder`);
        setColors(res.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err);
      }
    }

    excute();
  }, []);

  // load option for select of folder color
  const listColorItems = colors.map((item) => (
    <option key={item.toString()}>{item}</option>
  ));

  React.useEffect(() => {
    // load SS of user for adding to folder
    async function excute() {
      try {
        const res = await getAPI(
          `http://localhost:8080/api/lib/ss/created?userId=${auth.userResponse?._id}`
        );
        setAddSets(res.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err);
      }
    }

    excute();
  }, [auth.userResponse?._id]);

  // populate SS to li in ul
  const listSetAdd = addSets.map((set) => (
    <li key={set.title} className="flex flex-row">
      <div className="select-none cursor-pointer flex flex-1 items-center p-4">
        <div className="flex-1 pl-1 mr-16">
          <div className="font-medium dark:text-white">{set.title}</div>
        </div>
        <button
          onClick={() => addStudySetToFolder(set.id)}
          className="w-24 text-right flex justify-end"
          type="button"
        >
          <Icon>add_circle</Icon>
        </button>
      </div>
    </li>
  ));

  // add existing SS to Folder
  async function addStudySetToFolder(studySetAdd_id: number) {
    const data = {
      folder_id: id,
      studySet_id: studySetAdd_id,
    };

    try {
      const res = await putAPI(
        `http://localhost:8080/addStudySetToFolder`,
        data
      );
      setLoading(false);

      console.log(res.data);

      if (res.data === "cancel adding") {
        setMessageToast("studySet existed in folder");
        setTypeToast("error");
        setIsToastOpen(true);
      } else {
        setMessageToast("add studySet to folder successfully");
        setTypeToast("success");
        setIsToastOpen(true);
      }
    } catch (err) {
      setLoading(false);

      setError(err);
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
      <AppLayout title="folder" desc="folder">
        <div className="grid lg:grid-cols-4 gap-6 grid-cols-1 self-center lg:w-4/5 w-full px-2 mt-4">
          {/* left side */}
          <div className="col-span-1 px-2 border-r-2 border-gray-200  ">
            <div className=" w-full px-2">
              <div className="w-full flex items-center">
                <div>
                  <svg
                    fill={folder.color}
                    className="w-12 h-12 text-gray-800"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M0 4c0-1.1.9-2 2-2h7l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4z"></path>
                  </svg>
                </div>
                <div className="px-3 mr-auto">
                  <h4 className="font-bold text-xl">{folder.title}</h4>
                  <small className="text-md">
                    create by{" "}
                    <a href={`${folder.creatorUserName}/library/sets`}>
                      {folder.creatorUserName}
                    </a>
                  </small>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-light text-gray-800">
                  {folder.description}
                </p>
              </div>
            </div>
          </div>
          {/* right side */}
          <div className="col-span-3 h-screen">
            <div className="flex justify-between mt-2">
              <div className="fex flex-col">
                <a href={`/${folder.creatorUserName}/library/folders`}>
                  <span>back to library folder</span>
                </a>
              </div>
              {/* toolbar */}
              <div className="flex flex-row">
                {folder.creatorUserName === auth.userResponse?.username ? (
                  <div>
                    <button
                      onClick={() => setIsShowAddModal(!isShowAddModal)}
                      className="mx-2 tooltip"
                    >
                      <AddIcon className="hover:text-gray-900 text-gray-700" />
                      <span className="tooltiptext w-32">add study sets</span>
                    </button>
                    <button
                      onClick={() => setIsShowEditModal(!isShowEditModal)}
                      className="mx-2 tooltip"
                    >
                      <EditIcon className="hover:text-gray-900 text-gray-700" />
                      <span className="tooltiptext w-16">edit</span>
                    </button>
                  </div>
                ) : null}
                <button onClick={shareLink} className="mx-2 tooltip">
                  <ShareIcon className="hover:text-gray-900 text-gray-700" />
                  <span className="tooltiptext w-16">share</span>
                </button>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-4">
              {isShowEmpty ? (
                <div className="rounded-md flex items-center bg-white jusitfy-between px-5 py-4 mb-2 text-blue-500">
                  <div className="w-full flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      className=" w-6 h-6 mr-2"
                      viewBox="0 0 1792 1792"
                    >
                      <path d="M1024 1375v-190q0-14-9.5-23.5t-22.5-9.5h-192q-13 0-22.5 9.5t-9.5 23.5v190q0 14 9.5 23.5t22.5 9.5h192q13 0 22.5-9.5t9.5-23.5zm-2-374l18-459q0-12-10-19-13-11-24-11h-220q-11 0-24 11-10 7-10 21l17 457q0 10 10 16.5t24 6.5h185q14 0 23.5-6.5t10.5-16.5zm-14-934l768 1408q35 63-2 126-17 29-46.5 46t-63.5 17h-1536q-34 0-63.5-17t-46.5-46q-37-63-2-126l768-1408q17-31 47-49t65-18 65 18 47 49z"></path>
                    </svg>
                    Empty
                  </div>
                </div>
              ) : null}
              {studySets.map((set, index) => {
                return (
                  <div className="col-span-1">
                    <div
                      key={index}
                      className="grid grid-rows-5 shadow-lg relative  col-span-1 rounded-md p-2 h-48 my-4 bg-white dark:bg-gray-800 "
                    >
                      <div className="row-span-1 w-full flex mb-2">
                        <div className="w-full">
                          <p className="text-gray-800 dark:text-white text-xl font-medium ">
                            <a
                              href={`/set/${set.studySet_id}`}
                              className="hover:underline"
                            >
                              {set.title}{" "}
                            </a>
                            <FiberManualRecordIcon
                              className={`text-${set.color.toLowerCase()}-400`}
                            />{" "}
                            <a href={`/${set.creatorName}/library/sets`}>
                              <span className="text-gray-500 text-md font-light hover:underline">
                                {set.creatorName}
                              </span>
                            </a>
                          </p>
                        </div>
                        <div>
                          <button
                            onClick={() =>
                              handleRemoveStudySet(set.studySet_id)
                            }
                            className="tooltip flex items-center focus:outline-none"
                          >
                            <HighlightOffIcon className="hover:text-gray-900 text-gray-700" />
                          </button>
                        </div>
                      </div>
                      <div className="row-span-2 mb-12">
                        {set.description.length < 50 ? (
                          <p className="text-gray-500">{set.description}</p>
                        ) : (
                          <p className="text-gray-500">
                            {set.description.substring(0, 50)}...
                          </p>
                        )}
                      </div>
                      {/* hien thi tag */}
                      <div className="row-span-1 flex">
                        {_.split(set.tags, ",").map((tag, index) => {
                          return (
                            <div className="mx-1 my-1">
                              <span className="px-2 py-1 rounded-xl text-gray-800  bg-gray-200   ">
                                {tag}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="row-span-1 mt-2">
                        <p>{set.numberOfCards} cards</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {isShowRemoveModal ? (
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 backdrop-filter backdrop-blur-xs -mt-12">
              <div className="h-screen w-full absolute flex items-center justify-center bg-modal">
                <div className="bg-white rounded shadow p-6 m-4 max-w-xs max-h-full text-center">
                  <div className="mb-4"></div>
                  <div className="mb-8">
                    <p>
                      Are you sure want to remove this study set from your
                      folder?
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={removeStudySet}
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
                      onClick={closeRemoveStudySetModal}
                      className=" text-white w-32 py-1 mx-4 rounded bg-green-500 hover:bg-green-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {isShowEditModal ? (
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 backdrop-filter backdrop-blur-xs -mt-12">
              <div className="h-screen w-full absolute flex items-center justify-center bg-modal">
                <div className="bg-white rounded shadow p-6 m-4 max-w-xs max-h-full text-center">
                  <div className="mb-4"></div>
                  <div className="mb-8">
                    <p>Edit folder</p>
                  </div>
                  <form onSubmit={editFolder}>
                    <div className="w-full px-4 flex-wrap">
                      <InputGroup
                        type="text"
                        value={title}
                        setValue={setTitle}
                        placeholder="Title"
                        error={
                          !isTitleTyping ? alert.errors?.errors?.title : ""
                        }
                        required
                        label="Title"
                      />
                      <InputGroup
                        type="text"
                        value={description}
                        setValue={setDescription}
                        placeholder="Description"
                        error={
                          !isDescriptionTyping
                            ? alert.errors?.errors?.description
                            : ""
                        }
                        required
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
                          className="block border border-grey-light w-full p-2 rounded mb-1 focus:border-purple-400 text-sm"
                          ref={color_folder}
                          name="color"
                          onChange={formValue}
                          value={stateColorFolder.color}
                        >
                          {listColorItems}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-end px-12 py-6">
                      <button
                        className=" bg-green-500 text-white w-28 py-1 ml-1 rounded-md text-sm font-medium hover:bg-green-600"
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
                        className="bg-gray-100 border-2 text-gray-700 w-28 py-1 mr-1 rounded-md text-sm font-medium hover:bg-gray-300"
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
          {isShowAddModal ? (
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 backdrop-filter backdrop-blur-xs -mt-12">
              <div className="h-screen w-full absolute flex items-center justify-center bg-modal">
                <div className="bg-white rounded shadow p-6 m-4 max-w-xs max-h-full text-center">
                  <div className="mb-4"></div>
                  <div className="mb-8">
                    <p>Add StudySet To Folder</p>
                  </div>
                  <Link
                    href={{
                      pathname: "/set/add",
                    }}
                  >
                    <button
                      type="button"
                      className="w-full border text-base font-medium text-black bg-white hover:bg-gray-100 px-4 py-2"
                    >
                      Add new studySet
                    </button>
                  </Link>
                  <br></br>
                  <div className="container flex flex-col mx-auto w-full bg-white dark:bg-gray-800 rounded-lg shadow">
                    <ul id="ulSetAdd" className="flex flex-col divide divide-y">
                      {listSetAdd}
                    </ul>
                  </div>
                  <div className="flex items-center justify-center px-6 py-6">
                    <button
                      className="bg-gray-100 border-2 text-gray-700 w-28 py-1 mr-1 rounded-md text-sm font-medium hover:bg-gray-300"
                      type="button"
                      onClick={() => setIsShowAddModal(!isShowAddModal)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

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

export default Folder;
