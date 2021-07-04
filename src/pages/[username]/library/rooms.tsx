import LibraryLayout from "../../../components/layout/LibraryLayout";
import { useRouter } from "next/router";

const rooms = (props: any) => {
  const router = useRouter();
  const {
    query: { username },
  } = router;
  return (
    <div>
      <LibraryLayout>
        <h1>Rooms</h1>
        {username}
      </LibraryLayout>
    </div>
  );
};

export default rooms;
