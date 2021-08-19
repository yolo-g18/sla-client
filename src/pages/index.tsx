import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import AppLayout from "../components/layout/AppLayout";
import { RootStore } from "../utils/TypeScript";

import Link from "next/link";

export default function index() {
  const { auth } = useSelector((state: RootStore) => state);
  const router = useRouter();
  useEffect(() => {
    if (auth.roles) {
      if (auth.roles?.includes("ROLE_ADMIN")) {
        router.push("/admin");
      } else {
        router.push("/home");
      }
    } else {
      if (localStorage.getItem("access-token")) {
        router.push("/home");
      }
    }
  }, [auth.roles]);

  return (
    <div>
      <div className="flex relative z-20 items-center ">
        <div className="container mx-auto px-6 flex flex-col justify-between items-center relative py-4"></div>
      </div>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 backdrop-filter backdrop-blur-md -mt-12">
        <div className="flex absolute top-16">
          <div className="ml-3 relative">
            <Link href="/auth/login">
              <a className="flex p-2 items-center text-gray-600 rounded-lg hover:text-gray-400 text-xl font-medium focus:outline-none">
                Login
              </a>
            </Link>
          </div>
          <div className="px-0 ml-4 relative">
            <Link href="/auth/register">
              <a className="flex p-2 items-center text-gray-600 rounded-lg hover:text-gray-400 text-xl font-medium focus:outline-none">
                Sign up
              </a>
            </Link>
          </div>
        </div>
        <div className="absolute top-80 flex">
          <h1 className="text-6xl font-bold text-gray-700 items-center flex">
            Well come to SLA
          </h1>
        </div>
        <h5 className="font-mono mb-1 text-center mt-12 text-3xl">
          Let's start
        </h5>
      </div>
    </div>
  );
}
