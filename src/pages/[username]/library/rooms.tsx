import LibraryLayout from "../../../components/layout/LibraryLayout";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootStore } from "../../../utils/TypeScript";
import { IFolder } from '../../../utils/TypeScript';
import React from 'react';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import Grid from '@material-ui/core/Grid';
import { deleteAPI } from '../../../utils/FetchData';
import { getAPI } from '../../../utils/FetchData';
import Link from "next/link";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { IRoom } from "../../../utils/TypeScript";

//alert
function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const defaultRooms: IRoom[] = [];
const rooms = (props: any) => {
  const { alert, user, auth } = useSelector((state: RootStore) => state);
  const [rooms, setRooms]: [IRoom[], (folders: IRoom[]) => void] = React.useState(
    defaultRooms
  );

  const [loading, setLoading]: [
    boolean,
    (loading: boolean) => void
  ] = React.useState<boolean>(true);

  const [error, setError]: [string, (error: string) => void] = React.useState(
    'not found'
  );

  const [isShowRemoveModal, setIsShowRemoveModal] = React.useState(false);
  const [isShowEmpty, setIsShowEmpty] = React.useState(false);
  const [idRemoveRoom, setIdRemoveRoom]: [number, (idRemoveRoom: number) => void]
    = React.useState<number>(0);

  const [isToastOpen, setIsToastOpen] = React.useState(false);
  const [typeToast, setTypeToast] = React.useState("success");
  const [messageToast, setMessageToast] = React.useState("");
  React.useEffect(() => {

    async function excute() {

      try {

        const res = await getAPI(`http://localhost:8080/getRoomListOfUser/${user._id}`);
        setRooms(res.data);

        if (rooms.length === 0)
          setIsShowEmpty(true);
        else
          setIsShowEmpty(false);

        setLoading(false);

      } catch (err: any) {
        setLoading(false);
        setError(err);

      }
    }

    excute();


  }, [user._id, user.username, rooms]);

  // remove room from listRoom of user
  async function removeRoom() {

    setLoading(true);
    try {

      const res = await deleteAPI('http://localhost:8080/deleteRoom/' + idRemoveRoom);
      setLoading(false);
      setMessageToast("remove room successfully");
      setTypeToast("success");
      setIsToastOpen(true);

    } catch (err) {
      setError(err);
      setLoading(false);

    }

    setIsShowRemoveModal(!isShowRemoveModal);

  }


  const handleRemoveRoom = (room_id: number) => {
    setIsShowRemoveModal(!isShowRemoveModal);
    setIdRemoveRoom(room_id);

  };

  const closeRemoveRoomModal = () => {
    setIsShowRemoveModal(!isShowRemoveModal);
  };

  //handel close toast
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setIsToastOpen(false);
  };

  return (
    <div>
      <LibraryLayout>
        {rooms.map(item => (
          <div className="container flex flex-col mx-auto w-full bg-white dark:bg-gray-800 rounded-lg shadow" key={item.room_id}>
            <ul className="flex flex-col divide divide-y">
              <li className="flex flex-row">
                <div className="select-none cursor-pointer flex flex-1 items-center p-4">
                  <div className="flex-1 pl-1 mr-16">
                    <div className="font-medium dark:text-white">
                      {item.name}
                    </div>
                    <div className="text-gray-600 dark:text-gray-200 text-sm">
                      {item.numberOfMembers <= 1 ?
                        item.numberOfMembers + " member" : item.numberOfMembers + " members"}
                    </div>
                  </div>
                  <div className="text-gray-600 dark:text-gray-200 text-xs">
                    {item.createdDate}
                  </div>
                  <button onClick={() => handleRemoveRoom(item.room_id)} className="w-24 text-right flex justify-end">
                    <Grid item xs={8}>
                      <DeleteOutlinedIcon />

                    </Grid>
                  </button>
                </div>
              </li>
            </ul>
          </div>
        ))}
        {isShowRemoveModal ? (
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 backdrop-filter backdrop-blur-xs -mt-12">
            <div className="h-screen w-full absolute flex items-center justify-center bg-modal">
              <div className="bg-white rounded shadow p-6 m-4 max-w-xs max-h-full text-center">
                <div className="mb-4"></div>
                <div className="mb-8">
                  <p>
                    Are you sure want to remove this room?
                  </p>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={removeRoom}
                    className="text-white w-32 rounded mx-4 bg-yellow-500 hover:bg-yellow-600"
                  >
                    Remove
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
        {isShowEmpty ? (

          <div className="rounded-md flex items-center bg-white jusitfy-between px-5 py-4 mb-2 text-blue-500">
            <div className="w-full flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className=" w-6 h-6 mr-2" viewBox="0 0 1792 1792">
                <path d="M1024 1375v-190q0-14-9.5-23.5t-22.5-9.5h-192q-13 0-22.5 9.5t-9.5 23.5v190q0 14 9.5 23.5t22.5 9.5h192q13 0 22.5-9.5t9.5-23.5zm-2-374l18-459q0-12-10-19-13-11-24-11h-220q-11 0-24 11-10 7-10 21l17 457q0 10 10 16.5t24 6.5h185q14 0 23.5-6.5t10.5-16.5zm-14-934l768 1408q35 63-2 126-17 29-46.5 46t-63.5 17h-1536q-34 0-63.5-17t-46.5-46q-37-63-2-126l768-1408q17-31 47-49t65-18 65 18 47 49z">
                </path>
              </svg>
              Empty
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
      </LibraryLayout>
    </div>
  );
};

export default rooms;
