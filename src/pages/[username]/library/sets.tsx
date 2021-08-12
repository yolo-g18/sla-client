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
    query: { type, search_query },
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
                  .includes(search_query.toString().toLowerCase().toLowerCase())
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
                  .includes(search_query.toString().toLowerCase().toLowerCase())
              )
            );
            console.log("co thay doi hong");
          }
        } catch (err) {
          dispatch({ type: ALERT, payload: { loading: false } });
        }
      };

      if (!type || type === "0") {
        console.log("mac dinh dung hong");

        fetchCreatedSets();
        fetchLearningSets();
      }
      if (type === "1") {
        console.log("cai nay la creted sets");
        fetchCreatedSets();
        setListStudySetLearning([]);
      }
      if (type === "2") {
        console.log("cai nay la learning sets");
        fetchLearningSets();
        setlistStudySetCreated([]);
      }
    };

    fetchData();
  }, [user._id, type, search_query]);

  console.log("key: " + search_query);

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
                    <div className="col-span-1">
                      <div
                        key={index}
                        className="grid grid-rows-5 shadow-lg flex-col col-span-1 rounded-md p-2 h-40 my-4 bg-white dark:bg-gray-800"
                      >
                        <div className="row-span-1 w-full flex mb-2">
                          <div className="w-full">
                            <p className="text-gray-800 dark:text-white text-xl font-medium leading-none">
                              <a
                                href={`/set/${set.studySetId}`}
                                className="hover:underline"
                              >
                                {set.studySetName.length <= 15
                                  ? set.studySetName
                                  : set.studySetName.substring(0, 15) +
                                    "..."}{" "}
                              </a>
                              {set.color ? (
                                <FiberManualRecordIcon
                                  className={`text-${set.color?.toLowerCase()}-400`}
                                />
                              ) : null}
                              {"  "}
                              <a href={`/${set.owner}/library/sets`}>
                                <span className="text-gray-500 text-sm hover:underline">
                                  {set.owner}
                                </span>
                              </a>
                            </p>
                          </div>
                        </div>
                        <div className="row-span-2 mb-12">
                          {set.ssDescription.length <= 50 ? (
                            <p className="text-gray-500">{set.ssDescription}</p>
                          ) : (
                            <p className="text-gray-500">
                              {set.ssDescription.substring(0, 50)}...
                            </p>
                          )}
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">
                            Progress: {Math.round(set.progress * 100)}%
                          </p>
                        </div>
                        <div className="row-span-1 mt-1">
                          <p>{set.numberOfCards} cards</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
          <hr />
          {/* ss created */}
          {listStudySetCreated.length !== 0 ? (
            <div className="mt-6">
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
                      <div className="grid grid-rows-5 shadow-lg flex-row col-span-1 rounded-md p-2 h-40 my-4 bg-white dark:bg-gray-800 ">
                        <div className="row-span-1 w-full mb-2">
                          <div className="w-full">
                            <p className="text-gray-800 dark:text-white text-xl font-medium ">
                              <a
                                href={`/set/${set.id}`}
                                className="hover:underline"
                              >
                                {set.title}{" "}
                              </a>
                              <a href={`/${set.creator}/library/sets`}>
                                <span className="text-gray-500 text-sm hover:underline">
                                  {set.creator}
                                </span>
                              </a>
                            </p>
                          </div>
                        </div>
                        <div className="row-span-3 mb-12">
                          {set.description.length <= 60 ? (
                            <p className="text-gray-500">{set.description}</p>
                          ) : (
                            <p className="text-gray-500">
                              {set.description.substring(0, 60)}...
                            </p>
                          )}
                        </div>
                        <div className="row-span-1 mt-2">
                          <p>{set.numberOfCards} cards</p>
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
