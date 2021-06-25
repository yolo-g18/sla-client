import SideBar from "../sidebar/SideBar";
import { links } from "../links";
import { optionsListProfile } from "../optionsListProfile";
import Meta from "../site/Meta";
import Header from "../header/Header";

interface Props {
  title: string;
  desc: string;
  children: React.ReactNode;
}

const AppLayout = ({ title, desc, children }: Props) => {
  const ddmItems = [
    {
      label: "Settings",
    },
    {
      label: "Account",
    },
    {
      label: "Logout",
    },
  ];

  return (
    <div>
      <Meta pageTitle={title} description={desc} />
      <main className="bg-gray-100 dark:bg-gray-800 rounded-2xl h-screen overflow-hidden relative">
        <div className="flex items-start justify-between">
          <div className="h-screen hidden lg:block my-4 ml-1 shadow-lg relative w-80">
            <div className="bg-white h-full rounded-2xl dark:bg-gray-700">
              <SideBar />
            </div>
          </div>
          <div className="flex flex-col w-full pl-0 md:p-4 md:space-y-4">
            <Header />
            <div className="overflow-auto h-screen pb-24 pt-2 pr-2 pl-2 md:pt-0 md:pr-0 md:pl-0">
              {children}
            </div>
            <div>{/* footer */}</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
