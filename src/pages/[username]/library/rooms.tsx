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
