import { create } from "zustand";
import { startOfDay, isSameDay } from "date-fns";
import type { Task } from "@/types";

interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  selectedDate: string;
  view: "month" | "week";
  loading: boolean;
  setTasks: (tasks: Task[]) => void;
  setSelectedTask: (task: Task | null) => void;
  setSelectedDate: (date: Date) => void;
  setView: (view: "month" | "week") => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  removeTask: (id: string) => void;
  setLoading: (loading: boolean) => void;
  getTasksForDate: (date: Date) => Task[];
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  selectedTask: null,
  selectedDate: startOfDay(new Date()).toISOString(),
  view: "month",
  loading: false,
  setTasks: (tasks) => set({ tasks }),
  setSelectedTask: (task) => set({ selectedTask: task }),
  setSelectedDate: (date) => set({ selectedDate: startOfDay(date).toISOString() }),
  setView: (view) => set({ view }),
  addTask: (task) =>
    set((state) => ({
      tasks: state.tasks.some((t) => t.id === task.id)
        ? state.tasks.map((t) => (t.id === task.id ? task : t))
        : [...state.tasks, task],
    })),
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),
  removeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),
  setLoading: (loading) => set({ loading }),
  getTasksForDate: (date) => {
    const { tasks } = get();
    return tasks.filter((t) => isSameDay(new Date(t.start_time), date));
  },
}));
