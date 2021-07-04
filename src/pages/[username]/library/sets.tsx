import LibraryLayout from "../../../components/layout/LibraryLayout";
import { useRouter } from "next/router";

const sets = (props: any) => {
  const router = useRouter();
  const {
    query: { username },
  } = router;
  return (
    <div>
      <LibraryLayout>{username}</LibraryLayout>
    </div>
  );
};

export default sets;
