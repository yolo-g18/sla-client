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

import _, { divide } from "lodash";

const Folder = () => {
  const [listStudySet, setListStudySet] = useState<IStudySetInfo>({});
  const [tooltipShow, setTooltipShow] = useState(false);
  const [isShowRemoveModal, setIsShowRemoveModal] = useState(false);

  const { auth, alert } = useSelector((state: RootStore) => state);

  const router = useRouter();
  //lay ra id tu path
  const {
    query: { id }, //id of folder get from path
  } = router;

  const folderData = {
    title: "SE01",
    desc: "Melody Marks is an American actress born on 29th February 2000 in Ohio, United States of America. Her nationality is American and of White ethnicity. Melody is one of the busiest and talented actresses in the industry. The beautiful American actress has made plenty of movies to catch viewers' and makers' attention",
    username: "_testuser1",
    sets: [
      {
        _id: 1,
        title: "math101",
        desc: "Excluding merges, 1 author has pushed 1 commit to main and 26 commits to all branches. On main, 5 files have changed and there have been 2,805 additions and 16 deletions.",
        tags: "math, se01",
        creatorName: "user2",
        isPublic: true,
        numberCard: 54,
        color: "GREEN",
      },
      {
        _id: 2,
        title: "moblie201",
        desc: "On main, 5 files have changed and there",
        tags: "mobile, se01",
        creatorName: auth.userResponse?.username,
        isPublic: true,
        numberCard: 91,
        color: "YELLOW",
      },
    ],
  };

  const handelRemoveFolderClick = () => {
    setIsShowRemoveModal(!isShowRemoveModal);
  };

  console.log(isShowRemoveModal);

  //get list study sets by folder id| lam the nao de luc add hoac xoa thi list cap nhat ngay trong man

  //get folder info by foder id
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
                    fill="currentColor"
                    className="w-16 h-16 text-gray-700"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M0 4c0-1.1.9-2 2-2h7l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4z"></path>
                  </svg>
                </div>
                <div className="px-3 mr-auto">
                  <h4 className="font-bold text-xl">{folderData.title}</h4>
                  <small className="text-md">
                    create by{" "}
                    <a href={`${folderData.username}/library/sets`}>
                      {folderData.username}
                    </a>
                  </small>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-md text-gray-800">{folderData.desc}</p>
              </div>
            </div>
          </div>
          {/* right side */}
          <div className="col-span-3 h-screen">
            <div className="flex justify-between mt-2">
              <div className="fex flex-col">
                <a href={`/${folderData.username}/library/folders`}>
                  <KeyboardBackspaceIcon className="hover:text-gray-600" />{" "}
                  <span>back to library folder</span>
                </a>
              </div>
              {/* toolbar */}
              <div className="flex flex-row">
                {folderData.username === auth.userResponse?.username ? (
                  <div>
                    <button className="mx-1 tooltip">
                      <AddIcon className="hover:text-gray-900 text-gray-700" />
                      <span className="tooltiptext ">add study sets</span>
                    </button>
                    <button className="mx-1 tooltip">
                      <EditIcon className="hover:text-gray-900 text-gray-700" />
                      <span className="tooltiptext ">edit</span>
                    </button>
                  </div>
                ) : null}
                <button className="mx-1 tooltip">
                  <ShareIcon className="hover:text-gray-900 text-gray-700" />
                  <span className="tooltiptext ">share</span>
                </button>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-4">
              {folderData.sets.map((set, index) => {
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
                              href={`/set/${set._id}`}
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
                            onClick={handelRemoveFolderClick}
                            className="tooltip flex items-center focus:outline-none"
                          >
                            <HighlightOffIcon className="hover:text-gray-900 text-gray-700" />
                            <span className="tooltiptext">remove folder</span>
                          </button>
                        </div>
                      </div>
                      <div className="row-span-2 mb-12">
                        {set.desc.length < 50 ? (
                          <p className="text-gray-500">{set.desc}</p>
                        ) : (
                          <p className="text-gray-500">
                            {set.desc.substring(0, 50)}...
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
                        <p>{set.numberCard} cards</p>
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
                      folder
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={handelRemoveFolderClick}
                      className="text-white w-32 rounded mx-4 bg-yellow-500 hover:bg-yellow-600"
                    >
                      Remove
                    </button>
                    <button
                      onClick={handelRemoveFolderClick}
                      className=" text-white w-32 py-1 mx-4 rounded bg-green-500 hover:bg-green-600"
                    >
                      Cancel
                    </button>
                  </div>
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
