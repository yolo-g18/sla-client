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
import { route } from "next/dist/next-server/server/router";
import { RouterRounded } from "@material-ui/icons";
import { FormGroup, Grid, Typography } from "@material-ui/core";
import { withStyles, Theme, createStyles } from "@material-ui/core/styles";

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
  "video",
];

const AntSwitch = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 28,
      height: 16,
      padding: 0,
      display: "flex",
    },
    switchBase: {
      padding: 2,
      color: theme.palette.grey[500],
      "&$checked": {
        transform: "translateX(12px)",
        color: theme.palette.common.white,
        "& + $track": {
          backgroundColor: "#1976d2",
          opacity: 1,
          border: "none",
        },
      },
    },
    thumb: {
      width: 12,
      height: 12,
      boxShadow: "none",
    },
    track: {
      border: `1px solid ${theme.palette.grey[500]}`,
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor: theme.palette.common.white,
    },
    checked: {},
  })
)(Switch);

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
      setIsToastOpen(true);
      setTypeToast("warning");
      setMessageToast("Please make sure the uploaded file is less than 5MB");
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
          ["link", "image", "video"],
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
          dispatch({ type: ALERT, payload: { loading: false } });
        } catch (err) {
          console.log("error is: " + err);

          // router.push("/");
        }
      };
      fetchData();
    }, [props.id, isReset, creatorName]);
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
    if (title.trim().length <= 0) {
      setTitleErr("Title is required.");
    } else if (title.trim().length > 50) {
      setTitleErr("Title can not exceed 50 characters.");
    } else {
      setTitleErr("");
    }

    if (desc.trim().length > 250) {
      setDescErr("Description can not exceed 250 characters.");
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
      title: title.trim(),
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
        title: title.trim(),
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
    listCardsId.push(cards[index].cardId);
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

  const [showModalConfirm, setShowModalConfirm] = useState(false);

  const confirmCancel = () => {
    if (router.pathname.indexOf("/set/add") === -1)
      router.push(`/set/${props.id}`);
    else router.push(`/${auth.userResponse?.username}/library/sets`);
  };

  if (
    auth.userResponse?.username !== creatorName &&
    router.pathname.indexOf("/set/add") === -1 &&
    creatorName
  ) {
    return (
      <AppLayput2
        title={`${
          router.pathname.indexOf("/set/add") !== -1 ? "create set" : title
        }`}
        desc="create set"
      >
        <div className="text-center px-2 mb-44">
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
        </div>
      </AppLayput2>
    );
  }

  if (
    router.pathname.indexOf("/set/add") !== -1 ||
    (creatorName && router.pathname.indexOf("/set/add") === -1)
  )
    return (
      <div>
        <AppLayput2
          title={`${
            router.pathname.indexOf("/set/add") !== -1 ? "create set" : title
          }`}
          desc="create set"
        >
          {alert.loading === true ? (
            <div
              className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed 
          inset-0 z-50 backdrop-filter backdrop-blur-md -mt-96"
            >
              <div className="h-screen w-full absolute flex items-center justify-center bg-modal">
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
            </div>
          ) : (
            <div className="lg:w-3/4 mx-auto mt-8 px-4 h-full">
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
                    <button
                      onClick={() => setShowModalConfirm(true)}
                      className="bg-gray-100 border-2 text-gray-700 w-28 py-1 mx-4 rounded-sm text-sm font-medium hover:bg-gray-300"
                      type="button"
                    >
                      Back to set
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowModalConfirm(true)}
                      className="bg-gray-100 border-2 text-gray-700 w-28 py-1 mx-4 rounded-sm text-sm font-medium hover:bg-gray-300"
                      type="button"
                    >
                      Cancel
                    </button>
                  )}

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
                          placeholder="Description"
                          // error={alert.errors?.errors?.bio}
                          value={desc}
                          error={descErr}
                          label="Description"
                        />
                      </div>
                    </div>
                    <div className="px-2 mt-4">
                      {/* <FormControlLabel
                        control={
                          <Switch
                            checked={isPublic}
                            onChange={handleChange}
                            color="primary"
                            name="isPublic"
                          />
                        }
                        label="Public"
                      /> */}
                      <FormGroup>
                        <Typography component="div">
                          <Grid
                            component="label"
                            container
                            alignItems="center"
                            spacing={2}
                          >
                            <p className="text-sm font-medium text-gray-700">
                              Private
                            </p>
                            <Grid item>
                              <AntSwitch
                                checked={isPublic}
                                onChange={handleChange}
                                name="checkedC"
                              />
                            </Grid>
                            <p className="text-sm font-medium text-gray-700">
                              Public
                            </p>
                          </Grid>
                        </Typography>
                      </FormGroup>
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
              {router.pathname.indexOf("/set/add") !== -1 ? (
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
                    </div>
                  </div>
                  <hr />
                  <div className=" w-full mb-44">
                    {cards.map((card, index) => {
                      return (
                        <div
                          key={index}
                          className="rounded-md flex w-full my-4"
                        >
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
                              <span className="tooltiptext mt-2 w-20">
                                remove
                              </span>
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
              ) : null}

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
                <div className="bg-white rounded-md shadow p-6 m-4 max-w-xs max-h-full text-center">
                  <div className="mb-8">
                    <p className="text-xl font-semibold">
                      Are you sure want to save?
                    </p>
                    <small>Your change will be save</small>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={() => setShowModaleComfirmModal(false)}
                      className="  w-32 py-1 mx-4 rounded-sm bg-gray-100 border-2 text-gray-700 focus:outline-none hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="text-white w-32 rounded-sm mx-4 bg-blue-500 hover:bg-blue-600 focus:outline-none"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {showModalConfirm ? (
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 backdrop-filter backdrop-brightness-50 -mt-12">
              <div className=" w-full absolute flex items-center justify-center bg-modal">
                <div className="bg-white rounded-lg shadow p-6 m-4 max-w-xs max-h-full text-center">
                  <div className="mb-8">
                    <p className="text-xl font-semibold">
                      Are you sure want cancel?
                    </p>
                    <small>Your changes have not been saved</small>
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => setShowModalConfirm(false)}
                      className="  w-32 py-1 mx-4 rounded-sm bg-gray-100 border-2 text-gray-700 focus:outline-none hover:bg-gray-300"
                    >
                      No
                    </button>
                    <button
                      onClick={confirmCancel}
                      className="text-white w-32 rounded-sm mx-4 bg-blue-500 hover:bg-blue-600 focus:outline-none"
                    >
                      Yes
                    </button>
                  </div>
                </div>
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
        </AppLayput2>
      </div>
    );
  else
    return (
      <AppLayput2
        title={`${
          router.pathname.indexOf("/set/add") !== -1 ? "create set" : title
        }`}
        desc="create set"
      >
        <div
          className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed 
  inset-0 z-50 backdrop-filter backdrop-blur-md -mt-96"
        >
          <div className="h-screen w-full absolute flex items-center justify-center bg-modal">
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
        </div>
      </AppLayput2>
    );
};

export default SetEditLayout;
