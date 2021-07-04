import { useRouter } from "next/router";
import { useEffect } from "react";
import Loading from "../components/loading/Loading";
import AppLayput2 from "../components/layout/AppLayput2";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("/home");
  }, []);

  return (
    <div>
      <AppLayput2 title="SLA" desc="">
        let learn
      </AppLayput2>
    </div>
  );
}
