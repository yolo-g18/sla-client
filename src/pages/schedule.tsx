import AppLayout2 from "../components/layout/AppLayout";
import { useEffect, useState } from "react";
import Schedule from "../components/schedule/Schedule";
import Calendar from "../components/schedule/Calendar";

const schedule = () => {
  return (
    <div>
      <AppLayout2 title="library" desc="library">
        <div className=" w-full grid grid-cols-1 gap-1 lg:grid-cols-4">
          <div className="col-span-1 bg-red-200"></div>
          <div className="lg:col-span-3 col-span-1 h-full">
            <Calendar />
          </div>
        </div>
      </AppLayout2>
    </div>
  );
};

export default schedule;
