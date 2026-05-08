"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import { useTaskStore } from "@/stores/useTaskStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChineseCalendar } from "@/hooks/useChineseCalendar";
import { useTasks } from "@/hooks/useTasks";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TaskDialog } from "./TaskDialog";
import type { Task, TaskStatus } from "@/types";

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

const nextStatus: Record<TaskStatus, TaskStatus> = {
  todo: "in-progress",
  "in-progress": "done",
  done: "todo",
};

export function TaskPanel() {
  const user = useAuthStore((s) => s.user);
  const selectedDate = useTaskStore((s) => s.selectedDate);
  const getTasksForDate = useTaskStore((s) => s.getTasksForDate);
  const { create, update, remove } = useTasks();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const date = new Date(selectedDate);
  const dayTasks = getTasksForDate(date);
  const { getLunarDate } = useChineseCalendar(date, date);
  const lunarDate = getLunarDate(date);

  const sortedTasks = [...dayTasks].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  function handleCreate(data: { title: string; description: string | null; start_time: string; end_time: string | null; priority: Task["priority"]; status: TaskStatus }) {
    if (!user) return;
    create({ ...data, user_id: user.id });
    setDialogOpen(false);
  }

  function handleEdit(data: { title: string; description: string | null; start_time: string; end_time: string | null; priority: Task["priority"]; status: TaskStatus }) {
    if (!editingTask) return;
    update(editingTask.id, data);
    setEditingTask(null);
  }

  function handleStatusToggle(task: Task) {
    update(task.id, { status: nextStatus[task.status] });
  }

  function handleDelete(task: Task) {
    if (confirm(`Delete "${task.title}"?`)) {
      remove(task.id);
    }
  }

  return (
    <div className="p-4 md:p-6 border-l">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold">{format(date, "EEEE, MMMM d, yyyy")}</h3>
            {lunarDate && (
              <p className="text-xs text-green-600 dark:text-green-400">
                {lunarDate}
              </p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="h-3.5 w-3.5" />
            New
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {dayTasks.length} task{dayTasks.length !== 1 ? "s" : ""}
        </p>
      </div>

      {sortedTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm text-muted-foreground">No tasks for this day</p>
          <Button
            variant="link"
            size="sm"
            onClick={() => setDialogOpen(true)}
          >
            Add a task
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedTasks.map((task) => (
            <div
              key={task.id}
              className="rounded-lg border p-3 transition-colors hover:bg-accent/50 cursor-pointer"
              onClick={() => setEditingTask(task)}
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
                <div className="flex items-center gap-1 shrink-0">
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusToggle(task);
                    }}
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium cursor-pointer",
                      statusColors[task.status],
                    )}
                    title="Click to cycle status"
                  >
                    {statusLabels[task.status]}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(task);
                    }}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1"
                    title="Delete task"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
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

      <TaskDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingTask(null);
        }}
        onSave={handleCreate}
        defaultDate={date}
      />

      <TaskDialog
        open={!!editingTask}
        onOpenChange={(open) => {
          if (!open) setEditingTask(null);
        }}
        onSave={handleEdit}
        task={editingTask}
      />
    </div>
  );
}
