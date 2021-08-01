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
import { useClickOutside } from "../../../hook/useClickOutside";

//alert
function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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

const learn = () => {
  const { auth, alert } = useSelector((state: RootStore) => state);
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

  const qValueArr = [
    "bg-green-300",
    "bg-blue-300",
    "bg-purple-300",
    "bg-pink-300",
    "bg-red-300",
    "bg-yellow-300",
  ];

  const router = useRouter();
  //lay ra id tu path
  const {
    query: { id }, //id of folder get from path
  } = router;

  //fecth to get cards
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const listCardLearingRes = await getAPI(
          `${PARAMS.ENDPOINT}learn/continue/studySet?id=${id}`
        );
        dispatch({ type: ALERT, payload: { loading: false } });

        setListCardsLearning(listCardLearingRes.data);
        setCardHint(listCardsLearning[currenrCard].hint);
      } catch (err) {
        console.log("error is: " + err);
      }
    };
    fetchData();
    setIsChange(false);
  }, [id, isChange]);

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

  console.log("mat trc la: " + listCardsLearning[0]);

  //ask user continue or review
  // const hand;

  //switch card
  const switchCardHandle = (type: string) => {
    if (type === "next" && currenrCard < listCardsLearning.length) {
      setIsFlipped(false);
      setCurrentCard(currenrCard + 1);
      currenrCard >= listCardsLearning.length
        ? setShowLearningResultModal(true)
        : setShowLearningResultModal(false);
    }
    if (type === "prev" && currenrCard >= 0) {
      setIsFlipped(false);
      setCurrentCard(currenrCard - 1);
    }
  };

  //send q
  const handelResultUserSelect = async (q_value: number) => {
    console.log("q is: " + q_value);

    const data = {
      q: q_value,
      cardId: listCardsLearning[currenrCard].cardId,
    };

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

  return (
    <div>
      <AppLayput2 title="learn" desc="dd">
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 -mt-20 px-2">
          <div className="h-3/5 2xl:w-2/5 x md:w-1/2 sm:w-2/3 w-full rounded-md">
            <div className="mb-8">
              <Link
                href={{
                  pathname: "/set/[id]",
                  query: { id: id },
                }}
              >
                <button className="hover:underline hover:text-gray-800">
                  Back to set
                </button>
              </Link>
            </div>
            <div className="justify-center items-center flex font-sans text-xl mb-8">
              <p className="fixed">Practice Your Card</p>
            </div>
            <div className="flex justify-between w-full mb-2">
              <div className="px-1">
                <h1>
                  {currenrCard + 1}/{listCardsLearning.length}
                </h1>
              </div>
              <div className="flex ">
                <div ref={domNode}>
                  <button className="px-1" onClick={handelExpandMoreBtnClick}>
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
                <div>
                  <button className="">
                    <VolumeDownIcon />
                  </button>
                </div>
              </div>
            </div>
            <div className="">
              {listCardsLearning.map((card, index) => {
                if (index === currenrCard)
                  return (
                    <ReactCardFlip
                      isFlipped={isFlipped}
                      flipDirection="vertical"
                    >
                      <div onClick={flipCardHandel}>
                        <QuillNoSSRWrapper
                          className="h-96 bg-white shadow-md rounded-md border-2 border-gray-200 transition-opacity duration-500 "
                          readOnly={true}
                          theme="bubble"
                          value={card.front}
                        />
                      </div>
                      <div onClick={flipCardHandel}>
                        <QuillNoSSRWrapper
                          className="h-96 bg-white shadow-md rounded-md border-2 border-gray-200 transition-opacity duration-500"
                          readOnly={true}
                          theme="bubble"
                          value={card.back}
                        />
                      </div>
                    </ReactCardFlip>
                  );
              })}
            </div>

            <div className="justify-center items-center flex mt-8">
              {qValueArr.map((qValue, index) => {
                return (
                  <button
                    onClick={() => handelResultUserSelect(index)}
                    key={index}
                    className={`w-1/6 mx-2 h-8 px-4 py-1 rounded-xl transition duration-300 hover:bg-gray-200 ${qValue} focus:outline-none`}
                  ></button>
                );
              })}
            </div>
            <div className="justify-center items-center flex mt-6 ">
              <button
                disabled={currenrCard === 0 ? true : false}
                className={`${
                  currenrCard === 0
                    ? "text-gray-300"
                    : "hover:bg-green-500 rounded-full hover:text-white transition duration-300"
                }  focus:outline-none mx-4`}
                onClick={() => switchCardHandle("prev")}
              >
                <KeyboardArrowLeftIcon fontSize="large" />
              </button>
              <button
                disabled={
                  currenrCard === listCardsLearning.length ? true : false
                }
                className="mx-4 hover:bg-green-500 rounded-full hover:text-white transition duration-300 focus:outline-none"
                onClick={() => switchCardHandle("next")}
              >
                <KeyboardArrowRightIcon fontSize="large" />
              </button>
            </div>
            <div>
              <small className="font-medium justify-center items-center flex italic">
                dasd
              </small>
            </div>
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
                  className=" bg-green-500 text-white w-28 py-1 ml-1 rounded-md text-sm font-medium hover:bg-green-600"
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
