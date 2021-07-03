import { useRouter } from "next/router";
import { useEffect } from "react";
import Loading from "../components/loading/Loading";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("/auth/login");
  }, []);

  return (
    <div>
      <Loading />
    </div>
  );
}
