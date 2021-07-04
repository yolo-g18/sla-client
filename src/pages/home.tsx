import SimpleLevelsCard from "../components/card/SimpleLevelsCard";
import AppLayout2 from "../components/layout/AppLayput2";

const home = () => {
  return (
    <div>
      <AppLayout2 title="home" desc="home">
        <div className="overflow-auto h-screen pb-24 px-4 md:px-6">
          <h1 className="text-4xl font-semibold text-gray-800 dark:text-white">
            Home
          </h1>
          <h2 className="text-md text-gray-400">latest</h2>
          {/* <div className="flex bg-white">
            <SimpleLevelsCard title="PRJ301" learning={54} notStudied={120} />
          </div> */}
        </div>
      </AppLayout2>
    </div>
  );
};

export default home;
