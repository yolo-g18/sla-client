import SearchLayout from "../../../components/layout/SearchLayout";
import { useSelector } from "react-redux";
import { RootStore } from "../../../utils/TypeScript";
import { useEffect } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import { useState } from "react";
import { getAPI } from "../../../utils/FetchData";
import { PARAMS } from "../../../common/params";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      "& > *": {
        marginTop: theme.spacing(2),
      },
    },
  })
);

const index = () => {
  const { search } = useSelector((state: RootStore) => state);
  const [ssResult, setSSResult] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAPI(
          `${PARAMS.ENDPOINT}search/studySet/title/?keySearch=${search.keyword}&page=0&sort=createdDate,asc`
        );

        console.log(JSON.stringify(res.data));
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const handlePageChange = () => {};

  return (
    <div>
      <SearchLayout>
        <div className="">
          <div></div>
          <div>
            <Pagination count={10} shape="rounded" />
          </div>
        </div>
      </SearchLayout>
    </div>
  );
};

export default index;
