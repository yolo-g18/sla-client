import { useState } from "react";
import AppLayput2 from "../../components/layout/AppLayput2";
import InputGroup from "../../components/input/InputGroup";
import InputArea from "../../components/input/InputArea";
import ReactTagInput from "@pathofdev/react-tag-input";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import "@pathofdev/react-tag-input/build/index.css";

import _, { divide } from "lodash";
import { ICard } from "../../utils/TypeScript";

const KeyCodes = {
  comma: 188,
  enter: [10, 13],
};

interface ITag {
  id: string;
  text: string;
}

const add = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [limit, setLimit] = useState("0");
  const [isPublic, setIsPublic] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [cards, setCards] = useState<ICard[]>([]);
  const [errors, setErrors] = useState<any>({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPublic(!isPublic);
  };

  const [isHide, setIsHide] = useState(true);

  const handleSubmit = async (e: any) => {
    setErrors({
      ...errors,
      limit: "",
    });

    let size = _.toNumber(limit);

    if (isNaN(size) || size < 0) {
      setErrors({
        ...errors,
        limit: "Number of cards must be positive number",
      });
    }

    let tempCards = [];

    for (let i = 0; i < size; i++) {
      tempCards.push({ front: "2", back: "a" });
      setCards(tempCards);
    }

    console.log(cards);
    console.log(tags);

    // _.chunk(cards, [(size = limit)]);
    const data = {
      title,
      desc,
      tag: _.map(tags, "name").join(", "),
    };

    setIsHide(false);
  };

  return (
    <div>
      <AppLayput2 title="create set" desc="create set">
        <div className="lg:w-3/4 mx-auto h-full mt-4 px-4">
          <div className="flex justify-around">
            <div className="flex flex-grow">
              <h1 className="text-3xl font-semibold">Create Study Set</h1>
            </div>
            <div className="flex relative">
              <button
                className="bg-green-500 text-white w-28 py-1 rounded-md text-sm font-medium hover:bg-green-600"
                onClick={handleSubmit}
              >
                {isHide ? "Create" : "Update"}
              </button>
            </div>
          </div>
          <div>
            <h1 className="text-md mt-4 mb-2">Study set Information</h1>
            <form>
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
                          disabled={!isHide}
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
            </form>
          </div>
          {!isHide ? (
            <div className="h-full mt-4">
              <h1 className="text-md mt-4 mb-2">Add cards</h1>
              <hr />
              <div className=" w-full">
                {cards.map((card, index) => {
                  return (
                    <div className="h-48 rounded-xl grid grid-cols-2 gap-4 my-4">
                      <div className="col-span-1 rounded-xl bg-gray-200">
                        {index}
                      </div>
                      <div className="col-span-1 rounded-xl bg-gray-200">
                        {index}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </AppLayput2>
    </div>
  );
};

export default add;
