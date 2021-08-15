import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import AppLayout from "../components/layout/AppLayout";
import { RootStore } from "../utils/TypeScript";

export default function index() {
  const { auth } = useSelector((state: RootStore) => state);
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("access-token")) {
      if (!auth.roles?.includes("ROLE_ADMIN") && auth.roles?.length) {
        router.push("/home");
      } else {
        console.log("tai sao ha");
        router.push("/admin");
      }
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
