import { useRouter } from "next/router";
import SetEditLayout from "../../../components/layout/SetEditLayout";

const edit = () => {
  const router = useRouter();
  const {
    query: { id },
  } = router;

  return (
    <div>
      <SetEditLayout id={id} />
    </div>
  );
};

export default edit;
