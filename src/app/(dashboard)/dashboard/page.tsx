import { CalendarView } from "@/components/dashboard/CalendarView";
import { TaskPanel } from "@/components/dashboard/TaskPanel";

export default function DashboardPage() {
  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-3.5rem)] lg:h-screen">
      {/* Mobile: natural height, Desktop: fills remaining space */}
      <div className="lg:flex-1 overflow-auto">
        <CalendarView />
      </div>
      {/* Mobile: fills remaining vertical space with scroll, Desktop: fixed sidebar */}
      <div className="flex-1 lg:flex-none overflow-y-auto border-t lg:border-t-0 lg:border-l lg:w-80 xl:w-96">
        <TaskPanel />
      </div>
    </div>
  );
}
