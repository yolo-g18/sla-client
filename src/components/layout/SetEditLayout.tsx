import Link from "next/link";
import { useEffect, useState } from "react";
import AppLayput2 from "./AppLayout";
import InputGroup from "../../components/input/InputGroup";
import InputArea from "../../components/input/InputArea";
import ReactTagInput from "@pathofdev/react-tag-input";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import "@pathofdev/react-tag-input/build/index.css";
import "react-quill/dist/quill.snow.css";
import { PARAMS } from "../../common/params";
import { ALERT } from "../../redux/types/alertType";
import { getAPI, postAPI, putAPI } from "../../utils/FetchData";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "../../utils/TypeScript";
import { useRouter } from "next/router";

import _ from "lodash";
import { ICard, IErrors } from "../../utils/TypeScript";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.bubble.css";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { id } from "date-fns/locale";
//alert
function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

interface ITag {
  id: string;
  text: string;
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

interface Props {
  id?: any;
}

const SetEditLayout = (props: Props) => {
  const { auth, alert } = useSelector((state: RootStore) => state);
  const dispatch = useDispatch();

  //   const id: number;

  const [title, setTitle] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [desc, setDesc] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [cards, setCards] = useState<ICard[]>([]);
  const [isFront, setIsFront] = useState(true);

  const [text, setText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isToastOpen, setIsToastOpen] = useState(false);
  const [typeToast, setTypeToast] = useState("success");
  const [messageToast, setMessageToast] = useState("");

  const [titleErr, setTitleErr] = useState("");
  const [descErr, setDescErr] = useState("");
  const [showModalRemoveAll, setShowModalRemoveAll] = useState(false);

  const router = useRouter();

  //handel close toast
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setIsToastOpen(false);
  };

  useEffect(() => {
    let tempCards: ICard[] = [];
    for (let i = 0; i < 2; i++) {
      tempCards.push({ front: "", back: "" });
      setCards(tempCards);
    }
  }, []);

  // ======================================
  //when user edit studyset
  if (!(router.pathname.indexOf("/set/add") !== -1)) {
    console.log("this is edit page");
    console.log("id is: " + props.id);

    useEffect(() => {
      dispatch({ type: ALERT, payload: { loading: true } });
      const fetchData = async () => {
        try {
          const studySetRes = await getAPI(
            `${PARAMS.ENDPOINT}studySet/view?id=${props.id}`
          );
          const cardRes = await getAPI(
            `${PARAMS.ENDPOINT}card/list?id=${props.id}`
          );
          console.log("study set data is: " + JSON.stringify(studySetRes.data));
          console.log("study set data is: " + JSON.stringify(cardRes.data));
          dispatch({ type: ALERT, payload: { loading: false } });
          setTitle(studySetRes.data.title);
          setDesc(studySetRes.data.description);
          setCreatorName(studySetRes.data.creatorName);
          setIsPublic(studySetRes.data.public);
          studySetRes.data.tag
            ? setTags(_.split(studySetRes.data.tag, ", "))
            : null;
          setCards(cardRes.data);
        } catch (err) {
          console.log("error is: " + err);

          // router.push("/");
        }
      };
      fetchData();
    }, [props.id]);
  }

  // ===================================
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPublic(!isPublic);
    console.log("public: " + isPublic);
  };

  const [isHide, setIsHide] = useState(true);

  console.log("text of card: " + text);

  const handelCardOnClick = (cardContent: string, index: number) => {
    setShowModal(true);
    setText(cardContent);
    setCurrentIndex(index);
  };

  //save content from editor
  const handleCardSave = () => {
    if (isFront) {
      let cardsTemp: ICard[] = [...cards];
      cardsTemp[currentIndex].front = text;
      setCards(cardsTemp);
    } else {
      let cardsTemp: ICard[] = [...cards];
      cardsTemp[currentIndex].back = text;
      setCards(cardsTemp);
    }

    setShowModal(false);

    console.log("cards are: " + cards);
    console.log("This card is front" + isFront);
  };

  useEffect(() => {
    if (title.length <= 0) {
      setTitleErr("Title is required.");
    } else if (title.length > 20) {
      setTitleErr("Title cannot exceed 20 character.");
    } else {
      setTitleErr("");
    }

    if (desc.length > 150) {
      setDescErr("Description cannot exceed 150 characters.");
    } else {
      setDescErr("");
    }
  }, [title, desc]);

  console.log(cards);

  //handel submit form
  const handleSubmit = async (e: any) => {
    console.log("tt: " + titleErr + " desc: " + descErr);

    e.preventDefault();
    if (titleErr || descErr) return;

    //========create null card by limit input
    const addData = {
      creator: auth.userResponse?._id,
      title,
      description: desc,
      tag: _.map(tags).join(", "),
      cards,
      isPublic: isPublic,
    };

    console.log(addData);

    dispatch({ type: ALERT, payload: { loading: true } });
    if (router.pathname.indexOf("/set/add") !== -1) {
      //add
      try {
        const res = await postAPI(`${PARAMS.ENDPOINT}studySet/create`, addData);
        dispatch({ type: ALERT, payload: { loading: false } });

        setIsToastOpen(true);
        setTypeToast("success");
        setMessageToast("😎 Your study set updated!");

        router.push({
          pathname: "/set/[id]",
          query: { id: res.data },
        });
      } catch (err) {
        dispatch({ type: ALERT, payload: { errors: err.response.data } });
        setIsToastOpen(true);
        setTypeToast("error");
        setMessageToast("An error occurred");
      }
    } else {
      const dataUpdate = {
        ...addData,
        id: props.id,
      };
      const studySetData = {
        id: props.id,
        creator: auth.userResponse?._id,
        title,
        description: desc,
        tag: _.map(tags).join(", "),
        isPublic: isPublic,
      };
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const cardsUpdateRes = await putAPI(
          `${PARAMS.ENDPOINT}card/edit`,
          cards
        );
        const studySetUpdateRes = await putAPI(
          `${PARAMS.ENDPOINT}studySet/edit`,
          studySetData
        );
        dispatch({ type: ALERT, payload: { loading: false } });
        setIsToastOpen(true);
        setTypeToast("success");
        setMessageToast("😎 Your study set updated!");
        router.push({
          pathname: "/set/[id]",
          query: { id: props.id },
        });
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
        setIsToastOpen(true);
        setTypeToast("error");
        setMessageToast("An error occurred");
      }
    }
  };

  //handel delete card
  const handelDeleteCard = (index: number) => {
    let cardsTemp: ICard[] = [...cards];
    console.log("cards : " + JSON.stringify(cards));
    if (cardsTemp.length <= 2) {
      setIsToastOpen(true);
      setTypeToast("warning");
      setMessageToast("You need least two cards");
      return;
    }
    console.log("index: " + index);

    cardsTemp.splice(index, 1);
    console.log("temp2: " + JSON.stringify(cardsTemp));

    setCards(cardsTemp);
  };

  const deleteAll = () => {
    let tempCards: ICard[] = [];
    for (let i = 0; i < 2; i++) {
      tempCards.push({ front: "", back: "" });
      setCards(tempCards);
      setShowModalRemoveAll(false);
    }
  };

  const addMoreCard = () => {
    let cardstemp: ICard[] = [...cards];
    cardstemp.push({ front: "", back: "" });
    setCards(cardstemp);
  };

  // if (alert.loading === true) {
  //   return (
  //     <AppLayput2
  //       title={`${
  //         router.pathname.indexOf("/set/add") !== -1 ? "create set" : title
  //       }`}
  //       desc="create set"
  //     >
  //       Loading...
  //     </AppLayput2>
  //   );
  // }

  if (
    auth.userResponse?.username !== creatorName &&
    router.pathname.indexOf("/set/add") === -1
  ) {
    return (
      <AppLayput2
        title={`${
          router.pathname.indexOf("/set/add") !== -1 ? "create set" : title
        }`}
        desc="create set"
      >
        <h1 className="text-center mx-auto mt-20 text-3xl font-bold">
          Not permitted
        </h1>
      </AppLayput2>
    );
  }

  return (
    <div>
      <AppLayput2
        title={`${
          router.pathname.indexOf("/set/add") !== -1 ? "create set" : title
        }`}
        desc="create set"
      >
        {alert.loading === true ? (
          <div>
            <h1 className="text-center mx-auto mt-20 text-3xl font-bold">
              Loading...
            </h1>
          </div>
        ) : auth.userResponse?.username !== creatorName &&
          router.pathname.indexOf("/set/add") === -1 ? (
          <h1 className="text-center mx-auto mt-20 text-3xl font-bold">
            Not permitted
          </h1>
        ) : (
          <div className="lg:w-3/4 mx-auto mt-4 px-4 h-screen">
            <form onSubmit={handleSubmit}>
              <div className="flex justify-between">
                <div className="flex flex-grow">
                  <h1 className="text-3xl font-semibold">
                    {router.pathname.indexOf("/set/add") !== -1
                      ? "Create Study Set"
                      : "Edit Your Set"}
                  </h1>
                </div>
                <div className="flex relative">
                  {router.pathname.indexOf("/set/add") === -1 ? (
                    <Link href={`/set/${props.id}`}>
                      <button
                        className="bg-gray-100 border-2 text-gray-700 w-28 py-1 mx-4 rounded-md text-sm font-medium hover:bg-gray-300"
                        type="button"
                      >
                        Back to set
                      </button>
                    </Link>
                  ) : null}

                  <button className="bg-green-500 text-white w-28 py-1 rounded-md text-sm font-medium hover:bg-green-600">
                    {alert.loading
                      ? "Saving..."
                      : router.pathname.indexOf("/set/add") !== -1
                      ? "Create"
                      : "Update"}
                  </button>
                </div>
              </div>
              <div>
                <h1 className="text-md mt-4 mb-2">Study set Information</h1>
                <div className="grid lg:grid-cols-2 gap-4 grid-cols-1 h-1/3 mt-4">
                  <div className="col-span-1 justify-around">
                    <div className="flex flex-wrap my-1">
                      <div className="grid lg:grid-cols-3 gap-2 w-full">
                        <div className="lg:col-span-2 col-span-1">
                          <InputGroup
                            type="text"
                            setValue={setTitle}
                            placeholder={`enter a title like "Math01-Chap3"`}
                            value={title}
                            label="Title"
                            error={titleErr}
                            required
                          />
                        </div>
                      </div>
                      <div className=" w-full">
                        <InputArea
                          setValue={setDesc}
                          placeholder="study set de"
                          // error={alert.errors?.errors?.bio}
                          value={desc}
                          error={descErr}
                          label="Description"
                        />
                      </div>
                    </div>
                    <div className="px-1">
                      <FormControlLabel
                        control={
                          <Switch
                            checked={isPublic}
                            onChange={handleChange}
                            color="primary"
                            name="isPublic"
                          />
                        }
                        label="Public"
                      />
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="w-2/3">
                      <label className="text-gray-700 text-sm font-bold mb-2">
                        Tags
                      </label>
                      <div className="mt-1 py-1">
                        <ReactTagInput
                          tags={tags}
                          onChange={(newTags) => setTags(newTags)}
                          placeholder="Please enter to add tag"
                          maxTags={10}
                        />
                        <p className="text-gray-600 text-xs pt-1 mb-2">
                          Tag make your study set easier to search by other
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
            {true ? (
              <div className="h-full mt-4">
                <div className="flex justify-between">
                  <div className="mb-2">
                    <h1 className="text-md mt-4 ">Add cards</h1>
                    <small className="text-gray-500">
                      * Click into card to edit
                    </small>
                  </div>

                  <div className="flex my-auto">
                    <div className="mx-4 text-center my-auto py-1">
                      <p>{cards.length} cards</p>
                    </div>
                    {router.pathname.indexOf("/set/add") !== -1 ? (
                      <button
                        onClick={() => setShowModalRemoveAll(true)}
                        className={`bg-yellow-500 
            text-white w-24 py-1 rounded-md text-sm font-medium hover:bg-yellow-600 focus:outline-none
             ${cards.length <= 2 ? "bg-yellow-300" : ""}`}
                        disabled={cards.length <= 2}
                      >
                        {alert.loading ? "Saving..." : "Remove all"}
                      </button>
                    ) : null}
                  </div>
                </div>
                <hr />
                <div className=" w-full">
                  {cards.map((card, index) => {
                    return (
                      <div className="rounded-xl grid grid-cols-11 gap-4 my-4">
                        <div
                          className="col-span-5 rounded-xl bg-white shadow-lg hover:bg-indigo-50"
                          onClick={() => {
                            setIsFront(true);
                            handelCardOnClick(card.front, index);
                          }}
                        >
                          <QuillNoSSRWrapper
                            readOnly={true}
                            theme="bubble"
                            value={card.front}
                            className="w-64"
                          />
                        </div>
                        <div
                          className="col-span-5 rounded-xl bg-white shadow-lg hover:bg-indigo-50"
                          onClick={() => {
                            setIsFront(false);
                            handelCardOnClick(card.back, index);
                          }}
                        >
                          <QuillNoSSRWrapper
                            readOnly={true}
                            theme="bubble"
                            value={card.back}
                            className="w-64"
                          />
                        </div>
                        <div className="col-span-1">
                          <button
                            onClick={(event) => handelDeleteCard(index)}
                            className="mx-2 tooltip focus:outline-none"
                          >
                            <DeleteOutlineIcon
                              fontSize="small"
                              className="hover:text-yellow-500 text-gray-700"
                            />
                            <span className="tooltiptext mt-2 w-20">
                              remove
                            </span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={addMoreCard}
                  className="text-white w-32 py-2 mx-auto rounded-md text-sm font-medium bg-green-500 hover:bg-green-600 mt-4 focus:outline-none"
                  type="button"
                >
                  Add more card
                </button>
              </div>
            ) : null}
            {/* show modal cf remove all */}
            {showModalRemoveAll ? (
              <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 backdrop-filter backdrop-brightness-50 -mt-12">
                <div className=" w-full absolute flex items-center justify-center bg-modal">
                  <div className="bg-white rounded-lg shadow p-6 m-4 max-w-xs max-h-full text-center">
                    <div className="mb-8">
                      <p className="text-xl font-semibold">
                        Are you sure want to remove all all card of set?
                      </p>
                      <small>Your edits will not be saved!</small>
                    </div>

                    <div className="flex justify-center">
                      <button
                        onClick={deleteAll}
                        className="text-white w-32 rounded mx-4 bg-yellow-500 hover:bg-yellow-600 focus:outline-none"
                      >
                        Remove
                      </button>
                      <button
                        onClick={() => setShowModalRemoveAll(false)}
                        className=" text-white w-32 py-1 mx-4 rounded bg-green-500 hover:bg-green-600 focus:outline-none"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* popup editor */}
            {showModal ? (
              <>
                <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 backdrop-filter backdrop-brightness-50 -mt-12">
                  <div className="relative w-auto my-6 max-w-3xl">
                    {/*content*/}
                    <div className="border-0 rounded-lg shadow-md relative flex flex-col w-full bg-white outline-none focus:outline-none">
                      {/*header*/}
                      <div className="justify-between px-4 py-6 rounded-t">
                        <p>Card Content</p>
                      </div>
                      {/*body*/}
                      <div className="relative h-full px-4 flex flex-wrap">
                        <QuillNoSSRWrapper
                          modules={modules}
                          formats={formats}
                          theme="snow"
                          value={text}
                          onChange={setText}
                          className="h-96"
                        />
                      </div>
                      {/*footer*/}
                      <div className="flex items-center justify-end px-4 py-6 mt-12">
                        <button
                          className="bg-gray-100 border-2 text-gray-700 w-28 py-1 mr-1 rounded-md text-sm font-medium hover:bg-gray-300 focus:outline-none"
                          type="button"
                          onClick={() => setShowModal(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className=" bg-green-500 text-white w-28 py-1 ml-1 rounded-md text-sm font-medium hover:bg-green-600 focus:outline-none"
                          type="button"
                          onClick={handleCardSave}
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        )}
        <Snackbar
          open={isToastOpen}
          autoHideDuration={6000}
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
      </AppLayput2>
    </div>
  );
};

export default SetEditLayout;
