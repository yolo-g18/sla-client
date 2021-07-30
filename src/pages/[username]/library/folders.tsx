import LibraryLayout from "../../../components/layout/LibraryLayout";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { RootStore } from "../../../utils/TypeScript";
import { IFolder } from "../../../utils/TypeScript";
import React, { useState } from "react";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import Grid from "@material-ui/core/Grid";
import { deleteAPI } from "../../../utils/FetchData";
import { getAPI } from "../../../utils/FetchData";
import Link from "next/link";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { ALERT } from "../../../redux/types/alertType";
import { PARAMS } from "../../../common/params";
import FolderOpenRoundedIcon from "@material-ui/icons/FolderOpenRounded";

//alert
function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const folder = () => {
  
  const [folders, setFolders] = React.useState<IFolder[]>([]);
 

  const dispatch = useDispatch();

  const { auth, alert, user } = useSelector((state: RootStore) => state);

  const router = useRouter();

  const {
    query: { username },
  } = router;

  const [isShowRemoveModal, setIsShowRemoveModal] = React.useState(false);
  const [idRemoveFolder, setIdRemoveFolder] = React.useState<number>(0);

  const [isToastOpen, setIsToastOpen] = React.useState(false);
  const [typeToast, setTypeToast] = React.useState("success");
  const [messageToast, setMessageToast] = React.useState("");

  const [isShowEmpty, setIsShowEmpty] = React.useState(false);

  console.log("id: " + user._id);

  React.useEffect(() => {
  
    // list all folders of user
    async function excute() {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await getAPI(
          `${PARAMS.ENDPOINT}folder/getFolderListOfUser/${user._id}`
        );

        dispatch({ type: ALERT, payload: { loading: false } });
        setFolders(res.data);

        if (folders.length === 0) setIsShowEmpty(false);
        else setIsShowEmpty(false);
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
      }
    }
    excute();
  }, [user._id, alert.success]);

  // remove folder from listFolder of user
  async function removeFolder() {
    dispatch({ type: ALERT, payload: { loading: true } });
    try {
      const res = await deleteAPI(
        `${PARAMS.ENDPOINT}folder/deleteFolder/${idRemoveFolder}`
      );
      dispatch({ type: ALERT, payload: { loading: false , success:"ss"} });
      
      setMessageToast("folder deleted");
      setTypeToast("success");
      setIsToastOpen(true);
    } catch (err) {
      dispatch({ type: ALERT, payload: { loading: false } });
      setMessageToast("An error occurred");
      setTypeToast("error");
      setIsToastOpen(true);
   
    }

    setIsShowRemoveModal(!isShowRemoveModal);
  }

  const handleRemoveFolder = (folder_id: number) => {
    setIsShowRemoveModal(!isShowRemoveModal);
    setIdRemoveFolder(folder_id);
  };

  const closeRemoveFolderModal = () => {
    setIsShowRemoveModal(!isShowRemoveModal);
  };

  //handel close toast
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setIsToastOpen(false);
  };

  // if () {
  //   return <div>Loading...</div>;
  // }

  return (
    <div>
      <LibraryLayout>
        {folders.length === 0 ? (
          <div className="col-span-2 text-center mx-auto mt-24">
            <p className="text-3xl font-semibold text-gray-700">
              This folder has no sets yet
            </p>
            <p className="text-md text-gray-600">
              Organize all your study sets with folders.
            </p>
          </div>
        ) : (
          folders.map((item) => (
            <div
              className=" bg-white dark:bg-gray-800 mt-6 border-b-2  
             hover:border-gray-300 hover:shadow-lg rounded-lg shadow-md flex justify-between"
              key={item.folder_id}
            >
              <div className="w-full">
                <Link
                  href={{
                    pathname: "/folder/[id]",
                    query: { id: item.folder_id },
                  }}
                >
                  <div className="cursor-pointer flex flex-1 items-center p-4">
                    <div className="flex-1 pl-1 mr-16">
                      <div className="font-medium dark:text-white flex">
                        {username === auth.userResponse?.username ? (
                          item.color ? (
                            <FolderOpenRoundedIcon
                              className={`mr-2 text-${item.color?.toLocaleLowerCase()}-400`}
                            />
                          ) : (
                            <FolderOpenRoundedIcon className={`mr-2`} />
                          )
                        ) : (
                          <FolderOpenRoundedIcon className={`mr-2`} />
                        )}

                        <p>{item.title}</p>
                      </div>
                      <div className="text-gray-600 dark:text-gray-200 text-sm">
                        {item.numberOfSets <= 1
                          ? item.numberOfSets + " set"
                          : item.numberOfSets + " set"}
                      </div>
                    </div>
                    <div className="text-gray-600 dark:text-gray-200 text-xs">
                      {item.createdDate}
                    </div>
                  </div>
                </Link>
              </div>
              {username === auth.userResponse?.username ? (
                <div className="my-auto px-4">
                  <button
                    onClick={() => handleRemoveFolder(item.folder_id)}
                    className="text-right flex justify-end focus:outline-none"
                  >
                    <DeleteOutlinedIcon className="hover:text-yellow-500 text-gray-700 " />
                  </button>
                </div>
              ) : null}
            </div>
          ))
        )}
        {}
        {isShowRemoveModal ? (
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 backdrop-filter backdrop-brightness-50 -mt-12">
            <div className=" w-full absolute flex items-center justify-center bg-modal">
              <div className="bg-white rounded shadow p-6 m-4 max-w-xs max-h-full text-center">
                <div className="mb-8">
                  <p className="text-xl font-semibold">
                    Are you sure want to delete this folder?
                  </p>
                  <small>
                    All sets in this folder will not be remove from the library
                  </small>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={removeFolder}
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
                    onClick={closeRemoveFolderModal}
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
      </LibraryLayout>
    </div>
  );
};

export default folder;
