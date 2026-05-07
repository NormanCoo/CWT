import { create } from "zustand";
import type { Task } from "@/types";

interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  loading: boolean;
  setTasks: (tasks: Task[]) => void;
  setSelectedTask: (task: Task | null) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  removeTask: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  selectedTask: null,
  loading: false,
  setTasks: (tasks) => set({ tasks }),
  setSelectedTask: (task) => set({ selectedTask: task }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),
  removeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),
  setLoading: (loading) => set({ loading }),
}));
