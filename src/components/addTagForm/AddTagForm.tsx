import { useState } from "react";

interface Props {
  tag?: string;
}

const AddTagForm = () => {
  const [tags, setTags] = useState<string[]>([]);
  const addTags = (event: any) => {
    if (event.key === "Enter" && event.target.value !== "") {
      setTags([...tags, "da"]);
      event.target.value = "";
    }
  };
  const removeTags = (index: number) => {
    setTags([...tags.filter((tag) => tags.indexOf(tag) !== index)]);
  };

  return (
    <div className="flex items-start flex-wrap min-h-3 w-40 py-8 border-1 border-gray-200 rounded-md focus:outline-none focus:ring focus:border-yellow-500">
      <ul className="flex flex-wrap p-0 ml-8">
        {tags.map((tag, index) => (
          <li
            key={index}
            className=" flex items-center justify-center text-white py-2 text-sm rounded-full mt-2 mx-auto px-4 bg-purple-400"
          >
            <span>{tag}</span>
            <i className="material-icons" onClick={() => removeTags(index)}>
              close
            </i>
          </li>
        ))}
      </ul>
      <input
        className="flex border-none h-32 p-l-4 focus:outline-none focus:ring focus:border-yellow-500"
        type="text"
        onKeyUp={(e) => addTags(e)}
        placeholder="Press enter to add tags"
      />
    </div>
  );
};

export default AddTagForm;
