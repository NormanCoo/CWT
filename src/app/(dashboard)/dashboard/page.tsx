import { CalendarView } from "@/components/dashboard/CalendarView";
import { TaskPanel } from "@/components/dashboard/TaskPanel";

export default function DashboardPage() {
  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-3.5rem)] lg:h-screen">
      <div className="flex-1 overflow-auto">
        <CalendarView />
      </div>
      <div className="w-full lg:w-80 xl:w-96 shrink-0 overflow-y-auto">
        <TaskPanel />
      </div>
    </div>
  );
}
