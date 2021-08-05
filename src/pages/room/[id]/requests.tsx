import RoomLayout from "../../../components/layout/RoomLayout";
import Link from "next/link";
import FaceOutlinedIcon from "@material-ui/icons/FaceOutlined";
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "../../../utils/TypeScript";
import AddBoxRoundedIcon from "@material-ui/icons/AddBoxRounded";
import React from "react";
import { INewRoom, IGuestRoom } from "../../../utils/TypeScript";
import { useRouter } from "next/router";
import { ALERT } from "../../../redux/types/alertType";
import { PARAMS } from "../../../common/params";
import { getAPI, deleteAPI, putAPI, postAPI } from "../../../utils/FetchData";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

//alert
function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const defaultRoom = {
  room_id: 0,
  name: "",
  description: "",
  createdDate: "",
  ownerName: "",
  setNumbers: 0,
  folderNumbers: 0,
};

const defaulGuests: IGuestRoom[] = [];

const requests = () => {
  const { auth, alert, user } = useSelector((state: RootStore) => state);
  const dispatch = useDispatch();

  const router = useRouter();

  const {
    query: { id },
  } = router;

  const [room, setRoom] = React.useState<INewRoom>(defaultRoom);

  const [guestRooms, setGuestRooms]: [
    IGuestRoom[],
    (guestRooms: IGuestRoom[]) => void
  ] = React.useState(defaulGuests);

  const [isToastOpen, setIsToastOpen] = React.useState(false);
  const [typeToast, setTypeToast] = React.useState("success");
  const [messageToast, setMessageToast] = React.useState("");

  const [isMember, setIsMember] = React.useState(false);
  //handel close toast
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setIsToastOpen(false);
  };
  React.useEffect(() => {
    // load detail data of room

    async function excute() {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await getAPI(`${PARAMS.ENDPOINT}room/getRoom/${id}`);
        setRoom(res.data);

        dispatch({ type: ALERT, payload: { loading: false } });
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
      }
    }

    excute();
  }, [id, alert.success]);

  React.useEffect(() => {
    // list all member of room
    async function excute() {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await getAPI(
          `${PARAMS.ENDPOINT}room/listRoomRequestAttend/${id}`
        );
        setGuestRooms(res.data);

        dispatch({ type: ALERT, payload: { loading: false } });
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
      }
    }
    excute();
  }, [id, alert.success]);

  async function acceptRequest(user_id: number) {
    const data = {
      room_id: id,
      member_id: user_id,
    };

    dispatch({ type: ALERT, payload: { loading: true } });
    try {
      const res = await putAPI(`${PARAMS.ENDPOINT}room/addMemberToRoom`, data);

      dispatch({ type: ALERT, payload: { loading: false } });
    } catch (err) {
      dispatch({ type: ALERT, payload: { loading: false } });
    }
    deleteInvitaion(user_id);
    deleteRequest(user_id);
    notifyAcceptAttendRoom(user_id);
    setMessageToast("request accepted");
    setTypeToast("success");
    setIsToastOpen(true);
  }

  function handleRejectRequest(user_id: number) {
    deleteRequest(user_id);
    setMessageToast("request rejected");
    setTypeToast("success");
    setIsToastOpen(true);
  }
  async function deleteRequest(user_id: number) {
    dispatch({ type: ALERT, payload: { loading: true } });
    try {
      const res = await deleteAPI(
        `${PARAMS.ENDPOINT}room/deleteRoomRequestAttend/${id}/${user_id}`
      );

      dispatch({ type: ALERT, payload: { loading: false, success: "ss" } });
    } catch (err) {
      dispatch({ type: ALERT, payload: { loading: false } });
    }
  }

  async function deleteInvitaion(user_id: number) {
    dispatch({ type: ALERT, payload: { loading: true } });
    try {
      const res = await deleteAPI(
        `${PARAMS.ENDPOINT}room/deleteRoomInvitation/${id}/${user_id}`
      );

      dispatch({ type: ALERT, payload: { loading: false } });
    } catch (err) {
      dispatch({ type: ALERT, payload: { loading: false } });
    }
  }

  async function notifyAcceptAttendRoom(userId: number) {
    const data = {
      creator_id: userId,
      title: "Room Attend Acceptance",
      description:
        auth.userResponse?.username + " allows you join " + room.name,
      type: "acceptance",
      link: "/room/" + room.room_id + "/library",
      isRead: false,
      timeTrigger: null,
    };

    dispatch({ type: ALERT, payload: { loading: true } });
    try {
      const res = await postAPI(`${PARAMS.ENDPOINT}notify/create`, data);

      dispatch({ type: ALERT, payload: { loading: false } });
    } catch (err) {
      dispatch({ type: ALERT, payload: { loading: false } });
    }
  }

  React.useEffect(() => {
    // check member permisson
    async function excute() {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await getAPI(`${PARAMS.ENDPOINT}room/isMemberOfRoom/${id}`);
        setIsMember(res.data);
        dispatch({ type: ALERT, payload: { loading: false } });
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
        
      }
    }
    excute();
  }, [alert.success, id]);
  
  return (
    <RoomLayout>
      
      
      {isMember === true && room.ownerName !== auth.userResponse?.username ? 
      (<p className="text-lg text-center text-yellow-600 m-16">You have no permission to see this content</p>):null}
      
      {guestRooms.length === 0 ? (
        room.ownerName === auth.userResponse?.username ? (
          <div>

            {guestRooms.length === 0 ? (
             <p className="text-lg text-center text-gray-400 m-16">You have no request</p>
            ) :
            null}


          </div>
        ) : null

      ) : room.ownerName === auth.userResponse?.username ? (
        <div>
          <div className="mt-8 mb-6">
            <p className="text-lg text-gray-500">
              Some users command attend your room
            </p>
            <hr />
          </div>
          {guestRooms.map((item, index) => {
            return (
              <div>
                <div
                  className=" bg-white dark:bg-gray-800 mt-6 border-b-2  
         hover:border-gray-300 hover:shadow-lg rounded-md shadow-md flex justify-between"
                  key={index}
                >
                  <div className="w-full">
                    <Link
                      href={{
                        pathname: "/[username]/library/sets",
                        query: { username: item.userName },
                      }}
                    >
                      <div className="cursor-pointer flex flex-1 items-center p-4">
                        <FaceOutlinedIcon style={{ fontSize: 65 }} />
                        <div className="flex-1 pl-1 mr-16">
                          <p className="text-sm text-gray-400">user</p>
                          <div className="text-lg font-bold hover:underline flex">
                            <p>{item.userName}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>

                  <div className="my-auto px-2">
                    <button
                      onClick={() => acceptRequest(item.user_id)}
                      className="tooltip text-right flex justify-end focus:outline-none"
                    >
                      <AddBoxRoundedIcon
                        style={{ fontSize: 28 }}
                        className="hover:text-blue-600 text-blue-500"
                      />
                      <span className="tooltiptext w-16">accept</span>
                    </button>
                  </div>
                  <div className="my-auto px-2">
                    <button
                      onClick={() => handleRejectRequest(item.user_id)}
                      className="tooltip text-right flex justify-end focus:outline-none"
                    >
                      <HighlightOffOutlinedIcon
                        style={{ fontSize: 28 }}
                        className="hover:text-yellow-500 text-gray-700"
                      />
                      <span className="tooltiptext w-16">reject</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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
    </RoomLayout>
  );
};

export default requests;
