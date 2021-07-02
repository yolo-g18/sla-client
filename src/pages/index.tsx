import { links } from "../components/links";
import { getUserProfile } from "../redux/actions/authAction";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("access-token")) {
      dispatch(getUserProfile());
      router.push("/home");
    } else {
      router.push("/auth/login");
    }
  }, []);

  return <div>Welcome SLA</div>;
}
