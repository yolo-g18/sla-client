import { useRouter } from "next/router";

const ActiveAccount = () => {
  const router = useRouter();
  const {
    query: { username },
  } = router;
  return <div>{username}</div>;
};

export default ActiveAccount;
