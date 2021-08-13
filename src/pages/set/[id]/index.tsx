import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppLayout from "../../../components/layout/AppLayout";
import { deleteAPI, getAPI, postAPI, putAPI } from "../../../utils/FetchData";
import { ICard, IFeedback, RootStore } from "../../../utils/TypeScript";
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
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { getUserByUsername } from "../../../redux/actions/userAction";
import { FaStar } from "react-icons/fa";

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

const QuillNoSSRWrapper = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");
    return ({ forwardedRef, ...props }: any) => (
      <RQ ref={forwardedRef} {...props} />
    );
  },
  {
    ssr: false,
    loading: () => <p>...</p>,
  }
);

const formats = [
  "bold",
  "italic",
  "color",
  "background",
  "underline",
  "link",
  "image",
];

const stars = Array(5).fill(0);

const colors = {
  orange: "#FFBA5A",
  grey: "#a9a9a9",
};

const qValueArr = ["sosad", "sad", "neutral", "grinning", "smile", "happy"];

const index = () => {
  const { auth, alert, user } = useSelector((state: RootStore) => state);
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

  const [ssColor, setSSColor] = useState("");
  const [listColors, setListColors] = useState<string[]>([]);

  const [showModalColorPicker, setShowModalColorPicker] = useState(false);

  const router = useRouter();

  //settup rick editor
  const editorRefFront = useRef<any>(null);
  const editorRefBack = useRef<any>(null);
  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      if (input.files?.length) {
        const file = input.files[0];

        // file type is only image.
        if (/^image\//.test(file.type)) {
          saveToServer(file);
        } else {
          console.warn("You could only upload images.");
        }
      }
    };
  };
  const imageHandler2 = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      if (input.files?.length) {
        const file = input.files[0];

        // file type is only image.
        if (/^image\//.test(file.type)) {
          saveToServer2(file);
        } else {
          console.warn("You could only upload images.");
        }
      }
    };
  };

  const saveToServer = async (file: any) => {
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await postAPI(`${PARAMS.ENDPOINT}storage/upload`, data);
      insertToEditor(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const saveToServer2 = async (file: any) => {
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await postAPI(`${PARAMS.ENDPOINT}storage/upload`, data);
      insertToEditor2(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const insertToEditor = (url: string) => {
    if (editorRefFront.current) {
      editorRefFront.current.getEditor().insertEmbed(null, "image", url);
    }
  };
  const insertToEditor2 = (url: string) => {
    if (editorRefBack.current) {
      editorRefBack.current.getEditor().insertEmbed(null, "image", url);
    }
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          ["bold", "italic", "underline"],
          [{ color: [] }, { background: [] }],
          ["link", "image"],
        ],

        handlers: {
          image: imageHandler,
        },
      },
    }),
    []
  );

  const modules2 = useMemo(
    () => ({
      toolbar: {
        container: [
          ["bold", "italic", "underline"],
          [{ color: [] }, { background: [] }],
          ["link", "image"],
        ],

        handlers: {
          image: imageHandler2,
        },
      },
    }),
    []
  );

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

  //frag ss learned
  const [isLearned, setIsLearned] = useState(false);
  //get data of set by id
  useEffect(() => {
    setIsSuc(false);
    const fetchData = async () => {
      if (!id) {
        return;
      }
      if (
        alert.success === "😎 Update successful!" ||
        alert.success === "😎 Your study set created!"
      ) {
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
          const cardResLearning = await getAPI(
            `${PARAMS.ENDPOINT}learn/listCardSort?id=${id}`
          );
          if (cardResLearning.data.length) {
            //get color of SS
            try {
              const colorRes = await getAPI(
                `${PARAMS.ENDPOINT}studySet/color?id=${id}`
              );
              setSSColor(colorRes.data);
            } catch (err) {
              console.log(err.response.data);
            }

            //add new card not started to learning
            const insertCardLearning = await getAPI(
              `${PARAMS.ENDPOINT}learn/continue?studySetId=${id}`
            );
            //set lai card learning cho list cardlearing
            const cardResLearning = await getAPI(
              `${PARAMS.ENDPOINT}learn/listCardSort?id=${id}`
            );
            setCards(cardResLearning.data);
            setIsLearned(true);
          } else {
            const cardRes = await getAPI(
              `${PARAMS.ENDPOINT}card/list?id=${id}`
            );

            setCards(cardRes.data);
            setIsLearned(false);
          }
          setTitle(studySetRes.data.title);
          setDesc(studySetRes.data.description);
          setIsPublic(studySetRes.data.public);
          setTags(studySetRes.data.tag);
          setCreatorName(studySetRes.data.creatorName);
          setNumberOfCard(studySetRes.data.numberOfCard);
          dispatch({ type: ALERT, payload: { loading: false } });
        } else dispatch({ type: ALERT, payload: { loading: false } });
      } catch (err) {
        console.log(err.response.data);
        // router.push("/error");
      }
    };
    fetchData();
  }, [id, isSuc]);

  console.log(cards);

  useEffect(() => {
    dispatch(getUserByUsername(`${creatorName}`));
  }, [creatorName]);

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
        console.log("card: " + JSON.stringify(cardDataUpdate));

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
  console.log("da report chua: " + isReported);

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
  const [listFeedback, setListFeedBack] = useState<IFeedback[]>([]);

  const [showModalFeedback, setShowModalFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [feedbackContentErr, setFeedbackContentErr] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [hoverValue, setHoverValue] = useState(undefined);
  const handleMouseOver = (newHoverValue: any) => {
    setHoverValue(newHoverValue);
  };

  const handleMouseLeave = () => {
    setHoverValue(undefined);
  };

  const handleClick = (value: any) => {
    setRating(value);
  };

  //remove err when user typing
  useEffect(() => {
    setFeedbackContentErr("");
  }, [feedbackContentErr]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await getAPI(`${PARAMS.ENDPOINT}feedback/${id}/me`);
        dispatch({ type: ALERT, payload: { loading: false } });

        setRating(res.data.rating);
        setFeedback(res.data.feedback);
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
        console.log(err);
      }
    };

    fetchData();
  }, [id]);

  const showFeedbackHandle = async () => {
    try {
    } catch (err) {}
  };

  useEffect(() => {
    setIsSuccess(false);
    if (!id) return;
    const fetchData = async () => {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await getAPI(`${PARAMS.ENDPOINT}feedback/${id}`);
        const tempList: IFeedback[] = res.data;
        setListFeedBack(tempList.filter((fb) => fb.feedback));
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: true } });
        console.log(err);
      }
    };
    fetchData();
  }, [id, isSuccess]);

  const sendFeedback = async () => {
    if (!id) return;
    if (feedback.length > 250) {
      setFeedbackContentErr("Feedback cannot exceed 250 character.");
      return;
    } else {
      setFeedbackContentErr("");
      dispatch({ type: ALERT, payload: { loading: true } });
      const data = {
        rating: rating,
        feedback: feedback,
        studySetId: id,
      };
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await putAPI(`${PARAMS.ENDPOINT}feedback/edit`, data);
        dispatch({ type: ALERT, payload: { loading: false } });
        setIsSuccess(true);
        setMessageToast("Thanks for your feedback 🙏");
        setTypeToast("success");
        setIsToastOpen(true);
        setShowModalFeedback(false);
      } catch (err) {
        setIsSuccess(false);
        console.log(err);
        dispatch({ type: ALERT, payload: { loading: false } });
        setMessageToast("An error occurred");
        setTypeToast("error");
        setIsToastOpen(true);
      }
      console.log("data: " + JSON.stringify(data));
    }
  };

  //init color list
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await getAPI(`${PARAMS.ENDPOINT}folder/getColorFolder`);
        dispatch({ type: ALERT, payload: { loading: false } });
        setListColors(res.data);
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const setColorhandle = (color: string) => {
    console.log({
      id: id,
      color: color,
    });

    const putColor = async () => {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await putAPI(`${PARAMS.ENDPOINT}studySet/color`, {
          id: id,
          color: color,
        });
        dispatch({ type: ALERT, payload: { loading: false } });
        setIsSuc(true);
      } catch (err) {
        setIsSuc(false);
        console.log(err);
        dispatch({ type: ALERT, payload: { loading: true } });
      }
    };

    putColor();
    setShowModalColorPicker(false);
  };

  return (
    <div>
      <AppLayout title={title} desc={desc}>
        <div className="grid lg:grid-cols-5 grid-cols-1 gap-8 h-full lg:w-4/5 mx-auto mt-6">
          <div className="col-span-1 px-4">
            <div className="w-full flex items-center px-2">
              <div>
                {user.avatar ? (
                  <img
                    className="w-12 h-12 my-auto rounded-full object-cover object-center"
                    src={`${user.avatar ? user.avatar : "../../user.svg"}`}
                    alt="Avatar Upload"
                  />
                ) : (
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
                )}
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
          <div className="col-span-4 mb-44 px-2">
            <div className=" flex justify-between">
              <div className="fex flex-col">
                <Link
                  href={{
                    pathname: "/[username]/library/sets",
                    query: { username: user.username },
                  }}
                >
                  <p className="text-sm text-gray-600 hover:underline cursor-pointer hover:text-gray-800">
                    <ChevronLeftIcon fontSize="small" /> Back to library
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
                {/* set color for ss */}
                {isLearned ? (
                  <div
                    className="w-full flex relative ml-2 my-auto"
                    ref={domNode}
                  >
                    <div className="pt-1.5">
                      <div
                        onClick={() =>
                          setShowModalColorPicker(!showModalColorPicker)
                        }
                        className={`tooltip w-5 h-5 rounded-full focus:outline-none focus:shadow-outline inline-flex shadow-md
                                bg-${ssColor.toLocaleLowerCase()}-400 cursor-pointer hover:bg-${ssColor.toLocaleLowerCase()}-300 `}
                      >
                        <span className="tooltiptext mt-2 w-24">set color</span>
                      </div>
                      {showModalColorPicker ? (
                        <div className="origin-top-right absolute z-50  mt-2 -ml-24 w-40 rounded-md shadow-lg hover:shadow-xl">
                          <div className="rounded-md bg-white shadow-xs px-4 py-3">
                            <div className="flex flex-wrap -mx-2">
                              {listColors.map((color, index) => {
                                return (
                                  <div key={index} className="px-2">
                                    {ssColor === color ? (
                                      <div
                                        className={`w-8 h-8 inline-flex rounded-full cursor-pointer border-4 border-white 
                                                bg-${color.toLocaleLowerCase()}-400 hover:bg-${color.toLocaleLowerCase()}-500`}
                                      ></div>
                                    ) : (
                                      <div
                                        onClick={() => {
                                          setColorhandle(color);
                                        }}
                                        className={`w-8 h-8 inline-flex rounded-full cursor-pointer border-4 border-white focus:outline-none focus:shadow-outline 
                                                bg-${color.toLocaleLowerCase()}-400 hover:bg-${color.toLocaleLowerCase()}-500`}
                                      ></div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}
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
            <div className="h-full mt-4">
              <h1 className="text-md mt-4 mb-2">{numberOfCard} cards</h1>
              <hr />
              <div className=" w-full">
                {cards.map((card, index) => {
                  return (
                    <div
                      key={index}
                      className="rounded-md flex w-full my-4 relative"
                    >
                      <div className="flex justify-between w-full gap-3">
                        <div
                          className="card-overview w-1/2 rounded-md bg-white shadow-lg border-b-1 p-6 text-center"
                          dangerouslySetInnerHTML={{ __html: card.front }}
                        ></div>
                        <div
                          className="card-overview w-1/2  rounded-md bg-white shadow-lg border-b-1 p-6 text-center"
                          dangerouslySetInnerHTML={{ __html: card.back }}
                        ></div>
                        {isLearned ? (
                          <div className="absolute right-2 top-2">
                            <img
                              src={`../../${
                                qValueArr[card.q ? card.q : 0]
                              }.svg`}
                              className="h-5 w-5 my-auto mx-auto"
                              alt=""
                            />
                          </div>
                        ) : null}
                      </div>

                      <div className="w-0">
                        {auth.userResponse?.username === creatorName ? (
                          <div>
                            <button
                              onClick={(event) => handelEditOnclick(index)}
                              className="ml-2 tooltip focus:outline-none"
                            >
                              <EditIcon
                                fontSize="small"
                                className="hover:text-gray-400 text-gray-700"
                              />
                              <span className="tooltiptext mt-2 w-16">
                                edit
                              </span>
                            </button>

                            <button
                              onClick={(event) => handelDeleteOnclick(index)}
                              className="ml-2 tooltip focus:outline-none"
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
                    </div>
                  );
                })}
              </div>
              <div className="mt-24">
                <hr />
                <div className="flex justify-between">
                  <p className="text-lg text-gray-700 font-semibold cursor-pointer mb-4">
                    Feedback
                  </p>
                  {creatorName !== auth.userResponse?.username ? (
                    <p
                      onClick={() => setShowModalFeedback(true)}
                      className="text-gray-600 text-md font-normal hover:underline cursor-pointer"
                    >
                      Your Feedback
                    </p>
                  ) : null}
                </div>

                {listFeedback.map((feedback) => {
                  return (
                    <div className=" px-10 py-4 border-b">
                      <div className="flex justify-between items-center w-full">
                        <div className="mt-4 flex items-center space-x-4 py-2">
                          <div>
                            <Link
                              href={{
                                pathname: "/[username]/library/sets",
                                query: {
                                  username: feedback.userName,
                                },
                              }}
                            >
                              <img
                                className="w-12 h-12 my-auto rounded-full object-cover object-center cursor-pointer"
                                src={`${
                                  feedback.avatar
                                    ? feedback.avatar
                                    : "../../user.svg"
                                }`}
                                alt="Avatar Upload"
                              />
                            </Link>
                          </div>
                          <div className="text-sm font-semibold">
                            <div className="flex justify-between">
                              <Link
                                href={{
                                  pathname: "/[username]/library/sets",
                                  query: {
                                    username: feedback.userName,
                                  },
                                }}
                              >
                                <p className="hover:underline cursor-pointer truncate">
                                  {feedback.userName}
                                </p>
                              </Link>
                              <div className="flex my-auto ml-4">
                                {stars.map((_, index) => {
                                  if (feedback.rating) {
                                    if (index < feedback.rating)
                                      return (
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-4 w-4 text-yellow-400"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                        >
                                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                      );
                                    else
                                      return (
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-4 w-4 text-gray-300"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                        >
                                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                      );
                                  }
                                })}
                              </div>
                              <div className="flex mt-2"></div>
                            </div>
                            <p className="mt-4 text-md text-gray-600">
                              {feedback.feedback}
                            </p>
                          </div>
                        </div>
                      </div>
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
                    forwardedRef={editorRefFront}
                    formats={formats}
                    theme="snow"
                    className="editor relative mb-12"
                    onChange={setFront}
                    placeholder="front side content"
                    value={front}
                  />
                </div>
                <div className="col-span-1 flex lg:my-2 my-4 ">
                  <QuillNoSSRWrapper
                    modules={modules2}
                    forwardedRef={editorRefBack}
                    formats={formats}
                    theme="snow"
                    className="editor relative mb-12"
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
        {showModalFeedback && isLearned ? (
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 backdrop-filter backdrop-brightness-50 -mt-12">
            <div className="h-screen w-full absolute flex items-center justify-center bg-modal px-2">
              <div className="bg-white rounded-md shadow p-6 m-4 max-w-md ">
                <div className="mb-2 text-gray-600 text-md font-semibold">
                  <p>Thank you!</p>
                  <p>Please send us your feedback!</p>
                </div>
                <div className="mb-4 items-center justify-around">
                  <div className="justify-center items-center flex">
                    {stars.map((_, index) => {
                      return (
                        <FaStar
                          key={index}
                          size={24}
                          onClick={() => handleClick(index + 1)}
                          onMouseOver={() => handleMouseOver(index + 1)}
                          onMouseLeave={handleMouseLeave}
                          color={
                            (hoverValue || rating) > index
                              ? colors.orange
                              : colors.grey
                          }
                          style={{
                            marginRight: 10,
                            cursor: "pointer",
                          }}
                        />
                      );
                    })}
                  </div>
                  {rating > 0 ? (
                    <div className="mt-4">
                      <InputArea
                        setValue={setFeedback}
                        placeholder="Let us know what you think..."
                        rows={10}
                        value={feedback}
                        error={feedbackContentErr}
                      />
                    </div>
                  ) : null}
                </div>
                <div className="flex justify-center mt-4 gap-6">
                  <button
                    onClick={() => setShowModalFeedback(false)}
                    className="bg-gray-100 border-2 text-gray-700 w-28 py-1 rounded-sm text-sm 
                 font-medium hover:bg-gray-300"
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendFeedback}
                    className=" bg-blue-500 text-white w-28 py-1 ml-1 rounded-sm text-sm font-medium 
                 hover:bg-blue-600"
                    type="button"
                  >
                    Send
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
