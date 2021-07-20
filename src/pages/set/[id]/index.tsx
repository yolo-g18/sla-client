import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppLayout from "../../../components/layout/AppLayout";
import { deleteAPI, getAPI, putAPI } from "../../../utils/FetchData";
import { ICard, RootStore } from "../../../utils/TypeScript";
import { PARAMS } from "../../../common/params";
import { ALERT } from "../../../redux/types/alertType";
import _, { divide } from "lodash";
import dynamic from "next/dynamic";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

//alert
function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

let useClickOutside = (handler: any) => {
  let domNode: any = useRef();

  useEffect(() => {
    let maybeHandler = (event: any) => {
      if (!domNode.current.contains(event.target)) {
        handler();
      }
    };

    document.addEventListener("mousedown", maybeHandler);

    return () => {
      document.removeEventListener("mousedown", maybeHandler);
    };
  });

  return domNode;
};

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
    ["clean"],
  ],
  clipboard: {
    matchVisual: false,
  },
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
];

const index = () => {
  const { auth, alert } = useSelector((state: RootStore) => state);
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [tags, setTags] = useState();
  const [cards, setCards] = useState<ICard[]>([]);
  const [username, setUsername] = useState("");
  const [numberOfCard, setNumberOfCard] = useState();
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [typeToast, setTypeToast] = useState("success");
  const [messageToast, setMessageToast] = useState("");
  const [creatorId, setCreatorId] = useState();
  const [isSuc, setIsSuc] = useState(false);

  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  //handel close toast
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setIsToastOpen(false);
  };

  //lay ra id tu path
  const {
    query: { id }, //id of folder get from path
  } = router;

  //get data of set by id
  useEffect(() => {
    setIsSuc(false);
    const fetchData = async () => {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const studySetRes = await getAPI(
          `${PARAMS.ENDPOINT}studySet/view?id=${id}`
        );
        if (studySetRes.data) {
          const cardRes = await getAPI(`${PARAMS.ENDPOINT}card/list?id=${id}`);
          dispatch({ type: ALERT, payload: { loading: false } });
          console.log("study set data is: " + JSON.stringify(studySetRes.data));
          console.log("card data is: " + JSON.stringify(cardRes.data));
          setTitle(studySetRes.data.title);
          setDesc(studySetRes.data.description);
          setIsPublic(studySetRes.data.public);
          setTags(studySetRes.data.tag);
          setUsername(studySetRes.data.creatorName);
          setCards(cardRes.data);
          setNumberOfCard(studySetRes.data.numberOfCard);
          setCreatorId(studySetRes.data.userId);
        } else dispatch({ type: ALERT, payload: { loading: false } });
      } catch (err) {
        console.log("error is: " + err);
      }
    };
    fetchData();
  }, [id, isSuc]);

  // console.log("card value: " + cards[0].front);

  //handel click open menu
  const handelExpandMoreBtnClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  let domNode = useClickOutside(() => {
    setIsMenuOpen(false);
  });

  // useEffect(() => {
  //   setCurrentCard();
  // });

  const handelEditOnclick = (index: number) => {
    setCurrentCard(index);
    setFront(cards[index].front);
    setBack(cards[index].back);
    setIsModalEditOpen(true);
    console.log(currentCard);
  };

  const handleCardSave = async () => {
    const cardDataUpdate = [
      {
        id: cards[currentCard].id,
        studySet: id,
        front: front,
        back: back,
      },
    ];
    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      const res = await putAPI(`${PARAMS.ENDPOINT}card/edit`, cardDataUpdate);
      dispatch({
        type: ALERT,
        payload: { loading: false, success: "😎 Your card updated!" },
      });
      setIsSuc(true);
      setTypeToast("success");
      setMessageToast("😎 Your card updated!");
      setIsToastOpen(true);
      setIsModalEditOpen(false);
    } catch (err) {
      dispatch({
        type: ALERT,
        payload: {
          loading: false,
          errors: { message: "An error occurred" },
        },
      });
      setMessageToast("An error occurred");
      setTypeToast("error");
      setIsToastOpen(true);
    }
  };

  //handel delete set
  const displayModalDelete = () => {
    setShowModalDelete(true);
  };

  const handelDeleteStudySet = async () => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      const res = await deleteAPI(`${PARAMS.ENDPOINT}studySet/delete?id=${id}`);
      dispatch({
        type: ALERT,
        payload: { loading: false, success: "Deleted!" },
      });

      setShowModalDelete(false);
      // setTypeToast("success");
      // setIsToastOpen(true);
      setMessageToast("Deleted!");
      router.push({
        pathname: "/[username]/library/sets",
        query: { username: auth.userResponse?.username },
      });
    } catch (err) {
      setTypeToast("error");

      dispatch({
        type: ALERT,
        payload: {
          loading: false,
          errors: { message: "An error occurred" },
        },
      });
      setMessageToast("An error occurred");
      setIsToastOpen(true);
    }
  };

  console.log("tags is: " + tags);
  return (
    <div>
      <AppLayout title={title} desc={desc}>
        {/* Day la trang view set, va day la id cua set: {id} */}
        <div className="grid lg:grid-cols-5 grid-cols-1 gap-8 h-screen lg:w-4/5 mx-auto mt-6">
          <div className="col-span-1 px-2">
            <div className="w-full flex items-center px-2">
              <div>
                <svg
                  width="40"
                  height="40"
                  fill="currentColor"
                  className="text-gray-800"
                  viewBox="0 0 1792 1792"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M1523 1339q-22-155-87.5-257.5t-184.5-118.5q-67 74-159.5 115.5t-195.5 41.5-195.5-41.5-159.5-115.5q-119 16-184.5 118.5t-87.5 257.5q106 150 271 237.5t356 87.5 356-87.5 271-237.5zm-243-699q0-159-112.5-271.5t-271.5-112.5-271.5 112.5-112.5 271.5 112.5 271.5 271.5 112.5 271.5-112.5 112.5-271.5zm512 256q0 182-71 347.5t-190.5 286-285.5 191.5-349 71q-182 0-348-71t-286-191-191-286-71-348 71-348 191-286 286-191 348-71 348 71 286 191 191 286 71 348z" />
                </svg>
              </div>
              <div className="px-3 mr-auto">
                <small className="text-sm">create by </small>
                <h4 className="font-bold text-md">{username}</h4>
              </div>
            </div>
            <p>
              <span className=" text-xl font-bold">{title}</span>
              <br />
              <br />
              <hr />
              <br />
              <span className="text-sm text-gray-700">about</span>
              <br />
              <span>{desc}</span>
              <br />
            </p>
            <br />
            <br />
            <hr />
            <br />
            <span className="text-sm text-gray-700">tags</span>
            <div className="flex flex-wrap">
              {_.split(tags, ",").map((tag, index) => {
                return (
                  <div className="my-1 mr-2 flex ">
                    <span className="px-4 py-1 rounded-xl text-gray-800 truncate  bg-gray-200   ">
                      {tag}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="col-span-4">
            <div className=" flex justify-between">
              <div className="fex flex-col">
                <Link
                  href={{
                    pathname: "/[username]/library/sets",
                    query: { username: auth.userResponse?.username },
                  }}
                >
                  <button
                    className="w-40 h-8 text-md flex items-center justify-center rounded-md px-4 
                   text-sm font-medium py-1 bg-white hover:text-gray-900 border-gray-300 border-2
                text-gray-600 hover:bg-green-dark focus:outline-none"
                  >
                    back to library
                  </button>
                </Link>
              </div>
              {/* toolbar */}
              <div className="flex h-8">
                {creatorId === auth.userResponse?._id ? (
                  <div className="flex">
                    <Link href={`/set/${id}/learn`}>
                      <button
                        className="w-24 text-md rounded-md px-4 mx-2
                   text-sm font-medium bg-green-500 hover:bg-green-600 
                text-white focus:outline-none"
                      >
                        learn
                      </button>
                    </Link>

                    <button className="mx-2 tooltip focus:outline-none">
                      <AddIcon
                        fontSize="small"
                        className="hover:text-gray-4 text-gray-700"
                      />
                      <span className="tooltiptext -mt-2 w-40">
                        add card to sets
                      </span>
                    </button>
                    <Link
                      href={{
                        pathname: "/set/[id]/edit",
                        query: { id: id },
                      }}
                    >
                      <button className="mx-2 tooltip focus:outline-none">
                        <EditIcon
                          fontSize="small"
                          className="hover:text-gray-4 text-gray-700"
                        />
                        <span className="tooltiptext -mt-2 w-16">edit</span>
                      </button>
                    </Link>
                  </div>
                ) : null}
                <button className="mx-2 tooltip focus:outline-none">
                  <ShareIcon
                    fontSize="small"
                    className="hover:text-gray-4 text-gray-700"
                  />
                  <span className="tooltiptext -mt-2 w-16">share</span>
                </button>
                <div className="flex mx-2" ref={domNode}>
                  <button
                    onClick={handelExpandMoreBtnClick}
                    className="px-1 focus:outline-none"
                  >
                    <ExpandMoreIcon />
                  </button>
                  {isMenuOpen ? (
                    <div className="origin-top-right absolute z-50 mt-8 w-40 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                      <div
                        className={`py-1`}
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                      >
                        <div>
                          <a
                            className="block px-4 py-1 font-medium text-sm text-gray-700 hover:bg-blue-500 
                            hover:text-white dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600 cursor-pointer"
                            role="menuitem"
                          >
                            <span className="flex flex-col">
                              <span>fork</span>
                            </span>
                          </a>
                          <a
                            className="block px-4 py-1 font-medium text-sm text-gray-700 hover:bg-blue-500
                             hover:text-white dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600 cursor-pointer"
                            role="menuitem"
                            onClick={() => setShowModalDelete(true)}
                          >
                            <span className="flex flex-col">
                              <span>delete</span>
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="h-full mt-4">
              <h1 className="text-md mt-4 mb-2">{numberOfCard} cards</h1>
              <hr />
              <div className=" w-full">
                {cards.map((card, index) => {
                  return (
                    <div
                      key={index}
                      className=" rounded-xl grid grid-cols-11 gap-4 my-4"
                    >
                      <div className="col-span-5  rounded-xl bg-white shadow-sm">
                        <QuillNoSSRWrapper
                          readOnly={true}
                          theme="bubble"
                          value={card.front}
                          className="w-64"
                        />
                      </div>
                      <div className="col-span-5 rounded-xl bg-white shadow-sm ">
                        <QuillNoSSRWrapper
                          readOnly={true}
                          theme="bubble"
                          value={card.back}
                          className="w-64"
                        />
                      </div>
                      <div className="col-span-1">
                        <button
                          onClick={(event) => handelEditOnclick(index)}
                          className="mx-2 tooltip focus:outline-none"
                        >
                          <EditIcon
                            fontSize="small"
                            className="hover:text-gray-400 text-gray-700"
                          />
                          <span className="tooltiptext -mt-2 w-16">edit</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        {isModalEditOpen ? (
          <div className="justify-center items-center flex flex-row overflow-x-hidden overflow-y-auto fixed inset-0 z-50 backdrop-filter backdrop-blur-xs -mt-12 ">
            <div className="lg:h-1/2 py-6 rounded-xl px-4 bg-white">
              <div className=" grid lg:grid-cols-2 grid-cols-1 gap-4">
                <div className="col-span-1 flex lg:my-2 my-4">
                  <QuillNoSSRWrapper
                    modules={modules}
                    formats={formats}
                    theme="snow"
                    className="h-80 relative mb-12 "
                    onChange={setFront}
                    value={front}
                  />
                </div>
                <div className="col-span-1 flex  lg:my-2 my-4">
                  <QuillNoSSRWrapper
                    modules={modules}
                    formats={formats}
                    theme="snow"
                    className="h-80 relative mb-12"
                    onChange={setBack}
                    value={back}
                  />
                </div>
              </div>
              <div className="flex justify-end px-4">
                <button
                  className="bg-gray-100 border-2 text-gray-700 w-28 py-1 mr-1 rounded-md text-sm font-medium hover:bg-gray-300"
                  type="button"
                  onClick={() => setIsModalEditOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className=" bg-green-500 text-white w-28 py-1 ml-1 rounded-md text-sm font-medium hover:bg-green-600"
                  type="button"
                  onClick={handleCardSave}
                >
                  {alert.loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        ) : null}
        {showModalDelete ? (
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 backdrop-filter backdrop-blur-xs -mt-12">
            <div className="h-screen w-full absolute flex items-center justify-center bg-modal">
              <div className="bg-white rounded shadow p-6 m-4 max-w-xs max-h-full text-center">
                <div className="mb-4"></div>
                <div className="mb-8">
                  <p>Are you sure want to delete this study set</p>
                  <p className="text-gray-600 text-xs px-1 mb-2">
                    When you delete this study set, all information about your
                    learning process and others about this study set will no
                    longer exist.
                  </p>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={handelDeleteStudySet}
                    className="text-white w-32 rounded mx-4 bg-yellow-500 hover:bg-yellow-600"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setShowModalDelete(false)}
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
      </AppLayout>
    </div>
  );
};

export default index;
