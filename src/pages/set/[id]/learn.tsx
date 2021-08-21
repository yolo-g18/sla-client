import Link from "next/link";
import AppLayput2 from "../../../components/layout/AppLayout";
import dynamic from "next/dynamic";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactCardFlip from "react-card-flip";
import { useRouter } from "next/router";
import { ICardLearning, RootStore } from "../../../utils/TypeScript";

import { useDispatch, useSelector } from "react-redux";
import { PARAMS } from "../../../common/params";
import { ALERT } from "../../../redux/types/alertType";
import { getAPI, postAPI, putAPI } from "../../../utils/FetchData";
import CloseIcon from "@material-ui/icons/Close";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { useClickOutside } from "../../../hook/useClickOutside";

import { FaStar } from "react-icons/fa";

import CircularProgress, {
  CircularProgressProps,
} from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import {
  convertTime,
  convertTimeEvnLearn,
  formatDate2,
  formatUTCToDate,
} from "../../../components/schedule/convertTime";
import { learnByDay } from "../../../redux/actions/learnAction";
import InputArea from "../../../components/input/InputArea";

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

const colors = {
  orange: "#FFBA5A",
  grey: "#a9a9a9",
};

const stars = Array(5).fill(0);

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number }
) {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress
        style={{ color: "#3B82F6" }}
        size="40"
        variant="determinate"
        {...props}
      />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          variant="h5"
          component="div"
          color="textSecondary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

const learn = () => {
  const { auth, alert, learn } = useSelector((state: RootStore) => state);
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [q, setQ] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAddHintFormOpen, setIsAddHintFormOpen] = useState(false);
  const [isEditCardFromOpen, setIsEditCardFromOpen] = useState(false);
  const [showModalSetColor, setShowModalSetColor] = useState(false);
  const [listCardsLearning, setListCardsLearning] = useState<ICardLearning[]>(
    []
  );
  const [currentCard, setCurrentCard] = useState(0);
  const [frontContent, setFrontContent] = useState("");
  const [backContent, setBackContent] = useState("");
  const [cardHint, setCardHint] = useState<string | undefined>("");
  const [color, setColor] = useState<string | undefined>("");
  const [showLearningResultModal, setShowLearningResultModal] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [typeToast, setTypeToast] = useState("success");
  const [messageToast, setMessageToast] = useState("");
  const [isChange, setIsChange] = useState(false);
  const [studySetTitle, setStudySetTitle] = useState("");
  const [studySetId, setStudySetID] = useState(0);
  const [ssCreator, setSsCreator] = useState("");
  const [currentCardColor, setCurrentCardColor] = useState<string | undefined>(
    ""
  );

  const [isContinue, setIsContinue] = useState(false);
  const [overralProgress, setOverralProgress] = useState(0);

  //setup rich editor
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

  // to count number of q > 3
  const [listQ, setListQ] = useState<{ index: number; q: number }[]>([]);

  const qValueArr = ["sosad", "sad", "neutral", "grinning", "smile", "happy"];

  const router = useRouter();
  //lay ra id tu path
  const {
    query: { id }, //id of folder get from path
  } = router;

  const [isLearnByDay, setIsLearnByday] = useState(false);
  //fetch data err
  const [err, setErr] = useState(false);

  //fecth to get cards
  useEffect(() => {
    setErr(false);
    if (!id) {
      return;
    }
    const fetchData = async () => {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const studySetRes = await getAPI(
          `${PARAMS.ENDPOINT}studySet/view?id=${id}`
        );
        setStudySetID(studySetRes.data.studySetId);
        setStudySetTitle(studySetRes.data.title);
        setSsCreator(studySetRes.data.creatorName);

        const listCardLearingRes = await getAPI(
          `${PARAMS.ENDPOINT}learn/continue?studySetId=${id}`
        );

        setListCardsLearning(listCardLearingRes.data.listCardLearning);
        setOverralProgress(listCardLearingRes.data.progress);
        setCurrentCardColor(
          listCardLearingRes.data.listCardLearning[currentCard].color
        );
        console.log("update chua");
        if (!learn.isDone && learn.learnDate) {
          console.log("tai sao nhay vao day");
          try {
            const listCardLearingRes = await getAPI(
              `${PARAMS.ENDPOINT}learn/learnByDate?studySet=${
                learn.ssID
              }&date=${convertTimeEvnLearn(learn.learnDate)}`
            );
            if (listCardLearingRes.data.length) {
              setListCardsLearning(listCardLearingRes.data);
              setCurrentCardColor(listCardLearingRes.data[currentCard].color);
              console.log("update chua");
            }
          } catch (err) {
            console.log(err);
          }
        }
        setIsContinue(false);
        dispatch({ type: ALERT, payload: { loading: false } });
      } catch (err) {
        console.log("error is: " + err);
        setErr(true);
      }
    };
    fetchData();
    setIsChange(false);
  }, [id, isChange, isContinue]);

  useEffect(() => {
    if (listCardsLearning.length && currentCard < listCardsLearning.length)
      setCurrentCardColor(listCardsLearning[currentCard].color);
  }, [currentCard, isChange]);

  //init color list
  const [listColors, setListColors] = useState<string[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAPI(`${PARAMS.ENDPOINT}folder/getColorFolder`);
        setListColors(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  //handle learn continue
  useEffect(() => {
    if (!id) {
      return;
    }
    const fetchData = async () => {
      try {
        const listCardLearingRes = await getAPI(
          `${PARAMS.ENDPOINT}learn/continue?studySetId=${id}`
        );
        setOverralProgress(listCardLearingRes.data.progress);
      } catch (err) {
        console.log(err);
        // router.push("/error");
      }
    };

    fetchData();
  }, [showLearningResultModal]);

  //handle click outside menu
  let domNode = useClickOutside(() => {
    setIsMenuOpen(false);
    setShowModalSetColor(false);
  });

  //handle click outside set color modal
  let domNodeModalSetColor = useClickOutside(() => {
    setShowModalSetColor(false);
  });

  //handel close toast
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setIsToastOpen(false);
  };

  const handelExpandMoreBtnClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const flipCardHandel = () => {
    setIsFlipped(!isFlipped);
  };

  //ask user continue or review
  // const hand;

  //switch card

  //send q
  const handelResultUserSelect = async (q_value: number) => {
    console.log("q is: " + q_value);
    const data = {
      q: q_value,
      cardId: listCardsLearning[currentCard].cardId,
    };

    let listQTemp: { index: number; q: number }[] = [...listQ];
    const listCheck = listQTemp.filter((tq) => tq.index === currentCard);
    if (listCheck.length === 0) {
      listQTemp.push({ index: currentCard, q: q_value });
    } else {
      listQTemp.map((qt) => {
        if (qt.index === currentCard) qt.q = q_value;
      });
    }
    setListQ(listQTemp);
    console.log("qs: " + JSON.stringify(listQTemp));

    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      const res = await putAPI(`${PARAMS.ENDPOINT}learn/update`, data);
      dispatch({ type: ALERT, payload: { loading: false } });
      switchCardHandle("next");
    } catch (err) {
      dispatch({ type: ALERT, payload: { loading: false } });
      console.log(err);
    }
  };

  //show modal edit card
  const showModalEditcard = () => {
    setIsEditCardFromOpen(true);
    setFrontContent(listCardsLearning[currentCard].front);
    setBackContent(listCardsLearning[currentCard].back);
  };

  //save hint when close modal hint
  const handelSaveHint = async () => {
    if (cardHint === listCardsLearning[currentCard].hint) {
      setIsAddHintFormOpen(false);
      return;
    }
    const data = {
      id: listCardsLearning[currentCard].cardId,
      hint: cardHint,
    };

    console.log("hint is: " + cardHint);

    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      const res = await postAPI(`${PARAMS.ENDPOINT}card/writeHint`, data);
      dispatch({ type: ALERT, payload: { loading: false } });
      setIsChange(true);
    } catch (err) {
      setIsChange(false);
      setMessageToast("An error occurred");
      setTypeToast("error");
      setIsToastOpen(true);
    }
    setIsAddHintFormOpen(false);
  };

  //open hint modal
  const openHintModal = () => {
    setIsAddHintFormOpen(true);
    setCardHint(listCardsLearning[currentCard].hint);
  };

  const [switching, setSwitching] = useState(false);
  const switchCardHandle = (type: string) => {
    setSwitching(true);
    if (type === "next" && currentCard < listCardsLearning.length) {
      setIsFlipped(false);
      setCurrentCard(currentCard + 1);
      currentCard + 1 >= listCardsLearning.length
        ? setShowLearningResultModal(true)
        : setShowLearningResultModal(false);
    }
    if (type === "prev" && currentCard >= 0) {
      setIsFlipped(false);
      setCurrentCard(currentCard - 1);
    }
    setTimeout(() => {
      setSwitching(false);
    }, 200);
  };

  const reviewAgain = () => {
    setCurrentCard(0);
    setShowLearningResultModal(false);
  };

  const learnContinue = () => {
    //mark learn by day is done
    dispatch(learnByDay({}));
    //redet current card to 0
    setCurrentCard(0);
    setIsContinue(true);
    setShowLearningResultModal(false);
  };

  const [showModalFeedback, setShowModalFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [feedbackContentErr, setFeedbackContentErr] = useState("");

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

  //get feedback of current user
  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const res = await getAPI(`${PARAMS.ENDPOINT}feedback/${id}/me`);

        setRating(res.data.rating);
        setFeedback(res.data.feedback);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (
      rating === 0 &&
      Math.round(overralProgress * 100) === 100 &&
      auth.userResponse?.username !== ssCreator
    )
      setShowModalFeedback(true);
  }, [showLearningResultModal, overralProgress]);

  const sendFeedback = async () => {
    if (!id) return;
    if (feedback.length > 500) {
      setFeedbackContentErr("Feedback cannot exceed 500 character.");
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
        setMessageToast("Thanks for your feedback 🙏");
        setTypeToast("success");
        setIsToastOpen(true);
        setShowModalFeedback(false);
      } catch (err) {
        console.log(err);
        dispatch({ type: ALERT, payload: { loading: false } });
        setMessageToast("An error occurred");
        setTypeToast("error");
        setIsToastOpen(true);
      }
      console.log("data: " + JSON.stringify(data));
    }
  };

  //handle edit card
  const handleCardSave = async () => {
    const data = [
      {
        id: listCardsLearning[currentCard].cardId,
        studySet: studySetId,
        front: frontContent,
        back: backContent,
      },
    ];

    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      console.log(data);

      const res = await putAPI(`${PARAMS.ENDPOINT}card/edit`, data);
      dispatch({
        type: ALERT,
        payload: { loading: false, success: "😎 Your card updated!" },
      });
      setIsChange(true);
      setTypeToast("success");
      setMessageToast("😎 Your card updated!");
      setIsToastOpen(true);
      setIsEditCardFromOpen(false);
    } catch (err) {
      setIsChange(false);
      console.log(err);
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

  const openModalSetColor = () => {
    setShowModalSetColor(!showModalSetColor);
    setCurrentCardColor(listCardsLearning[currentCard].color);
  };

  //set color for card
  const setColorhandle = (color: string) => {
    const data = {
      id: listCardsLearning[currentCard].cardId,
      color: color,
    };
    console.log(data);

    const putColor = async () => {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await putAPI(`${PARAMS.ENDPOINT}card/color`, data);
        dispatch({ type: ALERT, payload: { loading: false } });
        console.log(res);
        setIsChange(true);
      } catch (err) {
        setIsChange(false);
        console.log(err);
        dispatch({ type: ALERT, payload: { loading: false } });
      }
    };

    putColor();
    setShowModalSetColor(false);
  };

  if (err)
    return (
      <AppLayput2 title="Error" desc={"Error"}>
        <div className="text-center mt-12">
          <p className="text-3xl font-semibold text-gray-700">
            You can not access this set 😑
          </p>
        </div>
      </AppLayput2>
    );

  // if (alert.loading) {
  //   return (
  //     <AppLayput2 title={`Learn | ${studySetTitle}`} desc="Learn">
  //       <div className="w-full h-full fixed block top-0 left-0 bg-white  z-50">
  //         <span
  //           className=" opacity-90 top-1/2 my-0 mx-auto block relative w-0 h-0 text-3xl font-bold"
  //           style={{ top: "50%" }}
  //         >
  //           Loading...
  //         </span>
  //       </div>
  //     </AppLayput2>
  //   );
  // }

  return (
    <div>
      <AppLayput2 title={`Learn | ${studySetTitle}`} desc="Learn">
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto w-full mt-4 inset-0 px-2 h-full">
          <div className="h-3/5 2xl:w-2/5 md:w-1/2 sm:w-2/3 w-full rounded-md mb-64">
            <div className="mb-4">
              <Link
                href={{
                  pathname: "/set/[id]",
                  query: { id: id },
                }}
              >
                <p className="text-sm text-gray-600 hover:underline cursor-pointer hover:text-gray-800">
                  <ChevronLeftIcon fontSize="small" /> Back to set
                </p>
              </Link>
            </div>
            {!learn.learnDate ? null : !learn.isDone ? (
              <p className="text-md text-gray-600">
                Review cards at{" "}
                <span className="font-bold">
                  {formatUTCToDate(learn.learnDate)}
                </span>
              </p>
            ) : null}
            {showLearningResultModal ? (
              <div className="mx-auto h-2/3 text-center">
                <p className="font-bold text-gray-700">OVERRAL PROGRESS</p>
                <CircularProgressWithLabel
                  className="w-32 my-6"
                  value={overralProgress * 100}
                />

                {Math.round(overralProgress * 100) === 100 ? (
                  <div className="mt-6">
                    <p className="text-gray-700 font-bold text-2xl">
                      Congratulations, you've learned everything?
                    </p>
                    <div className="flex w-full pt-10 px-4 mx-auto justify-center">
                      <button
                        className="bg-gray-100 border-2 text-gray-700 w-32 py-1 mr-1 rounded-sm text-sm font-medium hover:bg-gray-300 focus:outline-none"
                        type="button"
                        onClick={() => learnContinue()}
                      >
                        Continue review
                      </button>
                      <Link
                        href={{
                          pathname: "/set/[id]",
                          query: { id: id },
                        }}
                      >
                        <button
                          className=" bg-blue-500 text-white w-32 py-1 ml-1 rounded-sm text-sm font-medium hover:bg-blue-600 focus:outline-none"
                          type="button"
                        >
                          Finish
                        </button>
                      </Link>
                    </div>
                    {showModalFeedback ? (
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
                                      onMouseOver={() =>
                                        handleMouseOver(index + 1)
                                      }
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
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-around gap-4">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-green-400">
                          {listQ.filter((qt) => qt.q === 5).length}
                        </p>
                        <p>Perfectly</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-blue-400">
                          {listQ.filter((qt) => qt.q <= 4 && qt.q >= 3).length}
                        </p>
                        <p>Understand</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-yellow-400">
                          {listCardsLearning.length -
                            listQ.filter((qt) => qt.q === 5).length -
                            listQ.filter((qt) => qt.q <= 4 && qt.q >= 3)
                              .length}{" "}
                        </p>
                        <p>Studying</p>
                      </div>
                    </div>
                    <div className="flex w-full pt-10 px-4 mx-auto justify-center">
                      <button
                        className="bg-gray-100 border-2 text-gray-700 w-28 py-1 mr-1 rounded-sm text-sm font-medium hover:bg-gray-300 focus:outline-none"
                        type="button"
                        onClick={() => reviewAgain()}
                      >
                        Review again
                      </button>
                      <button
                        className=" bg-blue-500 text-white w-28 py-1 ml-1 rounded-sm text-sm font-medium hover:bg-blue-600 focus:outline-none"
                        type="button"
                        onClick={() => learnContinue()}
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="justify-center items-center flex text-gray-700 font-medium text-md mb-1 w-full">
                  <p>Practice Your Card</p>
                </div>
                <div className="flex justify-between w-full mb-2">
                  <div className="px-1">
                    <h1>
                      {currentCard + 1}/{listCardsLearning.length}
                    </h1>
                  </div>
                  <div className="flex ">
                    {currentCardColor ? (
                      <FiberManualRecordIcon
                        fontSize="medium"
                        className={`text-${currentCardColor.toLowerCase()}-400`}
                      />
                    ) : (
                      <FiberManualRecordIcon
                        fontSize="medium"
                        className={`text-gray-200`}
                      />
                    )}

                    <div ref={domNode}>
                      <button
                        className="px-1 focus: outline-none"
                        onClick={handelExpandMoreBtnClick}
                      >
                        <ExpandMoreIcon />
                      </button>
                      {isMenuOpen ? (
                        <div className="origin-top-right absolute z-50 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                          <div
                            className={`py-1`}
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="options-menu"
                          >
                            <div>
                              <a
                                className="block px-4 py-1 font-medium text-sm text-gray-700 cursor-pointer
                            hover:bg-blue-500 hover:text-white dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600"
                                role="menuitem"
                                onClick={openHintModal}
                              >
                                <span className="flex flex-col">
                                  <span>hint</span>
                                </span>
                              </a>
                              {auth.userResponse?.username === ssCreator ? (
                                <a
                                  className="block px-4 py-1 font-medium text-sm text-gray-700 cursor-pointer
                            hover:bg-blue-500 hover:text-white dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600"
                                  role="menuitem"
                                  onClick={showModalEditcard}
                                >
                                  <span className="flex flex-col">
                                    <span>edit</span>
                                  </span>
                                </a>
                              ) : null}

                              <a
                                className="block px-4 py-1 font-medium text-sm text-gray-700 cursor-pointer hover:text-gray-400"
                                role="menuitem"
                              >
                                <div className="flex flex-col">
                                  <div
                                    ref={domNodeModalSetColor}
                                    onClick={openModalSetColor}
                                  >
                                    <span>set color</span>
                                    {currentCardColor ? (
                                      <div
                                        className={`ml-2 w-2 h-2 rounded-full focus:outline-none focus:shadow-outline inline-flex shadow-md 
                                bg-${currentCardColor.toLowerCase()}-400 cursor-pointer hover:bg-${currentCardColor.toLowerCase()}-300 `}
                                      ></div>
                                    ) : (
                                      <div
                                        className={`ml-2 w-2 h-2 rounded-full focus:outline-none focus:shadow-outline inline-flex shadow-md 
                              bg-gray-200 cursor-pointer`}
                                      ></div>
                                    )}

                                    {showModalSetColor ? (
                                      <div className="origin-top-right absolute z-50  mt-2 -ml-24 w-40 rounded-md shadow-lg hover:shadow-xl">
                                        <div className="rounded-md bg-white shadow-xs px-4 py-3">
                                          <div className="flex flex-wrap -mx-2">
                                            {listColors.map((color, index) => {
                                              return (
                                                <div
                                                  key={index}
                                                  className="px-2"
                                                >
                                                  {currentCardColor ===
                                                  color ? (
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
                              </a>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div>
                  {listCardsLearning.map((card, index) => {
                    if (index === currentCard)
                      return (
                        <ReactCardFlip
                          isFlipped={isFlipped}
                          flipDirection="vertical"
                          key={index}
                        >
                          <div onClick={flipCardHandel}>
                            <div
                              className={`card h-96 w-full shadow-md rounded-md border border-gray-200 p-6 text-center text-xl content-center bg-white
                              overflow-auto ${
                                switching ? " bg-gray-200" : ""
                              } duration-100`}
                              dangerouslySetInnerHTML={{ __html: card.front }}
                            ></div>
                          </div>
                          <div onClick={flipCardHandel}>
                            <div
                              className={`card h-96 w-full shadow-md rounded-md border border-gray-200 p-6 text-center text-xl content-center bg-white
                               overflow-auto ${
                                 switching ? " bg-gray-200" : ""
                               } duration-100`}
                              dangerouslySetInnerHTML={{ __html: card.back }}
                            ></div>
                          </div>
                        </ReactCardFlip>
                      );
                  })}
                </div>
                <div className="mt-6">
                  <p className="font-bold justify-center items-center flex text-gray-700 text-sm">
                    <span>*How well did you know this?</span>
                    <span className="tooltip hover:underline text-gray-700 font-medium text-md cursor-pointer ml-4">
                      *tips
                      <div className="tooltiptext2 w-52 p-2 text-left mr-6">
                        <p className="mx-2">
                          <span>
                            <img
                              src={`../../${qValueArr[5]}.svg`}
                              className="h-4 w-4 mr-2 inline"
                              alt=""
                            />
                          </span>
                          Perfect response
                        </p>
                        <p className="mx-2">
                          <span>
                            <img
                              src={`../../${qValueArr[4]}.svg`}
                              className="h-4 w-4 mr-2 inline"
                              alt=""
                            />
                          </span>
                          Correct response after a hesitation
                        </p>
                        <p className="mx-2">
                          <span>
                            <img
                              src={`../../${qValueArr[3]}.svg`}
                              className="h-4 w-4 mr-2 inline"
                              alt=""
                            />
                          </span>
                          Correct response recalled with serious difficulty
                        </p>
                        <p className="mx-2">
                          <span>
                            <img
                              src={`../../${qValueArr[2]}.svg`}
                              className="h-4 w-4 mr-2 inline"
                              alt=""
                            />
                          </span>
                          Incorrect response; where the correct one seemed easy
                          to recall
                        </p>
                        <p className="mx-2">
                          <span>
                            <img
                              src={`../../${qValueArr[1]}.svg`}
                              className="h-4 w-4 mr-2 inline"
                              alt=""
                            />
                          </span>
                          Incorrect response; the correct one remembered
                        </p>
                        <p className="mx-2">
                          <span>
                            <img
                              src={`../../${qValueArr[0]}.svg`}
                              className="h-4 w-4 mr-2 inline"
                              alt=""
                            />
                          </span>
                          Complete blackout
                        </p>
                      </div>
                    </span>
                  </p>
                </div>
                <div className="justify-center items-center flex mt-2">
                  {qValueArr.map((qValue, index) => {
                    return (
                      <button
                        onClick={() => handelResultUserSelect(index)}
                        key={index}
                        className={`flex-wrap w-1/6 mx-2 h-12 px-2  rounded-md transition duration-300
                         hover:bg-gray-200 focus:outline-none shadow-md border`}
                      >
                        <img
                          src={`../../${qValue}.svg`}
                          className="h-6 w-6 my-auto mx-auto"
                          alt=""
                        />
                      </button>
                    );
                  })}
                </div>
                <div className="justify-center items-center flex mt-6 ">
                  <button
                    disabled={currentCard === 0 ? true : false}
                    className={`${
                      currentCard === 0
                        ? "text-gray-300"
                        : "hover:bg-blue-500 rounded-full hover:text-white transition duration-300"
                    }  focus:outline-none mx-4`}
                    onClick={() => switchCardHandle("prev")}
                  >
                    <KeyboardArrowLeftIcon fontSize="large" />
                  </button>
                  <button
                    disabled={
                      currentCard === listCardsLearning.length ? true : false
                    }
                    className="mx-4 hover:bg-blue-500 rounded-full hover:text-white transition duration-300 focus:outline-none"
                    onClick={() => switchCardHandle("next")}
                  >
                    <KeyboardArrowRightIcon fontSize="large" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* show hint  */}
        {isAddHintFormOpen ? (
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 backdrop-filter backdrop-blur-xs -mt-12">
            <div className="h-screen w-full absolute flex items-center justify-center bg-modal">
              <div className="bg-white rounded-lg shadow-md border-2 border-gray-300 max-w-xs max-h-full text-center">
                <div className="relative mb-6">
                  <button
                    onClick={handelSaveHint}
                    className="absolute right-2 top-2"
                  >
                    <CloseIcon />
                  </button>
                </div>
                <div className="mb-8">
                  <QuillNoSSRWrapper
                    theme="bubble"
                    value={cardHint}
                    onChange={setCardHint}
                    className="w-72 h-64 "
                    placeholder="notes something..."
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {/* show modal edit card */}
        {isEditCardFromOpen ? (
          <div className="justify-center items-center flex flex-row overflow-x-hidden overflow-y-auto fixed inset-0 z-50 backdrop-filter backdrop-brightness-50 -mt-12 ">
            <div className="mx-2 py-2 rounded-md bg-white">
              <div className=" grid lg:grid-cols-2 grid-cols-1 gap-4 px-6 py-2">
                <div className="col-span-1 flex lg:my-2 my-4">
                  <QuillNoSSRWrapper
                    modules={modules}
                    formats={formats}
                    theme="snow"
                    className="editor relative mb-12"
                    placeholder="front side content"
                    onChange={setFrontContent}
                    value={frontContent}
                  />
                </div>
                <div className="col-span-1 flex  lg:my-2 my-4">
                  <QuillNoSSRWrapper
                    modules={modules2}
                    formats={formats}
                    theme="snow"
                    className="editor relative mb-12"
                    onChange={setBackContent}
                    value={backContent}
                  />
                </div>
              </div>
              <div className="flex justify-end px-6 pb-2">
                <button
                  className="bg-gray-100 border-2 text-gray-700 w-28 py-1 mr-1 rounded-sm text-sm font-medium hover:bg-gray-300"
                  type="button"
                  onClick={() => setIsEditCardFromOpen(false)}
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
      </AppLayput2>
    </div>
  );
};
export default learn;
