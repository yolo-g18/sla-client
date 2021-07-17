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
import React from 'react';
import { deleteAPI } from "../../utils/FetchData";
import { getAPI } from "../../utils/FetchData";
import InputGroup from "../input/InputGroup";
import { FormSubmit } from "../../utils/TypeScript";
import { putAPI } from "../../utils/FetchData";
import Icon from '@material-ui/core/Icon';


const colorFolderList: String[] = [];
const defaultFolder: IFolder = {

  folder_id: 0,
  title: "",
  description: "",
  color: "",
  numberOfSets: 0,
  createdDate: "",
  creatorUserName: ""

};

const defaultStudySets: IStudySet[] = [];
const Folder = () => {

  // set state for array color
  const [colors, setColors]: [String[], (colors: String[]) => void] = React.useState(
    colorFolderList
  );

  const [isShowRemoveModal, setIsShowRemoveModal] = React.useState(false);

  const [isShowEditModal, setIsShowEditModal] = React.useState(false);

  const [isShowAddModal, setIsShowAddModal] = React.useState(false);

  const { auth, alert } = useSelector((state: RootStore) => state);

  const router = useRouter();
  //lay ra id tu path
  const {
    query: { id }, //id of folder get from path
  } = router;


  const [folder, setFolder]: [IFolder, (folders: IFolder) => void] = React.useState(
    defaultFolder
  );

  const [studySets, setStudySets]: [IStudySet[], (studySets: IStudySet[]) => void] = React.useState(
    defaultStudySets
  );

  const [loading, setLoading]: [
    boolean,
    (loading: boolean) => void
  ] = React.useState<boolean>(true);


  const [error, setError]: [string, (error: string) => void] = React.useState(
    'not found'
  );



  React.useEffect(() => {

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
    async function excute() {
      setLoading(true);
      try {

        const res = await getAPI(`http://localhost:8080/listStudySetsOfFolder/${id}`);
        setStudySets(res.data);
        setLoading(false);

      } catch (err) {
        setLoading(false);
        setError(err);

      }
    }

    excute();

  }, [id]);



  const [idRemoveStudySet, setIdRemoveStudySet]: [number, (idRemoveStudySet: number) => void]
    = React.useState<number>(0);



  const removeStudySet = async () => {

    // delete static data
    let index = studySets.findIndex(obj => obj.studySet_id === idRemoveStudySet);

    const tempStudySets = studySets.splice(index, 1);

    //delete dynamic data
    setLoading(true);
    try {

      const res = await deleteAPI('http://localhost:8080/deleteStudySetFromFolder/' + id + "/" + idRemoveStudySet);
      setLoading(false);

    } catch (err) {
      setError(err);
      setLoading(false);

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

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isTitleTyping, setIsTitleTyping] = React.useState(false);
  const [isDescriptionTyping, setIsDescriptionTyping] = React.useState(false);

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
      setLoading(true);
      try {

        const res = await putAPI(`http://localhost:8080/editFolder`, data);
        console.log(res.data);
        setLoading(false);

      } catch (err) {
        setLoading(false);
        setError(err);

      }
    }

    excute();


    setIsShowEditModal(!isShowEditModal);
  }

  function shareLink() {
    navigator.clipboard.writeText(window.location.href);
  }

  // call api folder color
  React.useEffect(() => {


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
  const listColorItems = colors.map((item) =>
    <option key={item.toString()}>{item}</option>
  );


  // get value of color in select
  const [stateColorFolder, setStateColorFolder] = React.useState({ color: "" });


  const formValue = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStateColorFolder({ ...stateColorFolder, [event.target.name]: event.target.value.trim() });
  };

  const color_folder = React.useRef<HTMLSelectElement>(null);

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
                  <KeyboardBackspaceIcon className="hover:text-gray-600" />{" "}
                  <span>back to library folder</span>
                </a>
              </div>
              {/* toolbar */}
              <div className="flex flex-row">
                {folder.creatorUserName === auth.userResponse?.username ? (
                  <div>
                    <button onClick={() => setIsShowAddModal(!isShowAddModal)} className="mx-1 tooltip">
                      <AddIcon className="hover:text-gray-900 text-gray-700" />
                      <span className="tooltiptext ">add study sets</span>
                    </button>
                    <button onClick={() => setIsShowEditModal(!isShowEditModal)} className="mx-1 tooltip">
                      <EditIcon className="hover:text-gray-900 text-gray-700" />
                      <span className="tooltiptext ">edit</span>
                    </button>
                  </div>
                ) : null}
                <button onClick={shareLink} className="mx-1 tooltip">
                  <ShareIcon className="hover:text-gray-900 text-gray-700" />
                  <span className="tooltiptext ">share</span>
                </button>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                            onClick={() => handleRemoveStudySet(set.studySet_id)}
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
                      Remove
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
                    <p>
                      Edit folder
                    </p>
                  </div>
                  <form onSubmit={editFolder}>

                    <div className="w-full px-4 flex-wrap">

                      <InputGroup
                        type="text"
                        value={title}
                        setValue={setTitle}
                        placeholder="Title"
                        error={!isTitleTyping ? alert.errors?.errors?.title : ""}
                        required
                        label="Title"
                      />
                      <InputGroup
                        type="text"
                        value={description}
                        setValue={setDescription}
                        placeholder="Description"
                        error={!isDescriptionTyping ? alert.errors?.errors?.description : ""}
                        required
                        label="Description"
                      />
                      <div className="relative mb-4">
                        <div className="flex items-center justify-between">
                          <label className="text-gray-700 text-sm font-bold mb-2" >

                            Colors
                          </label>
                        </div>
                        <select id="color"
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
                    <p>
                      Add StudySet To Folder
                    </p>
                  </div>
                  <form >
                    <button type="button" className="w-full border text-base font-medium text-black bg-white hover:bg-gray-100 px-4 py-2">
                      Add new studySet
                    </button>
                    <br></br>
                    <div className="container flex flex-col mx-auto w-full bg-white dark:bg-gray-800 rounded-lg shadow" key="1">
                      <ul className="flex flex-col divide divide-y">
                        <li className="flex flex-row">
                          <div className="select-none cursor-pointer flex flex-1 items-center p-4">
                            <div className="flex-1 pl-1 mr-16">

                              <div className="font-medium dark:text-white">
                                title
                              </div>


                            </div>

                            <button className="w-24 text-right flex justify-end">
                              <Icon>add_circle</Icon>
                            </button>
                          </div>
                        </li>
                      </ul>
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
                          "Add"
                        )}
                      </button>
                      <button
                        className="bg-gray-100 border-2 text-gray-700 w-28 py-1 mr-1 rounded-md text-sm font-medium hover:bg-gray-300"
                        type="button"
                        onClick={() => setIsShowAddModal(!isShowAddModal)}
                      >
                        Cancel
                      </button>

                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </AppLayout>
    </div>
  );
};

export default Folder;