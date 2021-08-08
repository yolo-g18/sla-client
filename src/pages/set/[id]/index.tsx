import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppLayout from "../../../components/layout/AppLayout";
import { deleteAPI, getAPI, postAPI, putAPI } from "../../../utils/FetchData";
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
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import InputArea from "../../../components/input/InputArea";

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
  loading: () => <p>...</p>,
});

const modules = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    ["link", "image"],
  ],
  clipboard: {
    matchVisual: false,
  },
};

const formats = [
  "bold",
  "italic",
  "color",
  "background",
  "underline",
  "link",
  "image",
];

const index = () => {
  const { auth, alert } = useSelector((state: RootStore) => state);
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [tags, setTags] = useState();
  const [cards, setCards] = useState<ICard[]>([]);
  const [creatorName, setCreatorName] = useState("");
  const [numberOfCard, setNumberOfCard] = useState();
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [showDeleteCardModal, setShowDeleteCardModal] = useState(false);
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
      if (!id) {
        return;
      }
      if (alert.success === "😎 Update successful!") {
        setTypeToast("success");
        setMessageToast(alert.success.toString());
        setIsToastOpen(true);
      }
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const studySetRes = await getAPI(
          `${PARAMS.ENDPOINT}studySet/view?id=${id}`
        );
        if (studySetRes.data) {
          const cardRes = await getAPI(`${PARAMS.ENDPOINT}card/list?id=${id}`);
          dispatch({ type: ALERT, payload: { loading: false } });
          setTitle(studySetRes.data.title);
          setDesc(studySetRes.data.description);
          setIsPublic(studySetRes.data.public);
          setTags(studySetRes.data.tag);
          setCreatorName(studySetRes.data.creatorName);
          setCards(cardRes.data);
          setNumberOfCard(studySetRes.data.numberOfCard);
        } else dispatch({ type: ALERT, payload: { loading: false } });
      } catch (err) {
        console.log(err.response.data);
        router.push("/error");
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

  const handelEditOnclick = (index: number) => {
    setCurrentCard(index);
    setFront(cards[index].front);
    setBack(cards[index].back);
    setIsModalEditOpen(true);
    console.log(currentCard);
  };
  const handelAddOnclick = () => {
    setFront("");
    setBack("");
    setIsModalAddOpen(true);
  };

  const closeModaAddAndEdit = () => {
    setIsModalAddOpen(false);
    setIsModalEditOpen(false);
  };

  const handleCardSave = async () => {
    if (isModalAddOpen) {
      const cardDataAdd = [
        {
          studySet: id,
          front: front,
          back: back,
        },
      ];
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await postAPI(`${PARAMS.ENDPOINT}card/create`, cardDataAdd);
        dispatch({
          type: ALERT,
          payload: { loading: false, success: "😎 Add successful!" },
        });
        setIsSuc(true);
        setTypeToast("success");
        setMessageToast("😎 Add successful!");
        setIsToastOpen(true);
        setIsModalAddOpen(false);
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
    } else {
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
    }
  };

  //handel delete card
  const handelDeleteOnclick = (index: number) => {
    setCurrentCard(index);
    setShowDeleteCardModal(true);
  };

  const handelDeleteStudySet = async () => {
    if (!id) {
      return;
    }
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

  const deleteCard = async () => {
    let id = cards[currentCard].id;
    if (!id) {
      return;
    }
    if (cards.length <= 2) {
      setIsToastOpen(true);
      setTypeToast("warning");
      setMessageToast("You need least two cards");
      setShowDeleteCardModal(false);
      return;
    }
    dispatch({ type: ALERT, payload: { loading: true } });
    try {
      const res = await deleteAPI(`${PARAMS.ENDPOINT}card/delete?id=${id}`);
      dispatch({ type: ALERT, payload: { loading: false } });
      setIsSuc(true);
      setMessageToast("Delete card successfully");
      setTypeToast("success");
      setIsToastOpen(true);
    } catch (err) {
      dispatch({ type: ALERT, payload: { loading: false } });
      setMessageToast("An error occurred");
      setTypeToast("error");
      setIsToastOpen(true);
      setIsSuc(false);
    }

    setShowDeleteCardModal(false);
  };

  const shareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setMessageToast("copied link");
    setTypeToast("success");
    setIsToastOpen(true);
  };

  const [showModalReport, setShowModalReport] = useState(false);
  const [reportContent, setReportContent] = useState("");
  const [reportContentErr, setReportContentErr] = useState("");
  const [isReported, setisReported] = useState(false);

  //check user report??
  useEffect(() => {
    console.log("dasbdhabs");

    const fetchData = async () => {
      if (!id) {
        return;
      }
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await getAPI(
          `${PARAMS.ENDPOINT}studySet/checkReprotExistence/${id}`
        );
        dispatch({ type: ALERT, payload: { loading: false } });

        setisReported(res.data);
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
        console.log("err: " + err);
      }
    };
    fetchData();
  }, [id]);
  console.log(isReported);

  //remove err when user typing
  useEffect(() => {
    setReportContentErr("");
  }, [reportContent]);

  const sendReportHandle = async () => {
    if (!id) {
      return;
    }
    if (reportContent.length === 0) {
      setReportContentErr("Report content required");
      return;
    } else {
      setReportContentErr("");
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await postAPI(`${PARAMS.ENDPOINT}studySet/report/${id}`, {
          content: reportContent,
        });
        dispatch({ type: ALERT, payload: { loading: false } });
        setMessageToast("Thanks for your report 🙏");
        setTypeToast("success");
        setIsToastOpen(true);
        setShowModalReport(false);
        setReportContent("  ");
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
        console.log(err);
        setMessageToast("An error occurred");
        setTypeToast("error");
        setIsToastOpen(true);
      }
    }
  };

  return (
    <div>
      <AppLayout title={title} desc={desc}>
        {/* Day la trang view set, va day la id cua set: {id} */}
        <div className="grid lg:grid-cols-5 grid-cols-1 gap-8 h-full lg:w-4/5 mx-auto mt-6">
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
                <a href={`/${creatorName}/library/sets`}>
                  <h4 className="font-bold text-md hover:underline">
                    {creatorName}
                  </h4>
                </a>
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

            {tags ? (
              <div>
                <hr />
                <br />
                <span className="text-sm text-gray-700">tags</span>
                <div className="flex flex-wrap">
                  {_.split(tags, ",").map((tag, index) => {
                    return (
                      <div key={index}>
                        <Link href={`/search/set/tag?search_query=${tag}`}>
                          <div className="my-1 mr-2 flex ">
                            <span className="px-4 py-1 rounded-md truncate bg-gray-200 text-blue-500 hover:underline cursor-pointer text-sm font-bold ">
                              {tag}
                            </span>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
          <div className="col-span-4 mb-44">
            <div className=" flex justify-between">
              <div className="fex flex-col">
                <Link
                  href={{
                    pathname: "/[username]/library/sets",
                    query: { username: auth.userResponse?.username },
                  }}
                >
                  <p className="hover:underline cursor-pointer">
                    back to library
                  </p>
                </Link>
              </div>
              {/* toolbar */}
              <div className="flex h-8">
                <Link href={`/set/${id}/learn`}>
                  <button
                    className="w-24 text-md rounded-sm px-4 mx-2
                   text-sm font-medium bg-blue-500 hover:bg-blue-600 
                text-white focus:outline-none"
                  >
                    Learn
                  </button>
                </Link>
                {creatorName === auth.userResponse?.username ? (
                  <div className="flex">
                    <button
                      onClick={handelAddOnclick}
                      className="mx-2 tooltip focus:outline-none"
                    >
                      <AddIcon
                        fontSize="default"
                        className="hover:text-gray-400 text-gray-700"
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
                          className="hover:text-gray-400 text-gray-700"
                        />
                        <span className="tooltiptext -mt-2 w-16">edit</span>
                      </button>
                    </Link>
                  </div>
                ) : null}
                <button
                  onClick={shareLink}
                  className="mx-2 tooltip focus:outline-none"
                >
                  <ShareIcon
                    fontSize="small"
                    className="hover:text-gray-400 text-gray-700"
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
                    <div className="origin-top-right absolute z-50 mt-8 w-40 rounded-sm shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
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
                              <span>Fork</span>
                            </span>
                          </a>
                          {auth.userResponse?.username === creatorName ? (
                            <a
                              className="block px-4 py-1 font-medium text-sm text-gray-700 hover:text-white hover:bg-yellow-500
                               dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600 cursor-pointer"
                              role="menuitem"
                              onClick={() => setShowModalDelete(true)}
                            >
                              <span className="flex flex-col ">
                                <span>Delete</span>
                              </span>
                            </a>
                          ) : (
                            <a
                              className="block px-4 py-1 font-medium text-sm text-gray-700 hover:bg-blue-500 
                          hover:text-white dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600 cursor-pointer"
                              role="menuitem"
                              onClick={() => setShowModalReport(true)}
                            >
                              <span className="flex flex-col">
                                <span>Report</span>
                              </span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="h-full mt-4 44">
              <h1 className="text-md mt-4 mb-2">{numberOfCard} cards</h1>
              <hr />
              <div className=" w-full">
                {cards.map((card, index) => {
                  return (
                    <div
                      key={index}
                      className=" rounded-md grid grid-cols-11 gap-4 my-4"
                    >
                      <div className="col-span-5 rounded-md bg-white shadow-lg border-b-1">
                        <QuillNoSSRWrapper
                          readOnly={true}
                          theme="bubble"
                          value={card.front}
                          className="w-64"
                        />
                      </div>
                      <div className="col-span-5 rounded-md bg-white shadow-lg border-b-1">
                        <QuillNoSSRWrapper
                          readOnly={true}
                          theme="bubble"
                          value={card.back}
                          className="w-64"
                        />
                      </div>
                      {auth.userResponse?.username === creatorName ? (
                        <div className="col-span-1">
                          <button
                            onClick={(event) => handelEditOnclick(index)}
                            className="mx-2 tooltip focus:outline-none"
                          >
                            <EditIcon
                              fontSize="small"
                              className="hover:text-gray-400 text-gray-700"
                            />
                            <span className="tooltiptext mt-2 w-16">edit</span>
                          </button>

                          <button
                            onClick={(event) => handelDeleteOnclick(index)}
                            className="mx-2 tooltip focus:outline-none"
                          >
                            <DeleteOutlineIcon
                              fontSize="small"
                              className="hover:text-yellow-400 text-gray-700"
                            />
                            <span className="tooltiptext mt-2 w-20">
                              delete
                            </span>
                          </button>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        {showDeleteCardModal ? (
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 backdrop-filter backdrop-brightness-50 -mt-12">
            <div className=" w-full absolute flex items-center justify-center bg-modal">
              <div className="bg-white rounded shadow p-6 m-4 max-w-xs max-h-full text-center">
                <div className="mb-8">
                  <p className="text-xl font-semibold">
                    Are you sure want to delete this card?
                  </p>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={deleteCard}
                    className="text-white w-32 rounded mx-4 bg-yellow-500 hover:bg-yellow-600 focus:outline-none"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setShowDeleteCardModal(false)}
                    className=" text-white w-32 py-1 mx-4 rounded bg-blue-500 hover:bg-blue-600 focus:outline-none"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {isModalEditOpen || isModalAddOpen ? (
          <div className="justify-center items-center flex flex-row overflow-x-hidden overflow-y-auto fixed inset-0 z-50 backdrop-filter backdrop-brightness-50 -mt-12 ">
            <div className="mx-2 py-2 rounded-md bg-white">
              <div className=" grid lg:grid-cols-2 grid-cols-1 gap-4 px-6 py-2">
                <div className="col-span-1 flex lg:my-2 my-4">
                  <QuillNoSSRWrapper
                    modules={modules}
                    formats={formats}
                    theme="snow"
                    className="h-64 editor relative mb-12 border-white"
                    onChange={setFront}
                    placeholder="front side content"
                    value={front}
                  />
                </div>
                <div className="col-span-1 flex  lg:my-2 my-4 ">
                  <QuillNoSSRWrapper
                    modules={modules}
                    formats={formats}
                    theme="snow"
                    className="h-64 editor relative mb-12"
                    placeholder="back side content"
                    onChange={setBack}
                    value={back}
                  />
                </div>
              </div>
              <div className="flex justify-end px-6 pb-2">
                <button
                  className="bg-gray-100 border-2 text-gray-700 w-28 py-1 mr-1 rounded-sm text-sm font-medium hover:bg-gray-300"
                  type="button"
                  onClick={closeModaAddAndEdit}
                >
                  Cancel
                </button>
                <button
                  className=" bg-blue-500 text-white w-28 py-1 ml-1 rounded-sm text-sm font-medium hover:bg-blue-600"
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
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 backdrop-filter backdrop-brightness-50 -mt-12">
            <div className="h-screen w-full absolute flex items-center justify-center bg-modal">
              <div className="bg-white rounded-md shadow p-6 m-4 max-w-xs max-h-full text-center">
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
                    className=" text-white w-32 py-1 mx-4 rounded bg-blue-500 hover:bg-blue-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {showModalReport ? (
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 backdrop-filter backdrop-brightness-50 -mt-12">
            <div className="h-screen w-full absolute flex items-center justify-center bg-modal px-2">
              <div className="bg-white rounded-md shadow p-6 m-4 max-w-md ">
                <div className="mb-2 text-gray-600 text-md font-semibold">
                  <p>Report {title}</p>
                </div>
                {isReported ? (
                  <div className="font-normal text-gray-600 text-sm mb-12">
                    <h2>We have received a report from you</h2>
                    <p>Thanks for your support 🙏</p>
                  </div>
                ) : (
                  <div className="mb-4 items-center">
                    <InputArea
                      setValue={setReportContent}
                      placeholder="Let us know what you think.."
                      rows={10}
                      value={reportContent}
                      error={reportContentErr}
                    />
                  </div>
                )}
                {isReported ? (
                  <div className="flex justify-center mt-4 -mb-2">
                    <button
                      onClick={() => setShowModalReport(false)}
                      className="bg-gray-100 border-2 text-gray-700 w-28 py-1 rounded-sm text-sm 
                    font-medium hover:bg-gray-300"
                      type="button"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-center mt-4 gap-6">
                    <button
                      onClick={() => setShowModalReport(false)}
                      className="bg-gray-100 border-2 text-gray-700 w-28 py-1 rounded-sm text-sm 
                    font-medium hover:bg-gray-300"
                      type="button"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={sendReportHandle}
                      className=" bg-blue-500 text-white w-28 py-1 ml-1 rounded-sm text-sm font-medium 
                    hover:bg-blue-600"
                      type="button"
                    >
                      Send
                    </button>
                  </div>
                )}
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
            severity={
              typeToast === "success"
                ? "success"
                : typeToast === "error"
                ? "error"
                : "warning"
            }
          >
            {messageToast}
          </Alert>
        </Snackbar>
      </AppLayout>
    </div>
  );
};

export default index;
