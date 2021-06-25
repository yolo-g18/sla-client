import AppLayout from "../components/layout/AppLayout";
import GoogleTask from "../components/kit/components/elements/data/GoogleTask";
import SlackTask from "../components/kit/components/elements/data/SlackTask";
import TasksList from "../components/kit/components/elements/data/TasksList";
import LessonsList from "../components/kit/components/elements/data/LessonsList";
import CalendarCardMonth from "../components/kit/components/elements/data/CalendarCardMonth";
import MessagesList from "../components/kit/components/elements/data/MessagesList";

const home = () => {
  return (
    <div>
      <AppLayout title="home" desc="home">
        <div>
          <div className="flex flex-col flex-wrap sm:flex-row ">
            <div className="w-full sm:w-1/2 xl:w-1/3">
              <div className="mb-4">
                <GoogleTask />
              </div>
              <div className="mb-4">
                <SlackTask />
              </div>
            </div>

            <div className="w-full sm:w-1/2 xl:w-1/3">
              <div className="mb-4 mx-0 sm:ml-4 xl:mr-4">
                <TasksList />
              </div>
              <div className="mb-4 sm:ml-4 xl:mr-4">
                <LessonsList />
              </div>
            </div>
            <div className="w-full sm:w-1/2 xl:w-1/3">
              <div className="mb-4">
                <CalendarCardMonth />
              </div>
              <div className="mb-4">
                <MessagesList />
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </div>
  );
};

export default home;
