import AppLayout2 from "../components/layout/AppLayout";
import { useEffect, useState } from "react";
import Schedule from "../components/schedule/Schedule";

const schedule = () => {
  return (
    <div>
      <AppLayout2 title="library" desc="library">
        <div className="overflow-auto pb-24 px-4 md:px-6">
          <h1 className="text-4xl font-semibold text-gray-800 dark:text-white">
            Schedule
          </h1>
          <div className="grid grid-cols-4 py-6 h-screen">
            <div className="col-span-3">
              <Schedule />
            </div>
            <div className="col-span-1"></div>
          </div>
        </div>
      </AppLayout2>
    </div>
  );
};

export default schedule;
