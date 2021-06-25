import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import LittleSidebar from "../components/kit/components/navigation/sidebar/LittleSidebar";
import SideBar from "../components/kit/components/navigation/sidebar/Sidebar";

import { links } from "../components/links";

export default function Home() {
  const linksWithIcons: any = [];
  links.map((link) => {
    linksWithIcons.push({
      label: link.label,
      icon: (
        <svg
          width={link.width}
          height={link.height}
          className={link.className}
          fill={link.fill}
          viewBox={link.viewBox}
          xmlns={link.xmlns}
        >
          <path d={link.d} />
        </svg>
      ),
    });
  });

  return (
    <div>
      <main className="bg-gray-100 dark:bg-gray-800 rounded-2xl h-screen overflow-hidden relative">
        <div className="flex items-start justify-between">
          <SideBar
            headerText="SLA"
            withBorder={true}
            links={linksWithIcons}
            withDivider={true}
          />
          <div className="overflow-auto h-screen pb-24 pt-2 pr-2 pl-2 md:pt-0 md:pr-0 md:pl-0"></div>
        </div>
      </main>
    </div>
  );
}
