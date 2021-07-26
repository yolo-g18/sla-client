import RoomLayout from "../../../components/layout/RoomLayout";
import Link from "next/link";
import FaceOutlinedIcon from "@material-ui/icons/FaceOutlined";
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "../../../utils/TypeScript";
import { getAPI, deleteAPI } from "../../../utils/FetchData";
import { IMember , INewRoom} from "../../../utils/TypeScript";
import React from "react";
import { ALERT } from "../../../redux/types/alertType";
import { PARAMS } from "../../../common/params";
import { useRouter } from "next/router";
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
  folderNumbers: 0
}

const defaulMembers: IMember[] = [];
const members = () => {
  const { auth, alert, user } = useSelector((state: RootStore) => state);

  const router = useRouter();

  const {
    query: { id },
  } = router;

  const dispatch = useDispatch();

  const [members, setMembers]: [IMember[], (members: IMember[]) => void] =
  React.useState(defaulMembers);
  
  const [room, setRoom] = React.useState<INewRoom>(defaultRoom);

  const [isShowRemoveMemberModal, setIsShowRemoveMemberModal] = React.useState(false);
  const [idRemoveMember, setIdRemoveMember] = React.useState<number>(0);

  const [isToastOpen, setIsToastOpen] = React.useState(false);
  const [typeToast, setTypeToast] = React.useState("success");
  const [messageToast, setMessageToast] = React.useState("");
 
  React.useEffect(() => {

    // list all member of room
    async function excute() {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await getAPI(
          `${PARAMS.ENDPOINT}room/listMembersOfRoom/${id}`
        );
        setMembers(res.data);
      
        dispatch({ type: ALERT, payload: { loading: false } });
        

      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
      }
    }
    excute();
  }, [id, alert.success]);

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

  async function removeMember() {
    dispatch({ type: ALERT, payload: { loading: true } });
    try {
      const res = await deleteAPI(
        `${PARAMS.ENDPOINT}room/deleteMemberFromRoom/${id}/${idRemoveMember}`
      );


      dispatch({ type: ALERT, payload: { loading: false ,success:"ss"} });
      
      setMessageToast("member deleted");
      setTypeToast("success");
      setIsToastOpen(true);
  
   

    } catch (err) {
      dispatch({ type: ALERT, payload: { loading: false } });

 
    }

    setIsShowRemoveMemberModal(!isShowRemoveMemberModal);
  }

  const handleRemoveMember = (member_id: number) => {
    setIsShowRemoveMemberModal(!isShowRemoveMemberModal);
    setIdRemoveMember(member_id);
  };

  const closeRemoveMemberModal = () => {
    setIsShowRemoveMemberModal(!isShowRemoveMemberModal);
  };

   //handel close toast
   const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setIsToastOpen(false);
  };
  return (
    <RoomLayout>
      {members.length === 0 ? (
        <div></div>
      ) : (
        <div>
          <div className="mt-8 mb-6">
            <p className="text-lg font-bold text-gray-500">
              {members.length} Members
            </p>
            <hr />
          </div>
          {members.map((item, index) => {
            return (
              <div>
                <div
                  className=" bg-white dark:bg-gray-800 mt-6 border-b-2  
             hover:border-gray-300 hover:shadow-lg rounded-lg shadow-md flex justify-between"
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
                          {room.ownerName === item.userName
                            ? "host"
                            : "member"}
                          <div className="font-medium hover:underline flex">
                            <p>{item.userName}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                  {room.ownerName === auth.userResponse?.username ? (
                    <div className="my-auto px-4">
                      <button
                        onClick={() => handleRemoveMember(item.member_id)}
                        className={`tooltip text-right flex justify-end focus:outline-none 
                        `}
                        disabled={item.userName === auth.userResponse?.username} //check host
                      >
                        <HighlightOffOutlinedIcon
                          className={`
                        ${
                          item.userName === auth.userResponse?.username
                            ? "text-gray-300"
                            : "hover:text-yellow-500 text-gray-700"
                        }`}
                        />
                        {item.userName === auth.userResponse?.username ? (
                          <span className="tooltiptext w-44">
                            cannot remove host
                          </span>
                        ) : (
                          <span className="tooltiptext w-44">
                            remove this member
                          </span>
                        )}
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
        {isShowRemoveMemberModal ? (
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 backdrop-filter backdrop-brightness-50 -mt-12">
            <div className=" w-full absolute flex items-center justify-center bg-modal">
              <div className="bg-white rounded shadow p-6 m-4 max-w-xs max-h-full text-center">
                <div className="mb-8">
                  <p className="text-xl font-semibold">
                    Are you sure want to delete this member?
                  </p>
                  <small>
                    This member will be kicked out of room
                  </small>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={removeMember}
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
                    onClick={closeRemoveMemberModal}
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
    </RoomLayout>
  );
};

export default members;
