import { useRouter } from "next/router";
import Link from "next/link";

const ActiveAccount = () => {
  const router = useRouter();
  const {
    query: { username },
  } = router;
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
        <h5 className="font-mono mb-1 text-center -mt-52 text-xl">
          Welcome {username}
        </h5>
        <div className="absolute top-96 flex">
          <h1 className="text-3xl font-bold text-gray-700 items-center flex">
            Please check your email to active account
          </h1>
        </div>
      </div>
    </div>
  );
};

export default ActiveAccount;
