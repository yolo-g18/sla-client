import { links } from "../components/links";
import { getUserProfile } from "../redux/actions/authAction";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { RootStore } from "../utils/TypeScript";
import { useRouter } from "next/router";
import Loading from "../components/loading/Loading";
import AppLayout from "../components/layout/AppLayout";

export default function Home() {
  return <div>Landing page</div>;
}
