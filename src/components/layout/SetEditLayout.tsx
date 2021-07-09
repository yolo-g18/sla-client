import { useEffect, useState } from "react";
import AppLayput2 from "../../components/layout/AppLayput2";
import InputGroup from "../../components/input/InputGroup";
import InputArea from "../../components/input/InputArea";
import ReactTagInput from "@pathofdev/react-tag-input";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import "@pathofdev/react-tag-input/build/index.css";
import "react-quill/dist/quill.snow.css";
import { PARAMS } from "../../common/params";
import { ALERT } from "../../redux/types/alertType";
import { postAPI, putAPI } from "../../utils/FetchData";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "../../utils/TypeScript";
import { useRouter } from "next/router";

import _, { divide } from "lodash";
import { ICard, IErrors } from "../../utils/TypeScript";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.bubble.css";

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

const SetEditLayout = () => {
  const { auth, alert } = useSelector((state: RootStore) => state);
  const router = useRouter();
  const dispatch = useDispatch();

  //   const id: number;

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [limit, setLimit] = useState("0");
  const [isPublic, setIsPublic] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [cards, setCards] = useState<ICard[]>([]);
  const [errors, setErrors] = useState<any>({});
  const [isFront, setIsFront] = useState(true);

  const [text, setText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  // ======================================
  //when user edit studyset
  const [studySet, setStudySet] = useState({});
  if (router.pathname.indexOf(`/set/${IDBFactory}`) !== -1) {
    const {
      query: { id },
    } = router;
  }
  // ===================================
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPublic(!isPublic);
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
    let size = _.toNumber(limit);
    if (isNaN(size) || size < 0) {
      setErrors({
        ...errors,
        limit: "Number of cards must be positive number",
      });
    } else {
      setErrors({
        ...errors,
        limit: "",
      });
      let tempCards = [];
      for (let i = 0; i < size; i++) {
        tempCards.push({ front: "", back: "" });
        setCards(tempCards);
      }
    }
  }, [limit]);

  //handel submit form
  const handleSubmit = async (e: any) => {
    setErrors({
      ...errors,
      limit: "",
      title: "",
    });

    //check limit valid

    //check title valid
    if (!title) {
      setErrors({
        ...errors,
        title: "Title is required",
      });
    }

    if (title.length > 20) {
      setErrors({
        ...errors,
        title: "Title cannot exceed 20 characters",
      });
    }

    e.preventDefault();

    //create null card by limit input

    let publicValue = isPublic ? 1 : 0;

    const data = {
      creator: auth.userResponse?._id,
      title,
      description: desc,
      tag: _.map(tags).join(", "),
      cards,
      isPublic: publicValue,
    };

    dispatch({ type: ALERT, payload: { loading: true } });
    try {
      const res = await postAPI(`${PARAMS.ENDPOINT}studySet/create`, data);
      dispatch({ type: ALERT, payload: { loading: false } });
      router.push({
        pathname: "/set/[id]/edit",
        query: { pid: res.data.id },
      });
    } catch (err) {
      dispatch({ type: ALERT, payload: { errors: err.response.data } });
    }

    console.log(data);
  };

  console.log(tags);

  return (
    <div>
      <AppLayput2 title="create set" desc="create set">
        <div className="lg:w-3/4 mx-auto h-full mt-4 px-4">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-around">
              <div className="flex flex-grow">
                <h1 className="text-3xl font-semibold">Create Study Set</h1>
              </div>
              <div className="flex relative">
                <button
                  className="bg-green-500 text-white w-28 py-1 rounded-md text-sm font-medium hover:bg-green-600"
                  // onClick={handleSubmit}
                >
                  {router.pathname.indexOf("/set/add") !== -1
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
                          error={errors.title}
                          required
                        />
                      </div>
                      <div className="lg:col-span-1 col-span-1">
                        <InputGroup
                          type="text"
                          setValue={setLimit}
                          placeholder="your last name"
                          value={limit}
                          label="Limit"
                          error={errors.limit}
                          // disabled={!isHide}
                        />
                        <p className="text-gray-600 text-xs px-1 -mt-3 mb-2">
                          Limit number of card in your set, you can add more
                          card later
                        </p>
                      </div>
                    </div>

                    <div className=" w-full">
                      <InputArea
                        setValue={setDesc}
                        placeholder="study set de"
                        // error={alert.errors?.errors?.bio}
                        value={desc}
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
                          name="isPublic"
                          color="default"
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
                    <div className="mt-1 py-1 ">
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
          {!isHide ? (
            <div className="h-full mt-4">
              <h1 className="text-md mt-4 mb-2">Add cards</h1>
              <hr />
              <div className=" w-full">
                {cards.map((card, index) => {
                  return (
                    <div className="h-64 rounded-xl grid grid-cols-2 gap-4 my-4">
                      <div
                        className="col-span-1 rounded-xl bg-gray-200"
                        onClick={() => {
                          setIsFront(true);
                          handelCardOnClick(card.front, index);
                        }}
                      >
                        <QuillNoSSRWrapper
                          readOnly={true}
                          theme="bubble"
                          value={card.front}
                        />
                      </div>
                      <div
                        className="col-span-1 rounded-xl bg-gray-200"
                        onClick={() => {
                          setIsFront(false);
                          handelCardOnClick(card.back, index);
                        }}
                      >
                        <QuillNoSSRWrapper
                          readOnly={true}
                          theme="bubble"
                          value={card.back}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* popup editor */}
          {showModal ? (
            <>
              <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 backdrop-filter backdrop-blur-xs -mt-12">
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
                    <div className="flex items-center justify-end px-4 py-6">
                      <button
                        className="bg-gray-100 border-2 text-gray-700 w-28 py-1 mr-1 rounded-md text-sm font-medium hover:bg-gray-300"
                        type="button"
                        onClick={() => setShowModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className=" bg-green-500 text-white w-28 py-1 ml-1 rounded-md text-sm font-medium hover:bg-green-600"
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
      </AppLayput2>
    </div>
  );
};

export default SetEditLayout;
