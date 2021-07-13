import LibraryLayout from "../../../components/layout/LibraryLayout";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootStore } from "../../../utils/TypeScript";

const sets = (props: any) => {
  const { alert, user } = useSelector((state: RootStore) => state);

  return (
    <div>
      <LibraryLayout>
        <div className="mt-4">
          day la list sets cua
          {user.username}
        </div>
      </LibraryLayout>
    </div>
  );
};

export default sets;
