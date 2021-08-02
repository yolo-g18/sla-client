import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { PARAMS } from "../common/params";
import AppLayout from "../components/layout/AppLayout";
import { ALERT } from "../redux/types/alertType";
import { getAPI, deleteAPI, putAPI } from "../utils/FetchData";
import { IHostInvitation } from "../utils/TypeScript";
import { RootStore } from "../utils/TypeScript";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

//alert
function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const invitation = () => {

  const { auth, alert, user } = useSelector((state: RootStore) => state);
  const dispatch = useDispatch();

  const [invitationList, setInvitationList] = React.useState<IHostInvitation[]>([]);

  const [isToastOpen, setIsToastOpen] = React.useState(false);
  const [typeToast, setTypeToast] = React.useState("success");
  const [messageToast, setMessageToast] = React.useState("");

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
        const res = await getAPI(`${PARAMS.ENDPOINT}room/getRoomInvitationList`);
        setInvitationList(res.data);

        dispatch({ type: ALERT, payload: { loading: false } });


      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });

      }
    }

    excute();
  }, [alert.success]);

  async function acceptInvitation(room_id: number) {

    const data = {
      "room_id": room_id,
      "member_id": auth.userResponse?._id
    }

    dispatch({ type: ALERT, payload: { loading: true } });
    try {
      const res = await putAPI(
        `${PARAMS.ENDPOINT}room/addMemberToRoom`, data
      );

      dispatch({ type: ALERT, payload: { loading: false } });

    } catch (err) {
      dispatch({ type: ALERT, payload: { loading: false } });


    }

    deleteRequest(room_id);
    deleteInvitaion(room_id);

    setMessageToast("invitation accepted");
    setTypeToast("success");
    setIsToastOpen(true);

  }

  function handleRejectInvitation(room_id: number) {
    deleteInvitaion(room_id);
    setMessageToast("invitation rejected");
    setTypeToast("success");
    setIsToastOpen(true);

  }
  async function deleteRequest(room_id: number) {

    dispatch({ type: ALERT, payload: { loading: true } });
    try {
      const res = await deleteAPI(
        `${PARAMS.ENDPOINT}room/deleteRoomRequestAttend/${room_id}/${auth.userResponse?._id}`
      );

      dispatch({ type: ALERT, payload: { loading: false } });

    } catch (err) {
      dispatch({ type: ALERT, payload: { loading: false } });


    }
  }

  async function deleteInvitaion(room_id: number) {

    dispatch({ type: ALERT, payload: { loading: true } });
    try {
      const res = await deleteAPI(
        `${PARAMS.ENDPOINT}room/deleteRoomInvitation/${room_id}/${auth.userResponse?._id}`
      );

      dispatch({ type: ALERT, payload: { loading: false, success: "ss" } });

    } catch (err) {
      dispatch({ type: ALERT, payload: { loading: false } });


    }
  }
  return (
    <AppLayout title="INVITATION" desc="INVITATION">
      {
        user.username === auth.userResponse?.username ? (
          invitationList.length > 0 ? (
          invitationList.length === 1 ? (
            <p className="text-lg font-bold text-gray-700 m-16">You received {invitationList.length} invitation</p>)
            : (
              <p className="text-lg font-bold text-gray-700 m-16">You received {invitationList.length} invitations</p>
            )
        ) :
          (
            <p className="text-lg font-bold text-gray-700 m-16">You have no invitation</p>)
        ) : null
      }

      {invitationList.map((item, index) => {
        return (
          <div key={index} className="md:w-1/5 sm:w-full rounded-lg shadow-lg bg-white my-3">
            <div className="flex justify-between border-b border-gray-300 px-10 py-4">
              <div>
                <i className="fa fa-exclamation-triangle text-orange-500"></i>
                <span className="font-bold text-gray-700 text-lg">{item.userNameHost}</span>
              </div>
              <div>
                <button><i className="fa fa-times-circle text-red-500 hover:text-red-600 transition duration-150"></i></button>
              </div>
            </div>

            <div className="px-10 py-5 text-gray-600">
              <p>Invite you to his room "{item.roomName}"</p>
              <br></br>
              <p className="text-xs italic">{item.timeInvited}</p>
            </div>

            <div className="px-5 py-4 flex justify-end">
              <button onClick={() => acceptInvitation(item.roomId)} className="bg-green-500 text-white w-28 py-1  mx-4 rounded-md text-sm font-medium hover:bg-green-600">Accept</button>
              <button onClick={() => handleRejectInvitation(item.roomId)} className="bg-gray-100 border-2 text-gray-700 w-28 py-1 mx-4 rounded-md text-sm font-medium hover:bg-gray-300">Reject</button>
            </div>
          </div>
        )
      })}
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
  )
}
export default invitation;