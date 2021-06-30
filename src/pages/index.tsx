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
    </div>
  );
}
