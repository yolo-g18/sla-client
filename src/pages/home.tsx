import SimpleLevelsCard from "../components/card/SimpleLevelsCard";
import AppLayout from "../components/layout/AppLayout";

const home = () => {
  return (
    <div>
      <AppLayout title="home" desc="home">
        <div className="overflow-auto h-screen pb-24 px-4 md:px-6">
          <h1 className="text-4xl font-semibold text-gray-800 dark:text-white">
            Overview
          </h1>
          <h2 className="text-md text-gray-400">latest</h2>
          <div className="flex bg-white">
            <SimpleLevelsCard title="PRJ301" learning={54} notStudied={120} />
            <SimpleLevelsCard title="PRJ301" learning={54} notStudied={120} />
            <SimpleLevelsCard title="PRJ301" learning={54} notStudied={120} />
          </div>
        </div>
      </AppLayout>
    </div>
  );
};

export default home;
