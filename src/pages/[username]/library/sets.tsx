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

const sets = (props: any) => {
  const { auth, alert, user } = useSelector((state: RootStore) => state);
  const dispatch = useDispatch();

  const [list4StudySetLeaning, setList4StudySetLearning] = useState<
    IStudySetLearning[]
  >([]);
  const [list4StudySetCreated, setList4StudySetCreated] = useState<
    IStudySetInfo2[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      //list ss create
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const listSSCreatedRes = await getAPI(
          `${PARAMS.ENDPOINT}lib/ss/created?userId=${user._id}`
        );
        dispatch({ type: ALERT, payload: { loading: false } });
        setList4StudySetCreated(listSSCreatedRes.data);

        console.log("created: " + JSON.stringify(listSSCreatedRes.data));
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
      }

      //list studyset learning
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const listSSLearningRes = await getAPI(
          `${PARAMS.ENDPOINT}lib/ss/learning`
        );
        dispatch({ type: ALERT, payload: { loading: false } });
        setList4StudySetLearning(listSSLearningRes.data);
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
      }
    };

    fetchData();
  }, [user._id]);

  return (
    <div>
      <LibraryLayout>
        <div className=" px-2">
          <div>
            <div className="flex justify-between">
              <div className="flex flex-col">
                <p className="text-lg font-bold text-gray-800">Learning</p>{" "}
              </div>
            </div>
            <div className=" grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4">
              {list4StudySetLeaning.map((set, index) => {
                return (
                  <div className="col-span-1">
                    <div
                      key={index}
                      className="grid grid-rows-5 shadow-lg flex-col col-span-1 rounded-md p-2 h-36 my-4 bg-white dark:bg-gray-800"
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
                      <div className="relative w-full h-2 bg-gray-200 rounded">
                        <div
                          className="absolute top-0 h-2 left-0 rounded bg-green-500"
                          style={{ width: `${set.progress * 100}%` }}
                        />
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
          <hr />
          {/* ss created */}
          <div className="mt-6">
            <div className="flex justify-between">
              <div className="flex flex-col">
                <p className="text-lg font-bold text-gray-800">Created</p>{" "}
              </div>
            </div>
            <div className=" grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4">
              {list4StudySetCreated.map((set, index) => {
                return (
                  <div className=" col-span-1" key={index}>
                    <div className="grid grid-rows-5 shadow-lg flex-row col-span-1 rounded-md p-2 h-36 my-4 bg-white dark:bg-gray-800 ">
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
                        {set.description.length <= 50 ? (
                          <p className="text-gray-500">{set.description}</p>
                        ) : (
                          <p className="text-gray-500">
                            {set.description.substring(0, 50)}...
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
        </div>
      </LibraryLayout>
    </div>
  );
};

export default sets;
