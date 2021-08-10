import Link from "next/link";
import AppLayput2 from "../../../components/layout/AppLayout";
import dynamic from "next/dynamic";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import VolumeDownIcon from "@material-ui/icons/VolumeDown";
import { useEffect, useRef, useState } from "react";
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

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>...</p>,
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
  const [isSetColorFromOpen, setIsSetColorFromOpen] = useState(false);
  const [listCardsLearning, setListCardsLearning] = useState<ICardLearning[]>(
    []
  );
  const [currenrCard, setCurrentCard] = useState(0);
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
  const [ssCreator, setSsCreator] = useState("");

  const [isContinue, setIsContinue] = useState(false);
  const [overralProgress, setOverralProgress] = useState(0);

  // to count number of q > 3
  const [listQ, setListQ] = useState<{ index: number; q: number }[]>([]);

  const qValueArr = ["sosad", "sad", "neutral", "grinning", "smile", "happy"];

  const router = useRouter();
  //lay ra id tu path
  const {
    query: { id }, //id of folder get from path
  } = router;

  const [isLearnByDay, setIsLearnByday] = useState(false);

  //fecth to get cards
  useEffect(() => {
    if (!id) {
      return;
    }
    const fetchData = async () => {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const studySetRes = await getAPI(
          `${PARAMS.ENDPOINT}studySet/view?id=${id}`
        );
        dispatch({ type: ALERT, payload: { loading: false } });
        setStudySetTitle(studySetRes.data.title);
        setSsCreator(studySetRes.data.creatorName);

        dispatch({ type: ALERT, payload: { loading: true } });
        const listCardLearingRes = await getAPI(
          `${PARAMS.ENDPOINT}learn/continue?studySetId=${id}`
        );

        setListCardsLearning(listCardLearingRes.data.listCardLearning);
        setOverralProgress(listCardLearingRes.data.progress);
        if (!learn.isDone) {
          console.log("tai sao nhay vao day");

          const listCardLearingRes = await getAPI(
            `${PARAMS.ENDPOINT}learn/learnByDate?studySet=${
              learn.ssID
            }&date=${convertTimeEvnLearn(learn.learnDate)}`
          );
          if (listCardLearingRes.data.length)
            setListCardsLearning(listCardLearingRes.data);
        }
        setIsContinue(false);
        dispatch({ type: ALERT, payload: { loading: false } });
        console.log("legth: " + listCardsLearning.length);
        setCardHint(
          listCardsLearning[currenrCard]
            ? listCardsLearning[currenrCard].hint
            : ""
        );
      } catch (err) {
        console.log("error is: " + err);
        // router.push("/error");
      }
    };
    fetchData();
    setIsChange(false);
  }, [id, isChange, isContinue]);

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

  let domNode = useClickOutside(() => {
    setIsMenuOpen(false);
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
      cardId: listCardsLearning[currenrCard].cardId,
    };

    let listQTemp: { index: number; q: number }[] = [...listQ];
    const listCheck = listQTemp.filter((tq) => tq.index === currenrCard);
    if (listCheck.length === 0) {
      listQTemp.push({ index: currenrCard, q: q_value });
    } else {
      listQTemp.map((qt) => {
        if (qt.index === currenrCard) qt.q = q_value;
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
    setFrontContent(listCardsLearning[currenrCard].front);
    setBackContent(listCardsLearning[currenrCard].back);
  };

  //save hint when close modal hint
  const handelSaveHint = async () => {
    if (cardHint === listCardsLearning[currenrCard].hint) {
      setIsAddHintFormOpen(false);
      return;
    }
    const data = {
      id: listCardsLearning[currenrCard].cardId,
      hint: cardHint,
    };

    console.log("hint is: " + cardHint);

    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      const res = await postAPI(`${PARAMS.ENDPOINT}card/writeHint`, data);
      dispatch({ type: ALERT, payload: { loading: false } });
      setIsChange(true);
    } catch (err) {
      setMessageToast("An error occurred");
      setTypeToast("error");
      setIsToastOpen(true);
    }
    setIsAddHintFormOpen(false);
  };

  //open hint modal
  const openHintModal = () => {
    setIsAddHintFormOpen(true);
    setCardHint(listCardsLearning[currenrCard].hint);
  };

  const [switching, setSwitching] = useState(false);
  const switchCardHandle = (type: string) => {
    setSwitching(true);
    if (type === "next" && currenrCard < listCardsLearning.length) {
      setIsFlipped(false);
      setCurrentCard(currenrCard + 1);
      currenrCard + 1 >= listCardsLearning.length
        ? setShowLearningResultModal(true)
        : setShowLearningResultModal(false);
    }
    if (type === "prev" && currenrCard >= 0) {
      setIsFlipped(false);
      setCurrentCard(currenrCard - 1);
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

  useEffect(() => {
    if (
      rating === 0 &&
      Math.round(overralProgress * 100) === 100 &&
      auth.userResponse?.username !== ssCreator
    )
      setShowModalFeedback(true);
  }, [showLearningResultModal]);

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
                Review card at{" "}
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
                <div className="justify-center items-center flex text-gray-700 font-bold text-xl mb-4 w-full">
                  <p>Practice Your Card</p>
                </div>
                <div className="flex justify-between w-full mb-2">
                  <div className="px-1">
                    <h1>
                      {currenrCard + 1}/{listCardsLearning.length}
                    </h1>
                  </div>
                  <div className="flex ">
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
                              <a
                                className="block px-4 py-1 font-medium text-sm text-gray-700 cursor-pointer
                             hover:bg-blue-500 hover:text-white dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600"
                                role="menuitem"
                                onClick={() => setIsSetColorFromOpen(true)}
                              >
                                <span className="flex flex-col">
                                  <span>set color</span>
                                </span>
                              </a>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                    {/* <div>
                      <button className="">
                        <VolumeDownIcon />
                      </button>
                    </div> */}
                  </div>
                </div>
                <div>
                  {listCardsLearning.map((card, index) => {
                    if (index === currenrCard)
                      return (
                        <ReactCardFlip
                          isFlipped={isFlipped}
                          flipDirection="vertical"
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
                    *How well did you know this?
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
                    disabled={currenrCard === 0 ? true : false}
                    className={`${
                      currenrCard === 0
                        ? "text-gray-300"
                        : "hover:bg-blue-500 rounded-full hover:text-white transition duration-300"
                    }  focus:outline-none mx-4`}
                    onClick={() => switchCardHandle("prev")}
                  >
                    <KeyboardArrowLeftIcon fontSize="large" />
                  </button>
                  <button
                    disabled={
                      currenrCard === listCardsLearning.length ? true : false
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
          <div className="justify-center items-center flex flex-row overflow-x-hidden overflow-y-auto fixed inset-0 z-50 backdrop-filter backdrop-blur-xs -mt-12 ">
            <div className="lg:h-1/2 py-6 rounded-xl px-4 bg-white">
              <div className=" grid lg:grid-cols-2 grid-cols-1 gap-4">
                <div className="col-span-1 flex lg:my-2 my-4">
                  <QuillNoSSRWrapper
                    modules={modules}
                    formats={formats}
                    theme="snow"
                    className="max-h-80 relative mb-12 "
                    onChange={setFrontContent}
                    value={frontContent}
                  />
                </div>
                <div className="col-span-1 flex  lg:my-2 my-4">
                  <QuillNoSSRWrapper
                    modules={modules}
                    formats={formats}
                    theme="snow"
                    className="max-h-80 border-0 relative mb-12"
                    onChange={setBackContent}
                    value={backContent}
                  />
                </div>
              </div>
              <div className="flex justify-end px-4">
                <button
                  className="bg-gray-100 border-2 text-gray-700 w-28 py-1 mr-1 rounded-md text-sm font-medium hover:bg-gray-300"
                  type="button"
                  onClick={() => setIsEditCardFromOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className=" bg-blue-500 text-white w-28 py-1 ml-1 rounded-md text-sm font-medium hover:bg-blue-600"
                  type="button"
                  // onClick={handleCardSave}
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
