"use client";

import { format } from "date-fns";
import { useTaskStore } from "@/stores/useTaskStore";
import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/types";

const statusLabels: Record<TaskStatus, string> = {
  todo: "Todo",
  "in-progress": "In Progress",
  done: "Done",
};

const statusColors: Record<TaskStatus, string> = {
  todo: "bg-muted-foreground/20 text-foreground",
  "in-progress": "bg-blue-500/20 text-blue-600 dark:text-blue-400",
  done: "bg-green-500/20 text-green-600 dark:text-green-400",
};

export function TaskPanel() {
  const selectedDate = useTaskStore((s) => s.selectedDate);
  const getTasksForDate = useTaskStore((s) => s.getTasksForDate);

  const date = new Date(selectedDate);
  const dayTasks = getTasksForDate(date);

  const sortedTasks = [...dayTasks].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="p-4 md:p-6 border-l">
      <div className="mb-4">
        <h3 className="text-base font-semibold">{format(date, "EEEE, MMMM d, yyyy")}</h3>
        <p className="text-sm text-muted-foreground">
          {dayTasks.length} task{dayTasks.length !== 1 ? "s" : ""}
        </p>
      </div>

      {sortedTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm text-muted-foreground">No tasks for this day</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedTasks.map((task) => (
            <div
              key={task.id}
              className="rounded-lg border p-3 transition-colors hover:bg-accent/50"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      task.status === "done" && "line-through text-muted-foreground",
                    )}
                  >
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                </div>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium shrink-0",
                    statusColors[task.status as TaskStatus],
                  )}
                >
                  {statusLabels[task.status as TaskStatus]}
                </span>
              </div>
              {task.start_time && (
                <div className="mt-2 text-xs text-muted-foreground">
                  {format(new Date(task.start_time), "HH:mm")}
                  {task.end_time &&
                    ` - ${format(new Date(task.end_time), "HH:mm")}`}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
