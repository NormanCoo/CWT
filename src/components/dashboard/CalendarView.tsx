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
import { ChevronLeft, ChevronRight, Plus, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useTaskStore } from "@/stores/useTaskStore";
import { useChineseCalendar } from "@/hooks/useChineseCalendar";
import { useTasks } from "@/hooks/useTasks";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TaskDialog } from "./TaskDialog";

export function CalendarView() {
  const user = useAuthStore((s) => s.user);
  const { create } = useTasks();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogDate, setDialogDate] = useState<Date | undefined>();
  const view = useTaskStore((s) => s.view);
  const setView = useTaskStore((s) => s.setView);
  const selectedDate = useTaskStore((s) => s.selectedDate);
  const setSelectedDate = useTaskStore((s) => s.setSelectedDate);
  const tasks = useTaskStore((s) => s.tasks);
  const { theme, setTheme } = useTheme();
  const currentDate = new Date(selectedDate);

  const monthRange = {
    start: startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 }),
  };
  const weekRange = {
    start: startOfWeek(currentDate, { weekStartsOn: 1 }),
    end: endOfWeek(currentDate, { weekStartsOn: 1 }),
  };
  const range = view === "month" ? monthRange : weekRange;
  const { solarTerms, holidays } = useChineseCalendar(range.start, range.end);

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
    start: monthRange.start,
    end: monthRange.end,
  });

  function tasksForDay(date: Date) {
    return tasks.filter((t) => isSameDay(new Date(t.start_time), date));
  }

  const weekDays =
    view === "week"
      ? eachDayOfInterval({ start: weekRange.start, end: weekRange.end })
      : [];

  const weekDayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const dateStr = (date: Date) => format(date, "yyyy-MM-dd");

  return (
    <div className="p-2 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 md:mb-6">
        <div className="flex items-center gap-1 md:gap-2">
          <Button variant="ghost" size="icon" onClick={prevPeriod} className="h-8 w-8 md:h-10 md:w-10">
            <ChevronLeft className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>
          <h2 className="text-sm md:text-lg font-semibold min-w-[130px] md:min-w-[200px] text-center">{periodLabel}</h2>
          <Button variant="ghost" size="icon" onClick={nextPeriod} className="h-8 w-8 md:h-10 md:w-10">
            <ChevronRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 md:h-10 md:w-10"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <div className="flex rounded-full border overflow-hidden">
            <button
              onClick={() => setView("month")}
              className={cn(
                "px-2 md:px-3 py-1.5 text-xs md:text-sm transition-colors whitespace-nowrap",
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
                "px-2 md:px-3 py-1.5 text-xs md:text-sm transition-colors whitespace-nowrap",
                view === "week"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background hover:bg-accent",
              )}
            >
              Week
            </button>
          </div>
        </div>
      </div>

      {/* Swipeable calendar content */}
      <div className="overflow-hidden">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.05}
          onDragEnd={(_, info) => {
            const threshold = 60;
            if (info.offset.x < -threshold) {
              nextPeriod();
            } else if (info.offset.x > threshold) {
              prevPeriod();
            }
          }}
        >
      {/* Month View */}
      {view === "month" && (
        <div>
          <div className="grid grid-cols-7 mb-1 md:mb-2">
            {weekDayNames.map((name, i) => (
              <div
                key={name}
                className={cn(
                  "text-center text-[10px] md:text-xs font-medium py-1 md:py-2",
                  i >= 5 ? "text-red-500/70" : "text-muted-foreground",
                )}
              >
                {name}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 border-l border-t rounded-lg overflow-hidden">
            {daysInMonth.map((date) => {
              const dayTasks = tasksForDay(date);
              const isToday = isSameDay(date, new Date());
              const isSelected = isSameDay(date, new Date(selectedDate));
              const isCurrentMonth = isSameMonth(date, currentDate);
              const dow = date.getDay();
              const ds = dateStr(date);
              const term = solarTerms.get(ds);
              const holiday = holidays.get(ds);
              const isWeekend = dow === 0 || dow === 6;

              return (
                <button
                  key={ds}
                  onClick={() => {
                    setSelectedDate(date);
                    // Tap selected date again to open create dialog
                    if (isSelected) {
                      setDialogDate(date);
                      setDialogOpen(true);
                    }
                  }}
                  className={cn(
                    "min-h-[52px] md:min-h-[120px] border-r border-b text-left transition-colors hover:bg-accent/50",
                    !isCurrentMonth && "bg-muted/30",
                    isSelected && "bg-accent",
                    isWeekend && isCurrentMonth && "bg-red-500/5",
                  )}
                >
                  <div className="px-0.5 md:px-1.5">
                    <span
                      className={cn(
                        "inline-flex items-center justify-center w-6 h-6 md:w-7 md:h-7 text-[11px] md:text-sm rounded-full",
                        isToday && "bg-primary text-primary-foreground font-medium",
                        !isToday && isCurrentMonth && (isWeekend ? "text-red-500/70" : "text-foreground"),
                        !isToday && !isCurrentMonth && "text-muted-foreground",
                      )}
                    >
                      {format(date, "d")}
                    </span>

                    {/* Mobile: solar term/holiday + dots */}
                    <div className="md:hidden space-y-0.5 mt-0.5">
                      {(term || holiday) && (
                        <div className="text-[7px] leading-tight">
                          {term && <span className="text-green-600 dark:text-green-400">{term}</span>}
                          {term && holiday && <span className="text-muted-foreground"> </span>}
                          {holiday && <span className="text-red-500 dark:text-red-400">{holiday}</span>}
                        </div>
                      )}
                      <div className="flex gap-0.5 flex-wrap items-center">
                        {dayTasks.slice(0, 4).map((task) => (
                          <div
                            key={task.id}
                            className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              task.status === "done"
                                ? "bg-green-500"
                                : task.status === "in-progress"
                                  ? "bg-blue-500"
                                  : "bg-muted-foreground",
                            )}
                          />
                        ))}
                        {dayTasks.length > 4 && (
                          <span className="text-[7px] text-muted-foreground">+{dayTasks.length - 4}</span>
                        )}
                      </div>
                    </div>

                    {/* Desktop: full info */}
                    <div className="hidden md:block">
                      {term && (
                        <div className="text-[9px] text-green-600 dark:text-green-400 leading-tight mt-0.5 px-0.5">
                          {term}
                        </div>
                      )}
                      {holiday && (
                        <div className="text-[9px] text-red-500 dark:text-red-400 leading-tight mt-0.5 px-0.5 truncate">
                          {holiday}
                        </div>
                      )}
                      <div className="space-y-0.5 mt-0.5">
                        {dayTasks.slice(0, 2).map((task) => (
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
                        {dayTasks.length > 2 && (
                          <div className="text-[10px] text-muted-foreground px-1">
                            +{dayTasks.length - 2} more
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDialogDate(date);
                            setDialogOpen(true);
                          }}
                          className="text-[10px] text-muted-foreground hover:text-foreground px-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
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
              const ds = dateStr(date);
              const term = solarTerms.get(ds);
              const holiday = holidays.get(ds);
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;

              return (
                <button
                  key={ds}
                  onClick={() => setSelectedDate(date)}
                  className="text-center"
                >
                  <div className={cn("text-xs", isWeekend ? "text-red-500/70" : "text-muted-foreground")}>
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
                  {term && (
                    <div className="text-[9px] text-green-600 dark:text-green-400 mt-0.5">
                      {term}
                    </div>
                  )}
                  {holiday && (
                    <div className="text-[9px] text-red-500 dark:text-red-400 mt-0.5">
                      {holiday}
                    </div>
                  )}
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
                  key={dateStr(date)}
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

        </motion.div>
      </div>

      {user && (
        <TaskDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSave={async (data) => {
            try {
              await create({ ...data, user_id: user.id });
            } catch (e) {
              console.error("Failed to create task:", e);
              const msg = e instanceof Error ? e.message : "Unknown error";
              alert(`Error: ${msg}`);
            }
            setDialogOpen(false);
          }}
          defaultDate={dialogDate}
        />
      )}

      {/* Mobile FAB */}
      <button
        onClick={() => {
          setDialogDate(new Date(selectedDate));
          setDialogOpen(true);
        }}
        className="lg:hidden fixed bottom-6 right-6 z-30 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center active:scale-95 transition-transform"
        aria-label="Add task"
      >
        <Plus className="h-7 w-7" />
      </button>
    </div>
  );
}
