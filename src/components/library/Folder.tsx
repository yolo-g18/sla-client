import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { RootStore } from "../../utils/TypeScript";
import AppLayout from "../layout/AppLayout";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import ShareIcon from "@material-ui/icons/Share";
import { IFolder } from "../../utils/TypeScript";
import { IStudySet } from "../../utils/TypeScript";
import _ from "lodash";
import React from "react";
import { deleteAPI } from "../../utils/FetchData";
import { getAPI } from "../../utils/FetchData";
import InputGroup from "../input/InputGroup";
import { FormSubmit } from "../../utils/TypeScript";
import { putAPI } from "../../utils/FetchData";
import { ISetAdd } from "../../utils/TypeScript";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { ALERT } from "../../redux/types/alertType";
import { PARAMS } from "../../common/params";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import RemoveCircleRoundedIcon from "@material-ui/icons/RemoveCircleRounded";
import FolderOpenRoundedIcon from "@material-ui/icons/FolderOpenRounded";
import AddBoxRoundedIcon from "@material-ui/icons/AddBoxRounded";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

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
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // populate form add SS to folder
  const [addSets, setAddSets]: [ISetAdd[], (addSets: ISetAdd[]) => void] =
    React.useState(defaulAddSets);
  // set state for array color
  const [colors, setColors]: [String[], (colors: String[]) => void] =
    React.useState(colorFolderList);

  const [isShowRemoveModal, setIsShowRemoveModal] = React.useState(false);
  const [isShowEditModal, setIsShowEditModal] = React.useState(false);
  const [isShowAddModal, setIsShowAddModal] = React.useState(false);
  const { auth, alert, user } = useSelector((state: RootStore) => state);
  const [showModalDeleteFolder, setShowModalDeleteFolder] = useState(false);
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);

  const router = useRouter();
  //lay ra id tu path
  const {
    query: { id },
  } = router;

  const [folder, setFolder] = React.useState<IFolder>(defaultFolder);

  const [studySets, setStudySets]: [
    IStudySet[],
    (studySets: IStudySet[]) => void
  ] = React.useState(defaultStudySets);

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

  const [isShowEmpty, setIsShowEmpty] = React.useState(true);
  // const [errInputFolder, setErrInputFolder] = useState<any>({
  //   title: "",
  //   description: "da",
  // });
  const [titleErr, setTitleErr] = useState("");
  const [descErr, setDescErr] = useState("");

  React.useEffect(() => {
    // load detail data of folder

    async function excute() {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await getAPI(`${PARAMS.ENDPOINT}folder/getFolder/${id}`);
        dispatch({ type: ALERT, payload: { loading: false } });
        setFolder(res.data);
        setTitle(res.data.title);
        setDescription(res.data.description);
        setStateColorFolder({ color: res.data.color });
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
      }
    }

    excute();
  }, [id, alert.success]);

  React.useEffect(() => {
    // list SS already in folder

    async function excute() {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await getAPI(
          `${PARAMS.ENDPOINT}folder/listStudySetsOfFolder/${id}`
        );
        dispatch({ type: ALERT, payload: { loading: false } });
        setStudySets(res.data);
        if (studySets.length === 0) setIsShowEmpty(true);
        else setIsShowEmpty(false);
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
      }
    }

    excute();
  }, [id, alert.success, isShowEmpty]);

  // remove SS from folder
  const removeStudySet = async () => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      const res = await deleteAPI(
        `${PARAMS.ENDPOINT}folder/deleteStudySetFromFolder/${id}/${idRemoveStudySet}`
      );
      dispatch({ type: ALERT, payload: { loading: false, success: "abc" } });

      setMessageToast("set removed");
      setTypeToast("success");
      setIsToastOpen(true);
    } catch (err) {
      dispatch({ type: ALERT, payload: { loading: false } });
      setIsToastOpen(true);
      setTypeToast("error");
      setMessageToast("An error occurred");
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
    if (titleErr || descErr) return;

    const color = "" + color_folder.current?.value;
    const data = { title, description, color, id };

    async function excute() {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await putAPI(`${PARAMS.ENDPOINT}folder/editFolder`, data);
        dispatch({ type: ALERT, payload: { loading: false, success: "abc" } });
        setMessageToast("Folder updated");
        setTypeToast("success");
        setIsToastOpen(true);
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
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
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await getAPI(`${PARAMS.ENDPOINT}folder/getColorFolder`);
        dispatch({ type: ALERT, payload: { loading: false } });
        setColors(res.data);
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
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
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await getAPI(
          `${PARAMS.ENDPOINT}lib/ss/created?userId=${auth.userResponse?._id}`
        );
        dispatch({ type: ALERT, payload: { loading: false } });
        setAddSets(res.data);
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
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
          onClick={() => addStudySetToFolder(set.id)}
          className="w-24 text-right flex justify-end focus:outline-none"
          type="button"
        >
          <AddBoxRoundedIcon
            fontSize="large"
            className="text-blue-500 hover:text-blue-600"
          />
        </button>
      </div>
    </div>
  ));

  // add existing SS to Folder
  async function addStudySetToFolder(studySetAdd_id: number) {
    const data = {
      folder_id: id,
      studySet_id: studySetAdd_id,
    };

    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      const res = await putAPI(
        `${PARAMS.ENDPOINT}folder/addStudySetToFolder`,
        data
      );
      dispatch({ type: ALERT, payload: { loading: false, success: "ac" } });
      setMessageToast("set added");
      setTypeToast("success");
      setIsToastOpen(true);
    } catch (err) {
      dispatch({ type: ALERT, payload: { loading: false } });
      setMessageToast("set existed in folder");
      setTypeToast("error");
      setIsToastOpen(true);
    }
  }
  //handel close toast
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setIsToastOpen(false);
  };

  //validate title and desc input
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

  const deleteFolder = async () => {
    dispatch({ type: ALERT, payload: { loading: true } });
    try {
      const res = await deleteAPI(
        `${PARAMS.ENDPOINT}folder/deleteFolder/${folder.folder_id}`
      );
      dispatch({ type: ALERT, payload: { loading: false, success: "aa" } });

      setMessageToast("folder removed");
      setTypeToast("success");
      setIsToastOpen(true);
      router.push({
        pathname: "/[username]/library/folders",
        query: { username: folder.creatorUserName },
      });
    } catch (err) {
      dispatch({ type: ALERT, payload: { loading: false } });
      setMessageToast("An error occurred");
      setTypeToast("error");
      setIsToastOpen(true);
    }

    setIsShowDeleteModal(false);
  };

  return (
    <div>
      <AppLayout title={`Folder | ${folder.title}`} desc="folder">
        <div className="grid lg:grid-cols-4 gap-6 grid-cols-1 self-center lg:w-5/6 w-full px-2 mt-4 h-full">
          {/* left side */}
          <div className="col-span-1 px-2 ">
            <div className=" w-full px-2">
              <div className="w-full flex items-center">
                <div>
                  <FolderOpenRoundedIcon
                    className={`text-${folder.color?.toLocaleLowerCase()}-400`}
                    style={{ fontSize: 65 }}
                  />
                </div>
                <div className="px-3 mr-auto">
                  <h4 className="font-bold text-xl">{folder.title}</h4>
                  <small className="text-md">
                    create by{" "}
                    <Link href={`/${folder.creatorUserName}/library/sets`}>
                      <span className="hover:underline cursor-pointer">
                        {" "}
                        {folder.creatorUserName}
                      </span>
                    </Link>
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
          <div className="col-span-3 mb-44">
            <div className="flex justify-between mt-2">
              <div className="fex flex-col">
                <Link href={`/${folder.creatorUserName}/library/folders`}>
                  <p className="text-sm text-gray-600 hover:underline cursor-pointer hover:text-gray-800">
                    <ChevronLeftIcon /> Back to library folder
                  </p>
                </Link>
              </div>
              {/* toolbar */}
              <div className="flex flex-row">
                {folder.creatorUserName === auth.userResponse?.username ? (
                  <div>
                    <button
                      onClick={() => setIsShowAddModal(!isShowAddModal)}
                      className="mx-4 tooltip focus:outline-none"
                    >
                      <AddIcon
                        fontSize="default"
                        className="hover:text-gray-400 text-gray-700"
                      />
                      <span className="tooltiptext w-32">add study sets</span>
                    </button>
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
                  </div>
                ) : null}
                <button
                  onClick={shareLink}
                  className="mx-2 tooltip focus:outline-none"
                >
                  <ShareIcon
                    fontSize="small"
                    className="hover:text-gray-400 text-gray-700 "
                  />
                  <span className="tooltiptext w-16">share</span>
                </button>
                {folder.creatorUserName === auth.userResponse?.username ? (
                  <button
                    className="mx-2 tooltip focus:outline-none"
                    onClick={() => setIsShowDeleteModal(true)}
                  >
                    <DeleteOutlinedIcon className="hover:text-yellow-500 text-gray-700 " />
                    <span className="tooltiptext w-16">delete</span>
                  </button>
                ) : null}
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-4">
              {studySets.length === 0 ? (
                <div className="col-span-2 text-center mx-auto">
                  <p className="text-3xl font-semibold text-gray-700">
                    This folder has no sets yet
                  </p>

                  {auth.userResponse?.username === folder.creatorUserName ? (
                    <div>
                      <p className="text-md text-gray-600">
                        Organize all your study sets with folders.
                      </p>
                      <div className="mt-4 text-center">
                        <button
                          onClick={() => setIsShowAddModal(true)}
                          type="button"
                          className="w-44 text-md rounded-sm px-4 mx-2 py-2
                      text-md font-bold bg-blue-500 hover:bg-blue-600 
                   text-white focus:outline-none"
                        >
                          Create a new set
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                studySets.map((set, index) => {
                  return (
                    <div className=" col-span-1" key={index}>
                      <div
                        className="flex-col col-span-1 rounded-md my-4 bg-white 
                          hover:border-gray-300 hover:shadow-lg cursor-pointer shadow-md border-b-2 border-gray-200 p-4"
                      >
                        <div className=" w-full flex flex-row mb-2">
                          <div className="w-full flex justify-between my-auto">
                            <Link href={`/set/${set.studySet_id}`}>
                              <p className="text-gray-800 dark:text-white text-xl font-medium truncate hover:underline">
                                {set.title}
                              </p>
                            </Link>
                            <Link href={`/${set.creatorName}/library/sets`}>
                              <p className="my-auto ml-2">
                                <span className="text-gray-500 text-sm hover:underline">
                                  {set.creatorName}
                                </span>
                              </p>
                            </Link>
                          </div>
                        </div>
                        <div className="mb-4 h-20">
                          {set.description.length <= 150 ? (
                            <p className="text-gray-500">{set.description}</p>
                          ) : (
                            <p className="text-gray-500">
                              {set.description.substring(0, 150)}...
                            </p>
                          )}
                        </div>
                        <div className="flex justify-between">
                          <div className=" mt-1">
                            <p>{set.numberOfCards} cards</p>
                          </div>
                          <button
                            className="focus:outline-none tooltip"
                            onClick={() => setIsShowDeleteModal(true)}
                          >
                            <RemoveCircleRoundedIcon className="hover:text-yellow-500 text-gray-700" />
                            <span className="tooltiptext w-20">remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          {isShowRemoveModal ? (
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 backdrop-filter backdrop-brightness-50 -mt-12">
              <div className="h-screen w-full absolute flex items-center justify-center bg-modal">
                <div className="bg-white rounded-sm shadow p-6 m-4 max-w-xs max-h-full text-center">
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
                      className=" text-white w-32 py-1 mx-4 rounded bg-blue-500 hover:bg-blue-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {isShowEditModal ? (
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 backdrop-filter backdrop-brightness-50 -mt-12">
              <div className="h-screen w-full absolute flex items-center justify-center bg-modal">
                <div className="bg-white rounded-md shadow p-6 m-4 max-w-xs max-h-full">
                  <div className="px-2 pb-6 pt-2 rounded-sm">
                    <p className="text-gray-700 font-semibold text-lg text-center">
                      Edit folder
                    </p>
                  </div>
                  <form onSubmit={editFolder}>
                    <div className="w-full mb-8 flex-wrap">
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
                      <div className="relative mb-4">
                        <div className="flex items-center justify-between">
                          <label className="text-gray-700 text-sm font-bold mb-2">
                            Colors
                          </label>
                        </div>
                        <select
                          id="color"
                          className="block border border-grey-light w-full p-2 rounded-sm mb-1 focus:outline-none text-sm"
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
                        className=" bg-blue-500 text-white w-28 py-1  mx-4 rounded-sm text-sm font-medium hover:bg-blue-600"
                        type="submit"
                      >
                        {alert.loading ? (
                          <div className="flex justify-center items-center space-x-1">
                            Saving...
                          </div>
                        ) : (
                          "Save"
                        )}
                      </button>
                      <button
                        className="bg-gray-100 border-2 text-gray-700 w-28 py-1 mx-4 rounded-sm text-sm font-medium hover:bg-gray-300"
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
                          className="w-40 text-md rounded-sm px-4 mx-2 py-2
                          text-md font-bold bg-blue-500 hover:bg-blue-600 
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
                        className="bg-gray-100 border-2 text-gray-700 w-28 py-1 rounded-sm text-sm font-medium hover:text-gray-900 focus:outline-none"
                        type="button"
                        onClick={() => setIsShowAddModal(!isShowAddModal)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {isShowDeleteModal ? (
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 backdrop-filter backdrop-brightness-50 -mt-12">
              <div className=" w-full absolute flex items-center justify-center bg-modal">
                <div className="bg-white rounded shadow p-6 m-4 max-w-xs max-h-full text-center">
                  <div className="mb-8">
                    <p className="text-xl font-semibold">
                      Are you sure want to remove this folder?
                    </p>
                    <small>
                      All sets in this folder will not be deleted from the
                      library
                    </small>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={deleteFolder}
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
                      onClick={() => setIsShowDeleteModal(false)}
                      className=" text-white w-32 py-1 mx-4 rounded bg-blue-500 hover:bg-blue-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <Snackbar
          open={isToastOpen}
          autoHideDuration={3000}
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
