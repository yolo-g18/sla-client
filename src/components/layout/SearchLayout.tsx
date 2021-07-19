import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "../../utils/TypeScript";
import AppLayout from "./AppLayout";

interface Props {
  children: React.ReactNode;
}

const SearchLayout = (props: Props) => {
  const { search } = useSelector((state: RootStore) => state);
  const dispatch = useDispatch();
  const router = useRouter();

  const [type, setType] = useState<any>();
  const [searchBy, setSearchBy] = useState<any>();

  useEffect(() => {
    if (router.pathname.indexOf("/search/set") !== -1) {
      setType(0);
      setSearchBy(0);
    }
    if (router.pathname.indexOf("/search/set/tag") !== -1) {
      setType(0);
      setSearchBy(1);
    }
    if (router.pathname.indexOf("/search/user") !== -1) {
      setType(1);
      setSearchBy(0);
    }
    if (router.pathname.indexOf("/search/room") !== -1) {
      setType(2);
      setSearchBy(0);
    }
  }, []);

  useEffect(() => {
    if (type === 0) {
      if (searchBy == 0) router.push("/search/set");
      if (searchBy == 1) router.push("/search/set/tag");
    }
    if (type === 1) {
      router.push("/search/user");
    }
    if (type === 2) {
      router.push("/search/room");
    }
  }, [type, searchBy]);

  console.log("type " + type);
  console.log("search by  " + searchBy);

  return (
    <div>
      <AppLayout title="MAS-SLA" desc="Search">
        <div className="mt-6 w-3/4 mx-auto grid lg:grid-cols-4 grid-cols-1">
          <div className="col-span-1  h-96 px-4">
            <div className="my-4">
              <p className="text-md text-gray-500 font-medium">type</p>
            </div>
            <div className="flex flex-col gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="type"
                  className="h-5 w-5 text-red-600"
                  onChange={() => setType(0)}
                  checked={type === 0}
                  value={type}
                />
                <span className="ml-2 ">Sets</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="type"
                  className="h-5 w-5 text-red-600"
                  onChange={() => setType(1)}
                  checked={type === 1}
                  value={type}
                />
                <span className="ml-2 ">Users</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="type"
                  className="h-5 w-5 text-red-600"
                  onChange={() => setType(2)}
                  checked={type === 2}
                  value={type}
                />
                <span className="ml-2 ">Rooms</span>
              </label>
            </div>
            {router.pathname.indexOf("/search/set") !== -1 ? (
              <div>
                <div className="mb-4 mt-12">
                  <p className="text-md text-gray-500 font-medium">search by</p>
                </div>
                <div className="flex flex-col gap-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="searchBy"
                      className="h-5 w-5 text-red-600"
                      onChange={() => setSearchBy(0)}
                      checked={searchBy === 0}
                      value={searchBy}
                    />
                    <span className="ml-2 ">Title</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="searchBy"
                      className="h-5 w-5 text-red-600"
                      onChange={() => {
                        setSearchBy(1);
                      }}
                      checked={searchBy === 1}
                      value={searchBy}
                    />
                    <span className="ml-2 ">Tag</span>
                  </label>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-4 mt-12">
                  <p className="text-md text-gray-500 font-medium">search by</p>
                </div>
                <div className="flex flex-col gap-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="search"
                      className="h-5 w-5 text-red-600"
                      onChange={() => setSearchBy(0)}
                      checked={searchBy === 0}
                      value={searchBy}
                    />
                    <span className="ml-2 ">Title</span>
                  </label>
                </div>
              </div>
            )}
          </div>
          <div className="col-span-3  h-96">
            <div className="h-16">
              <p className="text-4xl font-bold">{search.keyword}</p>
            </div>
            <div className="h-96 bg-green-200">{props.children}</div>
          </div>
        </div>
      </AppLayout>
    </div>
  );
};

export default SearchLayout;
