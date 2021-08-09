import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
import { deleteAPI, getAPI, postAPI, putAPI } from "../../utils/FetchData";
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
import { useMemo } from "react";

//alert
function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

interface ITag {
  id: string;
  text: string;
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
  "link",
  "image",
];

interface Props {
  id?: any;
}

const SetEditLayout = (props: Props) => {
  const { auth, alert } = useSelector((state: RootStore) => state);
  const dispatch = useDispatch();

  //   const id: number;

  const [title, setTitle] = useState("Untitled");
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
  const [isChange, setIsChange] = useState(false);
  const [listCardsDelete, setListCardsDelete] = useState<number[]>([]);
  const [showModaleComfirmModal, setShowModaleComfirmModal] = useState(false);

  const [isReset, setIsReset] = useState(false);

  const router = useRouter();

  const editorRef = useRef<any>(null);

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

  const insertToEditor = (url: string) => {
    if (editorRef.current) {
      editorRef.current.getEditor().insertEmbed(null, "image", url);
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
          dispatch({ type: ALERT, payload: { loading: false } });
          setIsReset(false);
          setListCardsDelete([]);
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
    }, [props.id, isReset]);
  }

  // ===================================
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPublic(!isPublic);
    console.log("public: " + isPublic);
  };

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
    setIsChange(true);

    console.log("cards are: " + cards);
    console.log("This card is front" + isFront);
  };

  useEffect(() => {
    if (title.length <= 0) {
      setTitleErr("Title is required.");
    } else if (title.length > 50) {
      setTitleErr("Title cannot exceed 50 character.");
    } else {
      setTitleErr("");
    }

    if (desc.length > 250) {
      setDescErr("Description cannot exceed 250 characters.");
    } else {
      setDescErr("");
    }
  }, [title, desc]);

  //delete card by id
  const deleteCardById = async (id: number) => {
    try {
      const res = await deleteAPI(`${PARAMS.ENDPOINT}card/delete?id=${id}`);
    } catch (err) {
      setMessageToast("An error occurred");
      setTypeToast("error");
      setIsToastOpen(true);
    }
  };

  console.log("id:" + listCardsDelete);

  //handel submit form
  const handleSubmit = async (e: any) => {
    console.log("tt: " + titleErr + " desc: " + descErr);

    if (titleErr || descErr) return;

    const addData = {
      creator: auth.userResponse?._id,
      title,
      description: desc,
      tag: _.map(tags).join(", "),
      cards,
      isPublic: isPublic,
    };

    //check delete card
    if (router.pathname.indexOf("/set/add") !== -1) {
      //add
      try {
        console.log("data: " + JSON.stringify(addData));

        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await postAPI(`${PARAMS.ENDPOINT}studySet/create`, addData);
        dispatch({
          type: ALERT,
          payload: { loading: false, success: "😎 Your study set created!" },
        });

        router.push({
          pathname: "/set/[id]",
          query: { id: res.data },
        });
      } catch (err) {
        console.log("err: " + err);

        dispatch({ type: ALERT, payload: { errors: err.response.data } });
        setIsToastOpen(true);
        setTypeToast("error");
        ("An error occurred");
      }
    } else {
      //check list card delete
      if (listCardsDelete.length !== 0) {
        listCardsDelete.map((id) => {
          deleteCardById(id);
        });
      }

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
        dispatch({
          type: ALERT,
          payload: { loading: false, success: "😎 Update successful!" },
        });
        router.push({
          pathname: "/set/[id]",
          query: { id: props.id },
        });
      } catch (err) {
        console.log(err);

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

    let listCardsId: any[] = [...listCardsDelete];
    listCardsId.push(cards[index].id);
    setListCardsDelete(listCardsId);
  };

  const deleteAll = () => {
    let tempCards: ICard[] = [];
    for (let i = 0; i < 2; i++) {
      tempCards.push({ front: "", back: "" });
      setCards(tempCards);
      setShowModalRemoveAll(false);
    }
  };

  //handle add card
  const addMoreCard = async () => {
    let cardstemp: ICard[] = [...cards];
    if (router.pathname.indexOf("/set/add") !== -1) {
      let cardstemp: ICard[] = [...cards];
      cardstemp.push({ front: "", back: "" });
      setCards(cardstemp);
    } else {
      const cardDataAdd = [
        {
          studySet: props.id,
          front: "",
          back: "",
        },
      ];
      try {
        const cardsAddRes = await postAPI(
          `${PARAMS.ENDPOINT}card/create`,
          cardDataAdd
        );
        const cardRes = await getAPI(
          `${PARAMS.ENDPOINT}card/list?id=${props.id}`
        );
        setTypeToast("success");
        setMessageToast("😎 Add successful!");
        setIsToastOpen(true);
        setCards(cardRes.data);
      } catch (err) {
        console.log(err);
      }
    }
  };

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
          <div className="lg:w-3/4 mx-auto mt-4 px-4 h-full">
            <div className="flex justify-between">
              <div className="flex flex-grow">
                <h1 className="text-3xl font-semibold">
                  {router.pathname.indexOf("/set/add") !== -1
                    ? "Create Study Set"
                    : "Edit Your Set"}
                </h1>
              </div>
              <div className="flex">
                {router.pathname.indexOf("/set/add") === -1 ? (
                  <Link href={`/set/${props.id}`}>
                    <button
                      className="bg-gray-100 border-2 text-gray-700 w-28 py-1 mx-4 rounded-sm text-sm font-medium hover:bg-gray-300"
                      type="button"
                    >
                      Back to set
                    </button>
                  </Link>
                ) : null}

                <button
                  onClick={
                    router.pathname.indexOf("/set/add") === -1
                      ? () => setShowModaleComfirmModal(true)
                      : (e) => handleSubmit(e)
                  }
                  className="bg-blue-500 text-white w-28 py-1 rounded-sm text-sm font-medium hover:bg-blue-600"
                >
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
            <div className="h-full mt-4 w-full">
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
                      className={`
            text-white w-24 py-1 rounded-sm text-sm font-medium  focus:outline-none
             ${
               cards.length <= 2
                 ? "bg-gray-300"
                 : "bg-yellow-500 hover:bg-yellow-600"
             }`}
                      disabled={cards.length <= 2}
                    >
                      {alert.loading ? "Saving..." : "Remove all"}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsReset(true);
                        setIsChange(false);
                      }}
                      className={` tooltip text-white w-20 py-1 rounded-sm text-sm font-medium  focus:outline-none
                        ${
                          isChange || listCardsDelete.length !== 0
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-gray-300"
                        }`}
                      disabled={!(isChange || listCardsDelete.length !== 0)}
                    >
                      Reset
                      <span className="tooltiptext w-32">
                        Discard all Change
                      </span>
                    </button>
                  )}
                </div>
              </div>
              <hr />
              <div className=" w-full mb-44">
                {cards.map((card, index) => {
                  return (
                    <div key={index} className="rounded-md flex w-full my-4">
                      <div className="flex justify-between w-full gap-3">
                        <div
                          className="card-overview  w-1/2 rounded-md bg-white shadow-lg border-b-1 p-4 text-center"
                          dangerouslySetInnerHTML={{ __html: card.front }}
                          onClick={() => {
                            setIsFront(true);
                            handelCardOnClick(card.front, index);
                          }}
                        ></div>
                        <div
                          className="card-overview w-1/2  rounded-md bg-white shadow-lg border-b-1 p-4 text-center"
                          dangerouslySetInnerHTML={{ __html: card.back }}
                          onClick={() => {
                            setIsFront(false);
                            handelCardOnClick(card.back, index);
                          }}
                        ></div>
                      </div>

                      <div className="">
                        <button
                          onClick={() => handelDeleteCard(index)}
                          className="mx-2 tooltip focus:outline-none"
                        >
                          <DeleteOutlineIcon
                            fontSize="small"
                            className="hover:text-yellow-500 text-gray-700"
                          />
                          <span className="tooltiptext mt-2 w-20">remove</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
                <button
                  onClick={addMoreCard}
                  className="text-white w-32 py-2 mx-auto rounded-sm text-sm font-medium bg-blue-500 hover:bg-blue-600 mt-4 focus:outline-none"
                  type="button"
                >
                  Add more card
                </button>
              </div>
            </div>
            {/* show modal cf remove all */}
            {showModalRemoveAll ? (
              <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 backdrop-filter backdrop-brightness-50 -mt-12">
                <div className=" w-full absolute flex items-center justify-center bg-modal">
                  <div className="bg-white rounded-md shadow p-6 m-4 max-w-xs max-h-full text-center">
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
                        className=" text-white w-32 py-1 mx-4 rounded bg-blue-500 hover:bg-blue-600 focus:outline-none"
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
                      <div className="justify-between px-4 py-4 rounded-t">
                        <p>Card Content</p>
                      </div>
                      {/*body*/}
                      <div className="relative h-full px-4 flex flex-wrap">
                        <QuillNoSSRWrapper
                          modules={modules}
                          forwardedRef={editorRef}
                          formats={formats}
                          theme="snow"
                          value={text}
                          onChange={setText}
                          className="h-80"
                          style={{ width: "550px" }}
                        />
                      </div>
                      {/*footer*/}
                      <div className="flex items-center justify-end px-4 py-4 mt-12">
                        <button
                          className="bg-gray-100 border-2 text-gray-700 w-28 py-1 mr-1 rounded-md text-sm font-medium hover:bg-gray-300 focus:outline-none"
                          type="button"
                          onClick={() => setShowModal(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className=" bg-blue-500 text-white w-28 py-1 ml-1 rounded-md text-sm font-medium hover:bg-blue-600 focus:outline-none"
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
        {showModaleComfirmModal &&
        router.pathname.indexOf("/set/add") === -1 ? (
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 backdrop-filter backdrop-brightness-50 -mt-12">
            <div className=" w-full absolute flex items-center justify-center bg-modal">
              <div className="bg-white rounded-lg shadow p-6 m-4 max-w-xs max-h-full text-center">
                <div className="mb-8">
                  <p className="text-xl font-semibold">
                    Are you sure want to save?
                  </p>
                  <small>Your change will be save</small>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => setShowModaleComfirmModal(false)}
                    className="  w-32 py-1 mx-4 rounded bg-gray-100 border-2 text-gray-700 focus:outline-none hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="text-white w-32 rounded mx-4 bg-blue-500 hover:bg-blue-600 focus:outline-none"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <Snackbar
          open={isToastOpen}
          autoHideDuration={1000}
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
