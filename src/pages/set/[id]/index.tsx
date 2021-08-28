import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppLayout from "../../../components/layout/AppLayout";
import { deleteAPI, getAPI, postAPI, putAPI } from "../../../utils/FetchData";
import { ICard, IFeedback, RootStore } from "../../../utils/TypeScript";
import { PARAMS } from "../../../common/params";
import { ALERT } from "../../../redux/types/alertType";
import _ from "lodash";
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
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import { FaStar } from "react-icons/fa";
import { useClickOutside } from "../../../hooks/useClickOutside";
import CircularProgress from "@material-ui/core/CircularProgress";
import { learnByDay } from "../../../redux/actions/learnAction";

//alert
function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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
  "image",
  "video",
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

  const [listCardsDefault, setListCardDefault] = useState<ICard[]>([]);

  const [ssColor, setSSColor] = useState("");
  const [listColors, setListColors] = useState<string[]>([]);

  const [showModalColorPicker, setShowModalColorPicker] = useState(false);
  const [showModalFilterCard, setShowModalFilterCard] = useState(false);
  const [cardColor, setCardColor] = useState("WHITE");

  const [listFeedback, setListFeedBack] = useState<IFeedback[]>([]);

  const [showModalFeedback, setShowModalFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [feedbackContentErr, setFeedbackContentErr] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [hoverValue, setHoverValue] = useState(undefined);

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
      setIsToastOpen(true);
      setTypeToast("warning");
      setMessageToast("Please make sure the uploaded file is less than 5MB");
    }
  };
  const saveToServer2 = async (file: any) => {
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await postAPI(`${PARAMS.ENDPOINT}storage/upload`, data);
      insertToEditor2(res.data);
    } catch (err) {
      setIsToastOpen(true);
      setTypeToast("warning");
      setMessageToast("Please make sure the uploaded file is less than 5MB");
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

  //fetch data err
  const [err, setErr] = useState(false);
  const [errCode, setErrCode] = useState(0);

  //frag ss learned
  const [isLearned, setIsLearned] = useState(false);
  //get data of set by id
  useEffect(() => {
    setErr(false);
    setErrCode(0);
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
            //add new card not started to learning
            const insertCardLearning = await getAPI(
              `${PARAMS.ENDPOINT}learn/continue?studySetId=${id}`
            );
            //set lai card learning cho list cardlearing
            const cardResLearning = await getAPI(
              `${PARAMS.ENDPOINT}learn/listCardSort?id=${id}`
            );
            setCards(cardResLearning.data);

            if (cardColor !== "WHITE") {
              setCards(
                cardResLearning.data.filter(
                  (item: ICard) => item.color === cardColor
                )
              );
            }
            setIsLearned(true);
          } else {
            const cardRes = await getAPI(
              `${PARAMS.ENDPOINT}card/list?id=${id}`
            );

            setCards(cardRes.data);
            setIsLearned(false);
          }
          try {
            const res = await getAPI(`${PARAMS.ENDPOINT}feedback/${id}`);
            const tempList: IFeedback[] = res.data;
            setListFeedBack(tempList.filter((fb) => fb.feedback));
          } catch (err) {}
          try {
            const res = await getAPI(`${PARAMS.ENDPOINT}feedback/${id}/me`);

            setRating(res.data.rating);
            setFeedback(res.data.feedback);
          } catch (err) {}
          try {
            const res = await getAPI(
              `${PARAMS.ENDPOINT}studySet/checkReprotExistence/${id}`
            );

            setisReported(res.data);
          } catch (err) {}
          setTitle(studySetRes.data.title);
          setDesc(studySetRes.data.description);
          setIsPublic(studySetRes.data.public);
          setTags(studySetRes.data.tag);
          setCreatorName(studySetRes.data.creatorName);
          setNumberOfCard(studySetRes.data.numberOfCard);
          dispatch({ type: ALERT, payload: { loading: false } });
        } else dispatch({ type: ALERT, payload: { loading: false } });
      } catch (err) {
        setErr(true);
        setErrCode(err.response.status);
      }
      //get color of SS
      try {
        const colorRes = await getAPI(
          `${PARAMS.ENDPOINT}studySet/color?id=${id}`
        );
        setSSColor(colorRes.data);
      } catch (err) {}
    };
    fetchData();
  }, [id, isSuc, cardColor, isSuccess]);

  useEffect(() => {
    if (!creatorName) return;
    dispatch(getUserByUsername(`${creatorName}`));
  }, [creatorName]);

  //handel click open menu
  const handelExpandMoreBtnClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  let domNode = useClickOutside(() => {
    setIsMenuOpen(false);
  });

  let domNodeSsColor = useClickOutside(() => {
    setShowModalColorPicker(false);
  });

  let domNodeFilterCard = useClickOutside(() => {
    setShowModalFilterCard(false);
  });

  // let domNode = useClickOutside(() => {
  //   setIsMenuOpen(false);
  //   setShowModalColorPicker(false);
  //   setShowModalFilterCard(false);
  // });

  const handelEditOnclick = (index: number) => {
    setCurrentCard(index);
    setFront(cards[index].front);
    setBack(cards[index].back);
    setIsModalEditOpen(true);
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
          id: cards[currentCard].id
            ? cards[currentCard].id
            : cards[currentCard].cardId,
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
    let card_id = cards[currentCard].id
      ? cards[currentCard].id
      : cards[currentCard].cardId;

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
    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      const res = await deleteAPI(
        `${PARAMS.ENDPOINT}card/delete?id=${card_id}`
      );
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
      }
    };
    fetchData();
  }, [id]);

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
    } else if (reportContent.length > 500) {
      setReportContentErr("Report content can not exceed 500 characters");
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
        setMessageToast("An error occurred");
        setTypeToast("error");
        setIsToastOpen(true);
      }
    }
  };

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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       dispatch({ type: ALERT, payload: { loading: true } });
  //       const res = await getAPI(`${PARAMS.ENDPOINT}feedback/${id}/me`);
  //       dispatch({ type: ALERT, payload: { loading: false } });

  //       setRating(res.data.rating);
  //       setFeedback(res.data.feedback);
  //     } catch (err) {
  //       dispatch({ type: ALERT, payload: { loading: false } });
  //     }
  //   };

  //   fetchData();
  // }, [id]);

  const showFeedbackHandle = async () => {
    try {
    } catch (err) {}
  };

  // useEffect(() => {
  //   setIsSuccess(false);
  //   if (!id) return;
  //   const fetchData = async () => {
  //     try {
  //       dispatch({ type: ALERT, payload: { loading: true } });
  //       const res = await getAPI(`${PARAMS.ENDPOINT}feedback/${id}`);
  //       const tempList: IFeedback[] = res.data;
  //       setListFeedBack(tempList.filter((fb) => fb.feedback));
  //     } catch (err) {
  //       dispatch({ type: ALERT, payload: { loading: false } });
  //     }
  //   };
  //   fetchData();
  // }, [id, isSuccess]);

  const sendFeedback = async () => {
    if (!id) return;
    if (feedback.length > 250) {
      setFeedbackContentErr("Feedback can not exceed 250 characters.");
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
        dispatch({ type: ALERT, payload: { loading: false } });
        setMessageToast("An error occurred");
        setTypeToast("error");
        setIsToastOpen(true);
      }
    }
  };

  //init color list
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAPI(`${PARAMS.ENDPOINT}folder/getColorFolder`);
        setListColors(res.data);
      } catch (err) {}
    };
    fetchData();
  }, []);

  const setColorhandle = (color: string) => {
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
        dispatch({ type: ALERT, payload: { loading: false } });
      }
    };

    putColor();
    setShowModalColorPicker(false);
  };

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const cardRes = await getAPI(`${PARAMS.ENDPOINT}card/list?id=${id}`);
        setListCardDefault(cardRes.data);
      } catch (err) {}
    };

    fetchData();
  }, [id]);

  const filterCardByColor = (color: string) => {
    setCardColor(color);
    setShowModalFilterCard(false);
  };

  const forkHandle = async () => {
    const cardsData: ICard[] = [];
    listCardsDefault.forEach((card, index) => {
      cardsData.push({ front: card.front, back: card.back });
    });
    const data = {
      creator: auth.userResponse?._id,
      title: title.includes("(Forked)") ? title : "(Forked) " + title,
      description: desc,
      tag: tags,
      cards: cardsData,
      isPublic: false,
    };

    console.log(data);

    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      const res = await postAPI(`${PARAMS.ENDPOINT}studySet/create`, data);
      dispatch({ type: ALERT, payload: { loading: false } });
      setTypeToast("success");
      setMessageToast("😎 Forked!");
      setIsToastOpen(true);
    } catch (err) {
      dispatch({ type: ALERT, payload: { loading: false } });
      setMessageToast("An error occurred");
      setTypeToast("error");
      setIsToastOpen(true);
    }
  };

  const learn = () => {
    dispatch(learnByDay({}));
    router.push(`/set/${id}/learn`);
  };

  const [showModalResetCF, setShowModalResetCF] = useState(false);

  const reset = async () => {
    try {
      const res = await deleteAPI(`${PARAMS.ENDPOINT}learn/stop?id=${id}`);
      setIsSuc(true);
      setTypeToast("success");
      setMessageToast("Reset!");
      setIsToastOpen(true);
      setShowModalResetCF(false);
    } catch (err) {
      dispatch({ type: ALERT, payload: { loading: false } });
      setMessageToast("An error occurred");
      setTypeToast("error");
      setIsToastOpen(true);
    }
  };

  if (err)
    return (
      <AppLayout title="Error" desc={"Error"}>
        <div className="text-center mb-44">
          {errCode === 404 ? (
            <div className="h-screen w-screen bg-gray-100 flex mt-12">
              <div className="mx-auto flex flex-col md:flex-row justify-center px-5 text-gray-800">
                <div className="max-w-md">
                  <div className="text-5xl font-dark font-bold">404</div>
                  <p className="text-2xl font-semibold leading-normal mt-2">
                    Sorry we couldn't find this page.{" "}
                  </p>
                  <p className="mb-8 mt-2">
                    But dont worry, you can find plenty of other things on our
                    homepage.
                  </p>
                  <Link href="/home">
                    <button className="px-4 inline py-2 text-sm font-medium leading-5 shadow text-white transition-colors duration-150 border border-transparent rounded-sm focus:outline-none focus:shadow-outline-blue bg-blue-500 active:bg-blue-600 hover:bg-blue-600">
                      back to homepage
                    </button>
                  </Link>
                  <img
                    src="../../404.jpeg"
                    alt=""
                    className="h-64 mx-auto mt-8"
                  />
                </div>
              </div>
            </div>
          ) : errCode === 403 ? (
            <div className="h-screen w-screen bg-gray-100 flex mt-12">
              <div className="mx-auto flex flex-col md:flex-row justify-center text-gray-800">
                <div className="max-w-md">
                  <div className="text-5xl font-dark font-bold">403</div>
                  <p className="text-2xl font-semibold leading-normal mt-2">
                    Forbidden{" "}
                  </p>
                  <p className="mb-8 mt-2">
                    Access to this resource on the server is denied!
                  </p>
                  <Link href="/home">
                    <button className="px-4 inline py-2 text-sm font-medium leading-5 shadow text-white transition-colors duration-150 border border-transparent rounded-sm focus:outline-none focus:shadow-outline-blue bg-blue-500 active:bg-blue-600 hover:bg-blue-600">
                      back to homepage
                    </button>
                  </Link>
                  <img
                    src="../../403.jpeg"
                    alt=""
                    className="h-64 mx-auto mt-8"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="h-screen w-screen bg-gray-100 flex mt-12">
              <div className="mx-auto flex flex-col md:flex-row justify-center text-gray-800">
                <div className="max-w-md">
                  <div className="text-5xl font-dark font-bold">
                    An error occurred
                  </div>

                  <Link href="/home">
                    <button className="px-4 inline py-2 text-sm font-medium leading-5 shadow text-white transition-colors duration-150 border border-transparent rounded-sm focus:outline-none focus:shadow-outline-blue bg-blue-500 active:bg-blue-600 hover:bg-blue-600">
                      back to homepage
                    </button>
                  </Link>
                  <img
                    src="../../error.jpeg"
                    alt=""
                    className="h-64 mx-auto mt-8"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </AppLayout>
    );

  return (
    <div>
      <AppLayout title={title} desc={desc}>
        <div className="grid lg:grid-cols-5 grid-cols-1 gap-8 h-full lg:w-4/5 mx-auto mt-6">
          <div className="col-span-1 px-4">
            <div className=" flex items-center px-2">
              <div>
                <img
                  className="w-12 h-12 my-auto rounded-full object-cover object-center"
                  src={`${user.avatar ? user.avatar : "../../user.svg"}`}
                  alt="Avatar Upload"
                />
              </div>
              <div className="px-3 mr-auto">
                <small className="text-sm">create by </small>
                <Link href={`/${creatorName}/library/sets`}>
                  <a className="font-medium text-md hover:underline cursor-pointer">
                    {creatorName}
                  </a>
                </Link>
              </div>
            </div>
            <p>
              <span className="text-md font-bold">{title}</span>
              <br />
              <br />
              <hr />
              <br />
              <span className="text-sm text-gray-700">about</span>
              <br />
              <span className="text-sm">{desc}</span>
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
                  href={`/${creatorName}/library/sets?color=WHITE&search_query=`}
                >
                  <p className="text-sm text-gray-600 hover:underline cursor-pointer hover:text-gray-800">
                    <ChevronLeftIcon fontSize="small" /> Back to library
                  </p>
                </Link>
              </div>
              {/* toolbar */}
              <div className="flex h-8">
                <button
                  onClick={learn}
                  className="w-24 text-md rounded-sm px-4 mx-2
                   text-sm font-medium bg-blue-500 hover:bg-blue-600 
                text-white focus:outline-none"
                >
                  Learn
                </button>
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
                    ref={domNodeSsColor}
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
                            onClick={forkHandle}
                          >
                            <span className="flex flex-col">
                              <span>Fork</span>
                            </span>
                          </a>
                          {isLearned ? (
                            <a
                              className="block px-4 py-1 font-medium text-sm text-gray-700 hover:bg-blue-500 
                            hover:text-white dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600 cursor-pointer"
                              role="menuitem"
                              onClick={() => setShowModalResetCF(true)}
                            >
                              <span className="flex flex-col">
                                <span>Reset</span>
                              </span>
                            </a>
                          ) : null}

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
              <div className="flex justify-between w-full">
                <div>
                  {" "}
                  <h1 className="text-md mt-4 mb-2">{numberOfCard} cards</h1>
                </div>
                {/* filter card by color */}
                {isLearned ? (
                  <div className="ml-2 my-auto flex">
                    <p>Filter cards </p>
                    <div className="my-auto ml-2" ref={domNodeFilterCard}>
                      <div
                        onClick={() =>
                          setShowModalFilterCard(!showModalFilterCard)
                        }
                        className={`w-5 h-5 rounded-full focus:outline-none focus:shadow-outline inline-flex shadow-md
                                  bg-${cardColor.toLowerCase()}-400 cursor-pointer hover:bg-${cardColor.toLowerCase()}-300 `}
                      ></div>
                      {showModalFilterCard ? (
                        <div className="origin-top-right absolute z-50  mt-2 -ml-24 w-40 rounded-md shadow-lg hover:shadow-xl">
                          <div className="rounded-md bg-white shadow-xs px-4 py-3">
                            <div className="flex flex-wrap -mx-2">
                              {listColors.map((color, index) => {
                                return (
                                  <div key={index} className="px-2">
                                    <div
                                      onClick={() => {
                                        filterCardByColor(color);
                                      }}
                                      className={`w-8 h-8 inline-flex rounded-full cursor-pointer border-4 border-white focus:outline-none focus:shadow-outline 
                                                  bg-${color.toLocaleLowerCase()}-400 hover:bg-${color.toLocaleLowerCase()}-500`}
                                    ></div>
                                  </div>
                                );
                              })}
                              <div className="px-2">
                                <div
                                  onClick={() => {
                                    filterCardByColor("WHITE");
                                  }}
                                  className={`w-8 h-8 inline-flex rounded-full cursor-pointer border-4 border-white 
                                  focus:outline-none focus:shadow-outline`}
                                >
                                  {" "}
                                  <p className="text-md text-gray-700 font-medium hover:text-gray-500 hover:underline">
                                    All
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>

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
                          className="card-overview w-1/2 rounded-md bg-white shadow-lg border-b-1 p-8 text-center"
                          dangerouslySetInnerHTML={{ __html: card.front }}
                        ></div>
                        <div
                          className="card-overview w-1/2  rounded-md bg-white shadow-lg border-b-1 p-9 text-center"
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
                            {card.color ? (
                              <FiberManualRecordIcon
                                className={`py-1 text-${card.color.toLowerCase()}-400`}
                              />
                            ) : (
                              <FiberManualRecordIcon
                                className={`py-1 text-gray-200 shadow-sm`}
                              />
                            )}
                          </div>
                        ) : null}
                      </div>

                      <div className="w-0">
                        {/* show btn edit card when user is creator*/}
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
                  {creatorName !== auth.userResponse?.username && isLearned ? (
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
                            <Link href={`/${feedback.userName}/library/sets`}>
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
                              <Link href={`/${feedback.userName}/library/sets`}>
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
                    className="text-white w-32 rounded-sm mx-4 bg-yellow-500 hover:bg-yellow-600"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setShowModalDelete(false)}
                    className=" text-white w-32 py-1 mx-4 rounded0sm bg-blue-500 hover:bg-blue-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {showModalResetCF ? (
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 backdrop-filter backdrop-brightness-50 -mt-12">
            <div className="h-screen w-full absolute flex items-center justify-center bg-modal">
              <div className="bg-white rounded-md shadow p-6 m-4 max-w-xs max-h-full text-center">
                <div className="mb-4"></div>
                <div className="mb-8">
                  <p>Are you sure want to reset this study set</p>
                  <p className="text-gray-600 text-xs px-1 mb-2">
                    When you reset this study set, all information about your
                    learning process about this study set will reset.
                  </p>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={reset}
                    className="text-white w-32 rounded-sm mx-4 bg-yellow-500 hover:bg-yellow-600"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setShowModalResetCF(false)}
                    className=" text-white w-32 py-1 mx-4 rounded0sm bg-blue-500 hover:bg-blue-600"
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
              <div className="bg-white rounded-md shadow p-6 m-4 max-w-md text-center">
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
        {alert.loading || alert.loading === undefined ? (
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed 
        inset-0 z-50 backdrop-filter backdrop-blur-md -mt-12"
          >
            <div className="flex justify-center items-center space-x-1 text-sm text-gray-700">
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
              <div>Loading ...</div>
            </div>
          </div>
        ) : null}
        <Snackbar
          open={isToastOpen}
          autoHideDuration={2000}
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
