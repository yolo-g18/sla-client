import LibraryLayout from "../../../components/layout/LibraryLayout";
import Link from "next/link";

import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import { useDispatch, useSelector } from "react-redux";
import {
  IStudySetInfo2,
  IStudySetLearning,
  RootStore,
} from "../../../utils/TypeScript";
import { useEffect, useState } from "react";
import { ALERT } from "../../../redux/types/alertType";
import { getAPI } from "../../../utils/FetchData";
import { PARAMS } from "../../../common/params";
import { useRouter } from "next/router";

const sets = (props: any) => {
  const { auth, user } = useSelector((state: RootStore) => state);
  const dispatch = useDispatch();

  const router = useRouter();
  const {
    query: { type, search_query, color },
  } = router;

  const [listStudySetLeaning, setListStudySetLearning] = useState<
    IStudySetLearning[]
  >([]);
  const [listStudySetCreated, setlistStudySetCreated] = useState<
    IStudySetInfo2[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      //list ss create
      const fetchCreatedSets = async () => {
        try {
          dispatch({ type: ALERT, payload: { loading: true } });
          const listSSCreatedRes = await getAPI(
            `${PARAMS.ENDPOINT}lib/ss/created?userId=${user._id}`
          );
          dispatch({ type: ALERT, payload: { loading: false } });
          setlistStudySetCreated(listSSCreatedRes.data);

          if (search_query) {
            setlistStudySetCreated(
              listSSCreatedRes.data.filter((item: IStudySetInfo2) =>
                item.title
                  .toLowerCase()
                  .includes(search_query.toString().toLowerCase())
              )
            );
          }
        } catch (err) {
          dispatch({ type: ALERT, payload: { loading: false } });
        }
      };

      //list studyset learning
      const fetchLearningSets = async () => {
        try {
          dispatch({ type: ALERT, payload: { loading: true } });
          const listSSLearningRes = await getAPI(
            `${PARAMS.ENDPOINT}lib/ss/learning`
          );
          dispatch({ type: ALERT, payload: { loading: false } });
          setListStudySetLearning(listSSLearningRes.data);

          if (search_query) {
            setListStudySetLearning(
              listSSLearningRes.data.filter((item: IStudySetLearning) =>
                item.studySetName
                  .toLowerCase()
                  .includes(search_query.toString().toLowerCase())
              )
            );
          }

          if (color !== "WHITE") {
            setListStudySetLearning(
              listSSLearningRes.data.filter(
                (item: IStudySetLearning) => item.color == color
              )
            );
          }
        } catch (err) {
          dispatch({ type: ALERT, payload: { loading: false } });
        }
      };

      if (!type || type === "0") {
        fetchCreatedSets();
        fetchLearningSets();
      }
      if (type === "1") {
        fetchCreatedSets();
        setListStudySetLearning([]);
      }
      if (type === "2") {
        fetchLearningSets();
        setlistStudySetCreated([]);
      }
    };

    fetchData();
  }, [user._id, type, search_query, color]);

  console.log(listStudySetLeaning);

  if (
    search_query &&
    listStudySetLeaning.length === 0 &&
    listStudySetCreated.length === 0
  )
    return (
      <div>
        <LibraryLayout>
          <div className="col-span-2 text-center mx-auto mt-24">
            <p className="text-xl font-semibold text-gray-600">
              No sets matching {search_query} found
            </p>
          </div>
        </LibraryLayout>
      </div>
    );

  if (listStudySetLeaning.length === 0 && listStudySetCreated.length === 0) {
    if (user.username === auth.userResponse?.username)
      return (
        <LibraryLayout>
          <div className="col-span-2 text-center mx-auto mt-24">
            <p className="text-3xl font-semibold text-gray-700">
              You have no sets yet
            </p>
            <p className="text-md text-gray-600">
              Sets you create or study will be displayed here
            </p>
            <div className="mt-4 text-center">
              <Link href="/set/add">
                <button
                  type="button"
                  className="w-44 text-md rounded-sm px-4 mx-2 py-2
                      text-md font-bold bg-blue-500 hover:bg-blue-600 
                   text-white focus:outline-none"
                >
                  Create a new set
                </button>
              </Link>
            </div>
          </div>
        </LibraryLayout>
      );
    else
      return (
        <LibraryLayout>
          <div className="col-span-2 text-center mx-auto mt-24">
            <p className="text-3xl font-semibold text-gray-700">
              {user.username} hasn't created any sets yet
            </p>
            <p className="text-md text-gray-600">
              Sets they create will appear here
            </p>
          </div>
        </LibraryLayout>
      );
  }

  return (
    <div>
      <LibraryLayout>
        <div className=" px-2">
          {/* list set learning */}
          {user.username === auth.userResponse?.username &&
          listStudySetLeaning.length !== 0 ? (
            <div>
              <div className="flex justify-between">
                <div className="flex flex-col mt-2">
                  <div className="w-44 h-2 bg-blue-600 mb-2"></div>
                  <p className="text-lg font-bold text-blue-600">
                    Learning ({listStudySetLeaning.length})
                  </p>
                </div>
              </div>
              <div className=" grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4">
                {listStudySetLeaning.map((set, index) => {
                  return (
                    <div key={index} className="col-span-1">
                      <div
                        className="flex-col col-span-1 rounded-md my-4 bg-white 
                          hover:border-gray-300 hover:shadow-lg cursor-pointer shadow-md border-b-2 border-gray-200 p-4"
                      >
                        <div className=" w-full flex flex-row mb-2">
                          <div className="w-full flex justify-between my-auto">
                            <Link href={`/set/${set.studySetId}`}>
                              <p className="text-gray-800 dark:text-white text-xl font-medium truncate hover:underline">
                                {set.color ? (
                                  <FiberManualRecordIcon
                                    className={`py-1 text-${set.color.toLowerCase()}-500`}
                                  />
                                ) : null}
                                {set.studySetName}
                              </p>
                            </Link>
                          </div>
                        </div>
                        <div className="mb-4 h-20 text-sm">
                          {set.ssDescription.length <= 100 ? (
                            <p className="text-gray-500">{set.ssDescription}</p>
                          ) : (
                            <p className="text-gray-500">
                              {set.ssDescription.substring(0, 150)}...
                            </p>
                          )}
                        </div>
                        <div className="flex justify-between">
                          <div>
                            <div>
                              <p className="text-blue-500 font-medium text-sm">
                                Progress: {Math.round(set.progress * 100)}%
                              </p>
                            </div>
                            <div className="font-semibold text-gray-500">
                              <p>{set.numberOfCards} cards</p>
                            </div>
                          </div>
                          <Link href={`/${set.owner}/library/sets?color=WHITE`}>
                            <div className="flex">
                              <img
                                className="w-5 h-5 my-auto rounded-full object-cover object-center"
                                src={`${
                                  set.creatorAvatar
                                    ? set.creatorAvatar
                                    : "../../user.svg"
                                }`}
                                alt="Avatar Upload"
                              />
                              <p className="my-auto ml-2">
                                <span className="text-gray-600 font-medium text-md hover:underline">
                                  {set.owner}
                                </span>
                              </p>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
          {/* ss created */}
          {listStudySetCreated.length !== 0 ? (
            <div className="">
              <div className="flex justify-between">
                <div className="flex flex-col mt-2">
                  <div className="w-44 h-2 bg-blue-600 mb-2"></div>
                  <p className="text-lg font-bold text-blue-600">
                    Created ({listStudySetCreated.length})
                  </p>
                </div>
              </div>
              <div className=" grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4">
                {listStudySetCreated.map((set, index) => {
                  return (
                    <div className=" col-span-1" key={index}>
                      <div
                        className="flex-col col-span-1 rounded-md my-4 bg-white 
                          hover:border-gray-300 hover:shadow-lg duration-150 cursor-pointer shadow-md border-b-2 border-gray-200 p-4"
                      >
                        <div className=" w-full flex flex-row mb-2">
                          <div className="w-full flex justify-between my-auto">
                            <Link href={`/set/${set.id}`}>
                              <p className="text-gray-800 dark:text-white text-xl font-medium truncate hover:underline">
                                {set.title}
                              </p>
                            </Link>
                          </div>
                        </div>
                        <div className="mb-4 h-20 text-sm">
                          {set.description.length <= 150 ? (
                            <p className="text-gray-500">{set.description}</p>
                          ) : (
                            <p className="text-gray-500">
                              {set.description.substring(0, 150)}...
                            </p>
                          )}
                        </div>
                        <div className="flex justify-between">
                          <div className=" mt-1 font-semibold text-gray-500">
                            <p>{set.numberOfCards} cards</p>
                          </div>
                          <div>
                            <Link
                              href={`/${set.creator}/library/sets?color=WHITE`}
                            >
                              <div className="flex">
                                <img
                                  className="w-5 h-5 my-auto rounded-full object-cover object-center"
                                  src={`${
                                    set.creatorAvatar
                                      ? set.creatorAvatar
                                      : "../../user.svg"
                                  }`}
                                  alt="Avatar Upload"
                                />
                                <p className="my-auto ml-2">
                                  <span className="text-gray-600 font-medium text-md hover:underline">
                                    {set.creator}
                                  </span>
                                </p>
                              </div>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </LibraryLayout>
    </div>
  );
};

export default sets;
