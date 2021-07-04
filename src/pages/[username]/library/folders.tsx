import LibraryLayout from "../../../components/layout/LibraryLayout";
import { useRouter } from "next/router";
interface Props {
  username?: string;
}

const folder = (props: Props) => {
  const router = useRouter();
  const {
    query: { username },
  } = router;
  return (
    <div>
      <LibraryLayout>
        <h1>Folders</h1>
        {username}
      </LibraryLayout>
    </div>
  );
};

export default folder;
