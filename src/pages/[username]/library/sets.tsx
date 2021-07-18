import LibraryLayout from "../../../components/layout/LibraryLayout";

import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "../../../utils/TypeScript";
import { useEffect } from "react";
import { ALERT } from "../../../redux/types/alertType";
import { getAPI } from "../../../utils/FetchData";
import { PARAMS } from "../../../common/params";

const sets = (props: any) => {
  const { alert, user } = useSelector((state: RootStore) => state);
  const dispatch = useDispatch();

  const listSetsLearning = [{}];

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: ALERT, payload: { loading: true } });
        const studySetRes = await getAPI(
          `${PARAMS.ENDPOINT}created?userId?id=${user._id}`
        );
      } catch (err) {}
    };
  }, []);

  return (
    <div>
      <LibraryLayout>
        <div className="mt-4">{user.username}</div>
      </LibraryLayout>
    </div>
  );
};

export default sets;
