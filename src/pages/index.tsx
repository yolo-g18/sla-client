import { useRouter } from "next/router";
import { useEffect } from "react";
import AppLayput2 from "../components/layout/AppLayput2";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("access-token")) router.push("/home");
  }, []);

  return (
    <div>
      <AppLayput2 title="SLA" desc="">
        let learn
      </AppLayput2>
    </div>
  );
}
