import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { putSearchKeyword } from "../../redux/actions/searchAction";
import { RootStore } from "../../utils/TypeScript";
import AppLayout from "./AppLayout";

interface Props {
  children: React.ReactNode;
}

const SearchLayout = (props: Props) => {
  const { search } = useSelector((state: RootStore) => state);
  const dispatch = useDispatch();
  const router = useRouter();
  const [t, setT] = useState<number>();
  const [sb, setSb] = useState<number>();
  const {
    query: { type, search_query, searchBy },
  } = router;

  useEffect(() => {
    if (type === "set") {
      setT(0);
      if (searchBy === "title") {
        dispatch(
          putSearchKeyword(search_query ? search_query.toString() : "", 0, 0)
        );
      }
      if (searchBy === "tag") {
        setSb(1);
        dispatch(
          putSearchKeyword(search_query ? search_query.toString() : "", 0, 1)
        );
      }
    }
    if (type === "user") {
      setT(1);
      setSb(0);
      dispatch(
        putSearchKeyword(search_query ? search_query.toString() : "", 1, 0)
      );
    }
    if (type === "room") {
      setT(2);
      setSb(0);
      dispatch(
        putSearchKeyword(search_query ? search_query.toString() : "", 2, 0)
      );
    }
  }, [type, search_query, searchBy]);

  useEffect(() => {
    if (t === 0) {
      if (sb == 0)
        router.push(`/search/set/title?search_query=${search.keyword}`);
      if (sb == 1)
        router.push(`/search/set/tag?search_query=${search.keyword}`);
    }
    if (t === 1) {
      router.push(`/search/user/title?search_query=${search.keyword}`);
    }
    if (t === 2) {
      router.push(`/search/room/title?search_query=${search.keyword}`);
    }
  }, [t, sb]);

  return (
    <div>
      <AppLayout
        title={`Result | ${search_query}`}
        desc="Search"
        search={search_query ? search_query.toString() : ""}
      >
        <div className="mt-6 w-3/4 mx-auto grid lg:grid-cols-4 grid-cols-1 h-screen">
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
                  onChange={() => setT(0)}
                  checked={t === 0}
                />
                <span className="ml-2 ">Sets</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="type"
                  className="h-5 w-5 text-red-600"
                  onChange={() => setT(1)}
                  checked={t === 1}
                />
                <span className="ml-2 ">Users</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="type"
                  className="h-5 w-5 text-red-600"
                  onChange={() => setT(2)}
                  checked={t === 2}
                />
                <span className="ml-2 ">Rooms</span>
              </label>
            </div>

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
                    onChange={() => setSb(0)}
                    checked={sb === 0}
                  />
                  <span className="ml-2 ">Title</span>
                </label>
                {search.type === 0 ? (
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="searchBy"
                      className="h-5 w-5 text-red-600"
                      onChange={() => {
                        setSb(1);
                      }}
                      checked={sb === 1}
                    />
                    <span className="ml-2 ">Tag</span>
                  </label>
                ) : null}
              </div>
            </div>
          </div>
          <div className="col-span-3  h-96">
            <div className="h-16">
              <p className="text-4xl font-bold">{search.keyword}</p>
            </div>
            <div className="h-screen ">{props.children}</div>
          </div>
        </div>
      </AppLayout>
    </div>
  );
};

export default SearchLayout;
