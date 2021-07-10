import { useRouter } from "next/router";
import AppLayout from "../../../components/layout/AppLayout";

const index = () => {
  const router = useRouter();

  //lay ra id tu path
  const {
    query: { id }, //id of folder get from path
  } = router;

  //get data of set by id
  const setData = {
    title: "JAV101",
    desc: "hoc nhieu",
  };
  return (
    <div>
      <AppLayout title={setData.title} desc={setData.desc}>
        Day la trang view set, va day la id cua set: {id}
      </AppLayout>
    </div>
  );
};

export default index;
