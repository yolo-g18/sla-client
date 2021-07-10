import AppLayput2 from "../../../components/layout/AppLayout";
import dynamic from "next/dynamic";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import VolumeDownIcon from "@material-ui/icons/VolumeDown";
import { useEffect, useRef, useState } from "react";
import ReactCardFlip from "react-card-flip";

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

let useClickOutside = (handler: any) => {
  let domNode: any = useRef();

  useEffect(() => {
    let maybeHandler = (event: any) => {
      if (!domNode.current.contains(event.target)) {
        handler();
      }
    };

    document.addEventListener("mousedown", maybeHandler);

    return () => {
      document.removeEventListener("mousedown", maybeHandler);
    };
  });

  return domNode;
};

const learn = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [q, setQ] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAddHintFormOpen, setIsAddHintFormOpen] = useState(false);
  const [isEditCardFromOpen, setIsEditCardFromOpen] = useState(false);
  const [isSetColorFromOpen, setIsSetColorFromOpen] = useState(false);
  const qValueArr = [
    "bg-green-300",
    "bg-blue-300",
    "bg-purple-300",
    "bg-pink-300",
    "bg-red-300",
    "bg-yellow-300",
  ];

  let domNode = useClickOutside(() => {
    setIsMenuOpen(false);
  });

  const handelExpandMoreBtnClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const flipCardHandel = () => {
    setIsFlipped(!isFlipped);
  };
  return (
    <div>
      <AppLayput2 title="learn" desc="dd">
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 -mt-20 px-2">
          <div className="h-3/5 2xl:w-2/5 x md:w-1/2 sm:w-2/3 w-full rounded-md">
            <div className="justify-center items-center flex font-sans text-xl mb-8">
              <p className="fixed">Practice Your Card</p>
            </div>
            <div className="flex justify-between w-full mb-2">
              <div className="px-1">
                <h1>9/20</h1>
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
                            className="block px-4 py-1 font-medium text-sm text-gray-700 hover:bg-blue-500 hover:text-white dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600"
                            role="menuitem"
                          >
                            <span className="flex flex-col">
                              <span>add hint</span>
                            </span>
                          </a>
                          <a
                            className="block px-4 py-1 font-medium text-sm text-gray-700 hover:bg-blue-500 hover:text-white dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600"
                            role="menuitem"
                          >
                            <span className="flex flex-col">
                              <span>edit</span>
                            </span>
                          </a>
                          <a
                            className="block px-4 py-1 font-medium text-sm text-gray-700 hover:bg-blue-500 hover:text-white dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600"
                            role="menuitem"
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
            <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
              <div onClick={flipCardHandel}>
                <QuillNoSSRWrapper
                  className="h-96 bg-white shadow-md rounded-md border-2 border-gray-200"
                  readOnly={true}
                  theme="bubble"
                  value={"mat truoc"}
                />
              </div>
              <div onClick={flipCardHandel}>
                <QuillNoSSRWrapper
                  className="h-96 bg-white shadow-md rounded-md border-2 border-gray-200"
                  readOnly={true}
                  theme="bubble"
                  value={"mat sau"}
                />
              </div>
            </ReactCardFlip>
            <div className="justify-center items-center flex mt-8">
              {qValueArr.map((qValue) => {
                return (
                  <button
                    className={` w-1/6 mx-2 h-8 px-4 py-1 rounded-xl hover:bg-gray-200 ${qValue}`}
                  ></button>
                );
              })}
            </div>
            <div className="justify-center items-center flex mt-6">
              <button className="mx-4">
                <KeyboardArrowLeftIcon fontSize="large" />
              </button>
              <button className="mx-4">
                <KeyboardArrowRightIcon fontSize="large" />
              </button>
            </div>
          </div>
        </div>
      </AppLayput2>
    </div>
  );
};
export default learn;
