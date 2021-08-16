import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PARAMS } from "../../common/params";
import AppLayout from "../../components/layout/AppLayout";
import { getAPI, putAPI } from "../../utils/FetchData";
import _ from "lodash";
import {
  FormSubmit,
  ICard,
  IReport,
  IReportSs,
  RootStore,
} from "../../utils/TypeScript";
import Link from "next/link";
import { formatCreatedDate } from "../../components/schedule/convertTime";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import { useRouter } from "next/router";
import { ALERT } from "../../redux/types/alertType";
import { getUserByUsername } from "../../redux/actions/userAction";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

//alert
function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const admin = () => {
  const { auth, alert, user } = useSelector((state: RootStore) => state);

  const router = useRouter();
  const dispatch = useDispatch();

  const [listReport, setListReport] = useState<IReport[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filterBy, setFilterBy] = useState(0);
  const [dateSort, setDateSort] = useState("desc");
  const [keyWord, setKeyWord] = useState("");
  const [isUpdated, setIsUpdated] = useState(false);

  //to reload status checked report
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setIsChecked(false);
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
            }admin/report/filter?isChecked=false&sort=createdTime,${dateSort}&page=${
              currentPage - 1
            }`
          );
          setListReport(res.data.content);
          setTotalPages(res.data.totalPages);
        } else {
          const res = await getAPI(
            `${
              PARAMS.ENDPOINT
            }admin/report/filter?isChecked=true&sort=createdTime,${dateSort}&page=${
              currentPage - 1
            }`
          );
          setListReport(res.data.content);
          setTotalPages(res.data.totalPages);
        }
        dispatch({ type: ALERT, payload: { loading: false } });
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
      }
    };

    fetchData();
  }, [currentPage, filterBy, isChecked]);

  const handleSubmit = async (e: FormSubmit) => {
    e.preventDefault();
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
        dispatch({ type: ALERT, payload: { loading: false } });
      }
    };

    fetchData();
  };

  //handel close toast
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setIsToastOpen(false);
  };

  const handlePageChange = (type: string) => {
    if (type == "prev") setCurrentPage(currentPage - 1);
    if (type == "next") setCurrentPage(currentPage + 1);
  };

  const [showModalReportDetail, setShowModalReportDetail] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState();
  const [cards, setCards] = useState<ICard[]>([]);
  const [creatorName, setCreatorName] = useState("");
  const [numberOfCard, setNumberOfCard] = useState();
  const [currentReport, setCurrentReport] = useState<IReport>();
  const [listReportOfStudySet, setListReportOfStudySet] = useState<IReportSs[]>(
    []
  );
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [typeToast, setTypeToast] = useState("success");
  const [messageToast, setMessageToast] = useState("");

  const [totalReport, setTotalReport] = useState(0);
  const [totalPageReport, setTotalPageReport] = useState(0);
  const [currentPageReport, setCurrentPageReport] = useState(1);
  const [ssIsActive, setSSIsActive] = useState(true);

  // check set disable by api get study set of user role, if return excep set is not active or else
  useEffect(() => {
    if (!currentReport) return;
    const fetchData = async () => {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const studySetRes = await getAPI(
          `${PARAMS.ENDPOINT}studySet/view?id=${currentReport?.ssId}`
        );
        setSSIsActive(true);
      } catch (err) {
        setSSIsActive(false);
      }
    };
    fetchData();
  }, [currentReport]);

  //fetch report data by studyset id
  const fetchReportSsData = async (report: IReport | undefined) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      const studySetRes = await getAPI(
        `${PARAMS.ENDPOINT}admin/studySet/view?id=${report?.ssId}`
      );
      if (studySetRes.data) {
        setTitle(studySetRes.data.title);
        setDesc(studySetRes.data.description);
        setTags(studySetRes.data.tag);
        setCreatorName(studySetRes.data.creatorName);
        setNumberOfCard(studySetRes.data.numberOfCard);
        const cardRes = await getAPI(
          `${PARAMS.ENDPOINT}admin/card/list?id=${report?.ssId}`
        );
        const reportsRes = await getAPI(
          `${PARAMS.ENDPOINT}admin/report/${report?.ssId}?page=${
            currentPageReport - 1
          }`
        );
        setListReportOfStudySet(reportsRes.data.content);
        setTotalReport(reportsRes.data.totalElements);
        setTotalPageReport(reportsRes.data.totalPages);

        setCards(cardRes.data);
        dispatch({ type: ALERT, payload: { loading: false } });
      } else dispatch({ type: ALERT, payload: { loading: false } });
    } catch (err) {
      dispatch({ type: ALERT, payload: { loading: false } });
      setShowModalReportDetail(false);
    }
  };

  const showModalReportDetailHandle = (report: IReport | undefined) => {
    setShowModalReportDetail(true);
    setCurrentReport(report);
    fetchReportSsData(report);
  };

  useEffect(() => {
    if (!currentReport) return;
    fetchReportSsData(currentReport);
  }, [currentPageReport]);

  useEffect(() => {
    if (!creatorName) return;
    dispatch(getUserByUsername(`${creatorName}`));
  }, [creatorName]);

  //paging report of studyset
  const handlePageReportChange = (type: string) => {
    if (type == "prev") setCurrentPageReport(currentPageReport - 1);
    if (type == "next") setCurrentPageReport(currentPageReport + 1);
  };

  //disable study set
  const [showModalConfirm, setShowModalConfirm] = useState(false);

  const closeReportModalHandle = () => {
    setShowModalReportDetail(false);
    //mark checked report
    const checkedReports = async () => {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const studySetRes = await putAPI(
          `${PARAMS.ENDPOINT}admin/report/check`,
          [currentReport?.id]
        );
        dispatch({ type: ALERT, payload: { loading: false } });
        setIsChecked(true);
      } catch (err) {
        dispatch({ type: ALERT, payload: { loading: false } });
      }
    };
    checkedReports();
    setTotalPageReport(0);
    setCurrentPageReport(1);
  };

  const handleDisable = async () => {
    const data = {
      id: currentReport?.ssId,
      isActive: !ssIsActive,
    };

    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      const res = await putAPI(`${PARAMS.ENDPOINT}admin/report/disable`, data);
      dispatch({ type: ALERT, payload: { loading: false } });
      setShowModalConfirm(false);
      closeReportModalHandle();
      if (ssIsActive) {
        setMessageToast("Disabled");
        setTypeToast("warning");
      } else {
        setMessageToast("Enabled");
        setTypeToast("success");
      }

      setIsToastOpen(true);
    } catch (err) {
      dispatch({ type: ALERT, payload: { loading: false } });
      setMessageToast("An error occurred");
      setTypeToast("error");
      setIsToastOpen(true);
    }
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
              <div className="inline-block min-w-full shadow rounded-md overflow-hidden">
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
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-medium">
                            <p
                              onClick={() => showModalReportDetailHandle(_)}
                              className="text-blue-500 hover:text-blue-600 hover:underline cursor-pointer"
                            >
                              View
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
      {/* view detail report */}
      {showModalReportDetail ? (
        <div className="justify-center items-center flex overflow-scroll fixed inset-0 z-50 backdrop-filter backdrop-brightness-75 -mt-8">
          <div className=" absolute flex items-center justify-center bg-modal">
            <div
              className="rounded-md shadow p-4 m-4 bg-gray-100"
              style={{ width: "1200px", height: "700px" }}
            >
              <div className="mb-2 text-gray-600 text-md font-semibold ">
                <div className="grid grid-cols-3 gap-2">
                  <div
                    className="col-span-1 bg-white rounded-md p-4 overflow-auto"
                    style={{ height: "620px" }}
                  >
                    <div className="col-span-1">
                      <div className=" flex items-center px-2">
                        <div>
                          <img
                            className="w-12 h-12 my-auto rounded-full object-cover object-center"
                            src={`${
                              user.avatar ? user.avatar : "../../user.svg"
                            }`}
                            alt="Avatar Upload"
                          />
                        </div>
                        <div className="px-3 mr-auto">
                          <small className="text-sm">create by </small>
                          <Link href={`/${creatorName}/library/sets`}>
                            <h4 className="font-bold text-md hover:underline cursor-pointer">
                              {creatorName}
                            </h4>
                          </Link>
                        </div>
                      </div>
                      <p>
                        <span className=" text-md font-bold">{title}</span>
                        <br />
                        <br />
                        <span className="text-sm text-gray-700 mt-6">
                          about
                        </span>
                        <br />
                        <span className=" text-sm font-medium">{desc}</span>
                        <br />
                      </p>
                      {tags ? (
                        <div className="mt-6">
                          <hr />
                          <span className="text-sm text-gray-700">tags</span>
                          <div className="flex flex-wrap">
                            {_.split(tags, ",").map((tag, index) => {
                              return (
                                <div key={index}>
                                  <Link
                                    href={`/search/set/tag?search_query=${tag}`}
                                  >
                                    <div className="my-1 mr-2 flex ">
                                      <span className="px-4 py-1 rounded-md truncate bg-gray-200 text-blue-500 hover:underline cursor-pointer text-sm font-medium">
                                        {tag}
                                      </span>
                                    </div>
                                  </Link>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : null}
                    </div>
                    <div className="mt-4">
                      <div className="mb-4 flex justify-between">
                        <p>List reports ({totalReport})</p>
                        <div className=" bg-white flex flex-col xs:flex-row items-center xs:justify-between">
                          <div className="flex items-center">
                            <button
                              className={`${
                                currentPageReport <= 1
                                  ? "text-gray-300"
                                  : "hover:bg-blue-500 rounded-full hover:text-white transition duration-300 focus:outline-none"
                              } focus:outline-none mx-2`}
                              onClick={() => handlePageReportChange("prev")}
                              disabled={currentPageReport <= 1}
                            >
                              <KeyboardArrowLeftIcon />
                            </button>
                            <div>
                              <p className="my-auto text-md font-medium pt-0.5">
                                {currentPageReport}
                              </p>
                            </div>
                            <button
                              className={`${
                                currentPageReport >= totalPageReport
                                  ? "text-gray-300"
                                  : "hover:bg-blue-500 rounded-full hover:text-white transition duration-300 focus:outline-none"
                              } focus:outline-none mx-2`}
                              onClick={() => handlePageReportChange("next")}
                              disabled={currentPageReport >= totalPageReport}
                            >
                              <KeyboardArrowRightIcon />
                            </button>
                          </div>
                        </div>
                      </div>

                      {listReportOfStudySet.map((report) => {
                        return (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-800 flex justify-between">
                              <span>{report.reporter}</span>
                              <span className="text-xs ml-6 font-light">
                                {formatCreatedDate(report.reportedDate)}
                              </span>
                            </p>
                            <span className="text-sm font-medium text-gray-500">
                              {report.content}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {/* display cards of ss */}
                  <div className="col-span-2 overflow-auto bg-white rounded-md p-4">
                    <h1 className="text-md mb-2">{numberOfCard} cards</h1>
                    <div className="overflow-auto" style={{ height: "550px" }}>
                      {cards.map((card, index) => {
                        return (
                          <div
                            key={index}
                            className="rounded-md flex w-full my-4 relative"
                          >
                            <div className="flex justify-between w-full gap-3">
                              <div>
                                <h1>{index + 1}</h1>
                              </div>
                              <div
                                className="card-overview w-1/2 rounded-md bg-gray-100 shadow-lg border-b-1 p-8 text-center"
                                dangerouslySetInnerHTML={{ __html: card.front }}
                              ></div>
                              <div
                                className="card-overview w-1/2  rounded-md bg-gray-100 shadow-lg border-b-1 p-9 text-center"
                                dangerouslySetInnerHTML={{ __html: card.back }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end px-6 my-auto mt-4">
                  <button
                    className={`bg-${
                      ssIsActive ? "yellow" : "blue"
                    }-500 text-white w-28 py-1 mr-1 
                      rounded-sm text-sm font-medium 
                    hover:bg-${ssIsActive ? "yellow" : "blue"}-600`}
                    type="button"
                    onClick={() => setShowModalConfirm(true)}
                  >
                    {alert.loading
                      ? "Loading..."
                      : ssIsActive
                      ? "Disable"
                      : "Enable"}
                  </button>
                  <button
                    className="bg-gray-100 border-2 text-gray-700 w-28 py-1 ml-1 rounded-sm text-sm font-medium hover:bg-gray-300"
                    type="button"
                    onClick={closeReportModalHandle}
                  >
                    Close
                  </button>
                </div>
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
                  {ssIsActive
                    ? "Are you sure want disable this set?"
                    : "Are you sure want enable this set?"}
                </p>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => setShowModalConfirm(false)}
                  className="  w-32 py-1 mx-4 rounded-sm bg-gray-100 border-2 text-gray-700 focus:outline-none hover:bg-gray-300"
                >
                  No
                </button>
                <button
                  onClick={handleDisable}
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
        autoHideDuration={1000}
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
    </AppLayout>
  );
};

export default admin;
