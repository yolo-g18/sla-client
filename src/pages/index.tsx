import { useRouter } from "next/router";
import { useEffect } from "react";
import AppLayout from "../components/layout/AppLayout";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("access-token")) router.push("/home");
  }, []);

  return (
    <div>
      <AppLayout title="SLA" desc="">
        let learn
      </AppLayout>
    </div>
  );
}
