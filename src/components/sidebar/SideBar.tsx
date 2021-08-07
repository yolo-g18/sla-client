import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

interface Props {
  headerText?: string;
  headerImg?: string;
  links: Links[];
  bottomLink?: { label: string; icon?: JSX.Element; link?: string };
  withDivider?: boolean;
}
interface Links {
  label: string;
  selected?: boolean;
  icon?: JSX.Element;
  notifications?: number;
  link?: string | undefined;
}

const SideBar = (props: Props) => {
  const router = useRouter();
  const withHeader = !!props.headerText || props.headerImg;

  return (
    <div className="relative">
      <div className="flex flex-col sm:flex-row sm:justify-around">
        <div className="w-full">
          {withHeader && (
            <div className="flex items-center justify-start mx-6">
              {props.headerImg && (
                <img className="h-10" src="/icons/rocket.svg" />
              )}
              {props.headerText && (
                <span
                  className={`text-gray-600 dark:text-gray-300 ml-4 text-2xl font-bold`}
                >
                  {props.headerText}
                </span>
              )}
            </div>
          )}

          <nav
            className={`border-black${
              props.withDivider ? "divide-y divide-gray-200" : ""
            }`}
          >
            {props.links.map((link) => {
              return (
                <Link href={link.link ? link.link : ""}>
                  <a
                    className={`hover:text-gray-900 hover:bg-gray-100 bg-white flex py-1 my-3 transition-colors dark:hover:text-white dark:hover:bg-gray-600 duration-200 ${
                      router.pathname.indexOf(link.link ? link.link : "") !== -1
                        ? "justify-start border-l-2 border-yellow-500"
                        : ""
                    } `}
                  >
                    {link.icon}
                    <span className="mx-4 text-md w-40 ">{link.label}</span>
                  </a>
                </Link>
              );
            })}
          </nav>
          {props.bottomLink && (
            <div className="absolute bottom-0 my-10">
              <a
                className={`text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-200 flex items-center py-4`}
                href={props.bottomLink.link || "#"}
              >
                {props.bottomLink.icon}

                <span className="mx-4 font-medium">
                  {props.bottomLink.label}
                </span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default SideBar;
