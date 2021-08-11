import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PARAMS } from "../../common/params";
import AppLayout from "../../components/layout/AppLayout";
import { getAPI } from "../../utils/FetchData";
import { FormSubmit, IReport, RootStore } from "../../utils/TypeScript";
import Link from "next/link";
import { formatCreatedDate } from "../../components/schedule/convertTime";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import { filter } from "lodash";
import { useRouter } from "next/router";
import { ALERT } from "../../redux/types/alertType";

const admin = () => {
  const { auth, alert } = useSelector((state: RootStore) => state);

  const router = useRouter();
  const dispatch = useDispatch();

  const [listReport, setListReport] = useState<IReport[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filterBy, setFilterBy] = useState(0);
  const [dateSort, setDateSort] = useState("desc");
  const [keyWord, setKeyWord] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        if (filterBy === 0) {
          const res = await getAPI(
            `${PARAMS.ENDPOINT}admin/report/all?page=${
              currentPage - 1
            }&sort=createdTime,${dateSort}`
          );
          setListReport(res.data.content);
          setTotalPages(res.data.totalPages);
        } else if (filterBy === 1) {
          const res = await getAPI(
            `${
              PARAMS.ENDPOINT
            }admin/report/filter?isPublic=false&sort=createdTime,${dateSort}&page=${
              currentPage - 1
            }`
          );
          setListReport(res.data.content);
          setTotalPages(res.data.totalPages);
        } else {
          const res = await getAPI(
            `${
              PARAMS.ENDPOINT
            }admin/report/filter?isPublic=true&sort=createdTime,${dateSort}&page=${
              currentPage - 1
            }`
          );
          setListReport(res.data.content);
          setTotalPages(res.data.totalPages);
        }
        dispatch({ type: ALERT, payload: { loading: false } });
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
        console.log(err);
      }
    };

    fetchData();
  }, [currentPage, filterBy]);

  const handleSubmit = async (e: FormSubmit) => {
    e.preventDefault();
    console.log(keyWord);
    setFilterBy(0);
    const fetchData = async () => {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const res = await getAPI(
          `${PARAMS.ENDPOINT}admin/report?content=${keyWord}&page=${
            currentPage - 1
          }&sort=createdTime,${dateSort}`
        );
        dispatch({ type: ALERT, payload: { loading: false } });
        setListReport(res.data.content);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.log(err);
        dispatch({ type: ALERT, payload: { loading: false } });
      }
    };

    fetchData();
  };

  console.log(filterBy);

  const handlePageChange = (type: string) => {
    if (type == "prev") setCurrentPage(currentPage - 1);
    if (type == "next") setCurrentPage(currentPage + 1);
  };

  return (
    <AppLayout title="Admin" desc="admin">
      {!auth.roles?.includes("ROLE_ADMIN") && auth.roles?.length ? (
        <h1 className="text-center mx-auto mt-20 text-3xl font-bold">
          Not permitted
        </h1>
      ) : (
        <div className="container mx-auto sm:px-8 max-w-7xl px-8 mb-24">
          <div className="py-8">
            <div className="w-full">
              <h2 className="text-2xl leading-tight mb-6 font-b">Reports</h2>
              <div className="mb-6 justify-between flex w-full">
                <div className="flex gap-6">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="filter"
                      className="h-5 w-5 text-red-600"
                      onChange={() => setFilterBy(0)}
                      checked={filterBy === 0}
                    />
                    <span className="ml-2 ">All</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="filter"
                      className="h-5 w-5 text-red-600"
                      onChange={() => setFilterBy(1)}
                      checked={filterBy === 1}
                    />
                    <span className="ml-2 text-sm font-medium">Pending</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="filter"
                      className="h-5 w-5 text-red-600"
                      onChange={() => {
                        setFilterBy(2);
                      }}
                      checked={filterBy === 2}
                    />
                    <span className="ml-2 ">Checked</span>
                  </label>
                </div>
                <form
                  onSubmit={(e) => handleSubmit(e)}
                  className="flex flex-col md:flex-row w-3/4 md:w-full max-w-sm md:space-x-3 space-y-3 md:space-y-0 justify-center"
                >
                  <div className=" relative ">
                    <input
                      type="text"
                      id='"form-subscribe-Filter'
                      className=" rounded-md border-transparent flex-1 appearance-none border border-gray-300 w-full px-4 py-1 bg-white text-gray-700
                       placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="Search..."
                      value={keyWord}
                      onChange={(e) => setKeyWord(e.target.value)}
                    />
                  </div>
                  <button
                    className="flex-shrink-0 px-6 font-medium py-1 text-sm text-white bg-blue-500 rounded-sm shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 "
                    type="submit"
                  >
                    Filter
                  </button>
                </form>
              </div>
            </div>
            <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
              <div className="inline-block min-w-full shadow rounded-sm overflow-hidden">
                <table className="min-w-full leading-normal">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="px-5 py-3 text-left bg-white border-b border-gray-200 text-gray-800 text-sm uppercase font-normal"
                      >
                        <p className="text-gray-900 whitespace-no-wrap">id</p>
                      </th>
                      <th
                        scope="col"
                        className="px-5 py-3 text-left bg-white  border-b border-gray-200 text-gray-800 text-sm uppercase font-normal"
                      >
                        <p className="text-gray-900 whitespace-no-wrap">
                          reporter
                        </p>
                      </th>
                      <th
                        scope="col"
                        className="px-5 py-3 text-left bg-white  border-b border-gray-200 text-gray-800 text-sm uppercase font-normal"
                      >
                        <p className="text-gray-900 w-16">set id</p>
                      </th>
                      <th
                        scope="col"
                        className="px-5 py-3 text-left bg-white  border-b border-gray-200 text-gray-800 text-sm uppercase font-normal"
                      >
                        <p className="text-gray-900 whitespace-no-wrap w-16">
                          set title
                        </p>
                      </th>
                      <th
                        scope="col"
                        className="px-5 py-3 text-left bg-white  border-b border-gray-200 text-gray-800 text-sm uppercase font-normal"
                      >
                        <p className="text-gray-900 whitespace-no-wrap">
                          report content
                        </p>
                      </th>
                      <th
                        scope="col"
                        className="px-5 py-3 text-left bg-white  border-b border-gray-200 text-gray-800 text-sm uppercase font-normal"
                      >
                        <p className="text-gray-900 whitespace-no-wrap">
                          status
                        </p>
                      </th>
                      <th
                        scope="col"
                        className="px-5 py-3 text-left bg-white  border-b border-gray-200 text-gray-800 text-sm uppercase font-normal"
                      >
                        <p className="w-24 text-gray-900 whitespace-no-wrap">
                          created at
                        </p>
                      </th>
                      <th
                        scope="col"
                        className="px-5 py-3 text-left bg-white  border-b border-gray-200 text-gray-800 text-sm uppercase font-normal"
                      ></th>
                    </tr>
                  </thead>
                  <tbody>
                    {listReport.map((_, index) => {
                      return (
                        <tr key={index}>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {_.id}
                            </p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm cursor-pointer">
                            <Link href={`/${_.reporter}/library/sets`}>
                              <div className="flex items-center">
                                <div className="flex-shrink-0">
                                  <a href="#" className="block relative">
                                    <img
                                      className="mx-auto object-cover rounded-full h-10 w-10"
                                      src={`${
                                        _.user_avatar
                                          ? _.user_avatar
                                          : "../../user.svg"
                                      }`}
                                      alt={_.reporter}
                                    />
                                  </a>
                                </div>
                                <div className="ml-3">
                                  <p className="text-gray-900 whitespace-no-wrap hover:underline">
                                    {_.reporter}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900">{_.ssId}</p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900">{_.ssTitle}</p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900">{_.content}</p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                              <span
                                aria-hidden="true"
                                className={`absolute inset-0 ${
                                  _.checked ? "bg-green-200" : "bg-yellow-400"
                                }  opacity-50 rounded-full`}
                              ></span>
                              <span>{_.checked ? "Checked" : "Pending"}</span>
                            </span>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 w-32">
                              {formatCreatedDate(_.createdTime)}
                            </p>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="px-5 bg-white py-5 flex flex-col xs:flex-row items-center xs:justify-between">
                  <div className="flex items-center">
                    <button
                      className={`${
                        currentPage <= 1
                          ? "text-gray-300"
                          : "hover:bg-blue-500 rounded-full hover:text-white transition duration-300 focus:outline-none"
                      } focus:outline-none mx-4`}
                      onClick={() => handlePageChange("prev")}
                      disabled={currentPage <= 1}
                    >
                      <KeyboardArrowLeftIcon fontSize="large" />
                    </button>
                    <div>
                      <p className="my-auto text-xl font-bold mx-4">
                        {currentPage}
                      </p>
                    </div>
                    <button
                      className={`${
                        currentPage >= totalPages
                          ? "text-gray-300"
                          : "hover:bg-blue-500 rounded-full hover:text-white transition duration-300 focus:outline-none"
                      } focus:outline-none mx-4`}
                      onClick={() => handlePageChange("next")}
                      disabled={currentPage >= totalPages}
                    >
                      <KeyboardArrowRightIcon fontSize="large" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default admin;
