"use client";

import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTaskStore } from "@/stores/useTaskStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CalendarView() {
  const view = useTaskStore((s) => s.view);
  const setView = useTaskStore((s) => s.setView);
  const selectedDate = useTaskStore((s) => s.selectedDate);
  const setSelectedDate = useTaskStore((s) => s.setSelectedDate);
  const tasks = useTaskStore((s) => s.tasks);
  const currentDate = new Date(selectedDate);

  function prevPeriod() {
    if (view === "month") {
      setSelectedDate(subMonths(currentDate, 1));
    } else {
      setSelectedDate(subWeeks(currentDate, 1));
    }
  }

  function nextPeriod() {
    if (view === "month") {
      setSelectedDate(addMonths(currentDate, 1));
    } else {
      setSelectedDate(addWeeks(currentDate, 1));
    }
  }

  const periodLabel =
    view === "month"
      ? format(currentDate, "MMMM yyyy")
      : `${format(startOfWeek(currentDate, { weekStartsOn: 1 }), "MMM d")} - ${format(endOfWeek(currentDate, { weekStartsOn: 1 }), "MMM d, yyyy")}`;

  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 }),
  });

  function tasksForDay(date: Date) {
    return tasks.filter((t) => isSameDay(new Date(t.start_time), date));
  }

  // Week view: 7 columns
  const weekDays =
    view === "week"
      ? eachDayOfInterval({
          start: startOfWeek(currentDate, { weekStartsOn: 1 }),
          end: endOfWeek(currentDate, { weekStartsOn: 1 }),
        })
      : [];

  const weekDayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={prevPeriod}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">{periodLabel}</h2>
          <Button variant="ghost" size="icon" onClick={nextPeriod}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedDate(new Date())}
          >
            Today
          </Button>
        </div>

        <div className="flex rounded-md border overflow-hidden">
          <button
            onClick={() => setView("month")}
            className={cn(
              "px-3 py-1.5 text-sm transition-colors",
              view === "month"
                ? "bg-primary text-primary-foreground"
                : "bg-background hover:bg-accent",
            )}
          >
            Month
          </button>
          <button
            onClick={() => setView("week")}
            className={cn(
              "px-3 py-1.5 text-sm transition-colors",
              view === "week"
                ? "bg-primary text-primary-foreground"
                : "bg-background hover:bg-accent",
            )}
          >
            Week
          </button>
        </div>
      </div>

      {/* Month View */}
      {view === "month" && (
        <div>
          {/* Week day headers */}
          <div className="grid grid-cols-7 mb-2">
            {weekDayNames.map((name) => (
              <div
                key={name}
                className="text-center text-xs font-medium text-muted-foreground py-2"
              >
                {name}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 border-l border-t rounded-lg overflow-hidden">
            {daysInMonth.map((date) => {
              const dayTasks = tasksForDay(date);
              const isToday = isSameDay(date, new Date());
              const isSelected = isSameDay(date, new Date(selectedDate));
              const isCurrentMonth = isSameMonth(date, currentDate);

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => setSelectedDate(date)}
                  className={cn(
                    "min-h-[80px] md:min-h-[100px] border-r border-b p-1.5 text-left transition-colors hover:bg-accent/50",
                    !isCurrentMonth && "bg-muted/30",
                    isSelected && "bg-accent",
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex items-center justify-center w-7 h-7 text-sm rounded-full",
                      isToday && "bg-primary text-primary-foreground font-medium",
                      !isToday && isCurrentMonth && "text-foreground",
                      !isToday && !isCurrentMonth && "text-muted-foreground",
                    )}
                  >
                    {format(date, "d")}
                  </span>
                  <div className="space-y-0.5 mt-0.5">
                    {dayTasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className={cn(
                          "text-[10px] px-1 py-0.5 rounded truncate leading-tight",
                          task.status === "done"
                            ? "bg-green-500/20 text-green-600 dark:text-green-400 line-through"
                            : task.status === "in-progress"
                              ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                              : "bg-muted-foreground/10 text-foreground",
                        )}
                      >
                        {task.title}
                      </div>
                    ))}
                    {dayTasks.length > 3 && (
                      <div className="text-[10px] text-muted-foreground px-1">
                        +{dayTasks.length - 3} more
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Week View */}
      {view === "week" && (
        <div>
          <div className="grid grid-cols-7 mb-2">
            {weekDays.map((date) => {
              const isToday = isSameDay(date, new Date());
              const isSelected = isSameDay(date, new Date(selectedDate));
              const dayTasks = tasksForDay(date);

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => setSelectedDate(date)}
                  className="text-center"
                >
                  <div className="text-xs text-muted-foreground">
                    {format(date, "EEE")}
                  </div>
                  <div
                    className={cn(
                      "inline-flex items-center justify-center w-9 h-9 text-sm rounded-full mt-1",
                      isToday && "bg-primary text-primary-foreground font-medium",
                      isSelected && !isToday && "bg-accent",
                    )}
                  >
                    {format(date, "d")}
                  </div>
                  {dayTasks.length > 0 && (
                    <div className="flex justify-center gap-0.5 mt-1">
                      {dayTasks.slice(0, 4).map((t) => (
                        <div
                          key={t.id}
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            t.status === "done"
                              ? "bg-green-500"
                              : t.status === "in-progress"
                                ? "bg-blue-500"
                                : "bg-muted-foreground",
                          )}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Week time slots */}
          <div className="mt-4 space-y-1">
            {weekDays.map((date) => {
              const dayTasks = tasksForDay(date);
              if (dayTasks.length === 0) return null;
              return (
                <div
                  key={date.toISOString()}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent/50 cursor-pointer"
                  onClick={() => setSelectedDate(date)}
                >
                  <div className="w-16 text-right text-xs text-muted-foreground pt-1 shrink-0">
                    {format(date, "MMM d")}
                  </div>
                  <div className="flex-1 space-y-1">
                    {dayTasks.map((task) => (
                      <div
                        key={task.id}
                        className={cn(
                          "text-sm px-2 py-1 rounded",
                          task.status === "done"
                            ? "bg-green-500/10 line-through text-muted-foreground"
                            : task.status === "in-progress"
                              ? "bg-blue-500/10"
                              : "bg-muted",
                        )}
                      >
                        <span className="font-medium">{task.title}</span>
                        {task.start_time && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            {format(new Date(task.start_time), "HH:mm")}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
