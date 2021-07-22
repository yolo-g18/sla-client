import RoomLayout from "../../../components/layout/RoomLayout";

import Link from "next/link";

import FaceOutlinedIcon from "@material-ui/icons/FaceOutlined";
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "../../../utils/TypeScript";
import AddBoxRoundedIcon from "@material-ui/icons/AddBoxRounded";

const room = {
  id: 1,
  name: "G18",
  desc: "Lớp Đồ Án This example uses a typographic feature called ligatures, which allows rendering of an icon glyph simply by using its textual name.",
  owner_name: "_testuser2",
  request: [
    { username: "Nguyen", avatar: "andas" },
    { username: "_testuser2", avatar: "andas" },
    { username: "Tran", avatar: "andas" },
    { username: "Ling", avatar: "andas" },
  ],
};

const requests = () => {
  const { auth, alert, user } = useSelector((state: RootStore) => state);
  const dispatch = useDispatch();

  return (
    <RoomLayout>
      {room.request.length === 0 ? (
        <div></div>
      ) : (
        <div>
          <div className="mt-8 mb-6">
            <p className="text-lg font-bold text-gray-500">
              {room.request.length} users are waiting for approval
            </p>
            <hr />
          </div>
          {room.request.map((item, index) => {
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
                        query: { username: item.username },
                      }}
                    >
                      <div className="cursor-pointer flex flex-1 items-center p-4">
                        <FaceOutlinedIcon style={{ fontSize: 65 }} />
                        <div className="flex-1 pl-1 mr-16">
                          {room.owner_name === item.username
                            ? "host"
                            : "request"}
                          <div className="font-medium hover:underline flex">
                            <p>{item.username}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>

                  <div className="my-auto px-2">
                    <button
                      // onClick={() => handleRemoveFolder(item.folder_id)}
                      className="tooltip text-right flex justify-end focus:outline-none"
                    >
                      <AddBoxRoundedIcon
                        style={{ fontSize: 28 }}
                        className="hover:text-green-600 text-green-500"
                      />
                      <span className="tooltiptext w-16">reject</span>
                    </button>
                  </div>
                  <div className="my-auto px-2">
                    <button
                      // onClick={() => handleRemoveFolder(item.folder_id)}
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
      )}
    </RoomLayout>
  );
};

export default requests;
