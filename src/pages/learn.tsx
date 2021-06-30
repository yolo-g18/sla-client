import { useRouter } from "next/router";

const learn = () => {
  const router = useRouter();
  const {
    query: { id },
  } = router;
  return <div></div>;
};

export default learn;
