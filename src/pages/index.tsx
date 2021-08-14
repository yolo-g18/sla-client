import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import AppLayout from "../components/layout/AppLayout";
import { RootStore } from "../utils/TypeScript";

export default function Home() {
  const { auth } = useSelector((state: RootStore) => state);
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("access-token")) {
      if (auth.roles?.includes("ROLE_ADMIN")) router.push("/admin");
      else router.push("/home");
    }
  }, []);

  return (
    <div>
      <AppLayout title="SLA" desc="">
        let learn
      </AppLayout>
    </div>
  );
}
