import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchLayout from "../../../../components/layout/SearchLayout";
import { putSearchKeyword } from "../../../../redux/actions/searchAction";
import Link from "next/link";

import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import { ALERT } from "../../../../redux/types/alertType";
import { PARAMS } from "../../../../common/params";
import { getAPI } from "../../../../utils/FetchData";
import { ISSResultSearch, RootStore } from "../../../../utils/TypeScript";

const index = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { search } = useSelector((state: RootStore) => state);
  const {
    query: { type, search_query, searchBy },
  } = router;

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [setsResult, setSetResult] = useState<ISSResultSearch[]>([]);
  const [totalResult, setTotalResult] = useState(0);

  const handlePageChange = (type: string) => {
    if (type == "prev") setCurrentPage(currentPage - 1);
    if (type == "next") setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const setRes = await getAPI(
          `${
            PARAMS.ENDPOINT
          }search/studySet/title/?keySearch=${search_query}&page=${
            currentPage - 1
          }&sort=createdDate,asc`
        );
        dispatch({ type: ALERT, payload: { loading: false } });
        console.log(JSON.stringify(setRes));

        setSetResult(setRes.data.content);
        setTotalPages(setRes.data.totalPages);
        setTotalResult(setRes.data.totalElements);
      } catch (err) {}
    };
    fetchData();
  }, [type, search_query, searchBy, currentPage]);

  return (
    <div>
      <SearchLayout>
        <div className="w-full">
          <div className="mt-4">
            <div className="flex justify-between">
              <p>Sets</p>
              <p>{totalResult} Results</p>
            </div>
            {setsResult.map((set, index) => {
              return (
                <div
                  key={index}
                  className="w-full mt-6 p-2 bg-white mb-4 shadow-md border-b-2 border-gray-200 hover:border-gray-300"
                >
                  <div className="flex justify-between w-full">
                    <Link href={`/set/${set.id}`}>
                      <div className="hover:underline  font-bold text-xl cursor-pointer">
                        {set.title}
                      </div>
                    </Link>
                    <Link href={`/${set.creator}/library/sets`}>
                      <div className="hover:underline  font-bold text-md cursor-pointer">
                        {set.creator}
                      </div>
                    </Link>
                  </div>
                  <div className="flex flex-row">
                    <p>{set.numberOfCards} cards</p>
                  </div>
                  <div className="grid grid-cols-4 gap-4">{}</div>
                </div>
              );
            })}
          </div>
          <div className="">
            <div className="flex flex-row justify-center items-center absolute inset-x-0 bottom-8 mb-6">
              <button
                className={`${
                  currentPage <= 1
                    ? "text-gray-300"
                    : "hover:bg-green-500 rounded-full hover:text-white transition duration-300 focus:outline-none"
                } focus:outline-none mx-4`}
                onClick={() => handlePageChange("prev")}
                disabled={currentPage <= 1}
              >
                <KeyboardArrowLeftIcon fontSize="large" />
              </button>
              <div>
                <p className="my-auto text-xl font-bold mx-4">{currentPage}</p>
              </div>
              <button
                className={`${
                  currentPage >= totalPages
                    ? "text-gray-300"
                    : "hover:bg-green-500 rounded-full hover:text-white transition duration-300 focus:outline-none"
                } focus:outline-none mx-4`}
                onClick={() => handlePageChange("next")}
                disabled={currentPage >= totalPages}
              >
                <KeyboardArrowRightIcon fontSize="large" />
              </button>
            </div>
          </div>
        </div>
      </SearchLayout>
    </div>
  );
};

export default index;
