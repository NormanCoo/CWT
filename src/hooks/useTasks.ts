"use client";

import { useEffect, useCallback } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useTaskStore } from "@/stores/useTaskStore";
import {
  fetchTasks,
  createTask as apiCreateTask,
  updateTask as apiUpdateTask,
  deleteTask as apiDeleteTask,
  subscribeToTasks,
} from "@/lib/supabase/tasks";
import type { Task, TaskInsert, TaskUpdate } from "@/types";

export function useTasks() {
  const user = useAuthStore((s) => s.user);
  const {
    setTasks,
    addTask,
    updateTask: updateLocalTask,
    removeTask,
    setLoading,
  } = useTaskStore();

  // Load tasks on mount / user change
  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetchTasks(user.id)
      .then((tasks) => {
        if (!cancelled) setTasks(tasks);
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, setTasks, setLoading]);

  // Realtime subscription
  useEffect(() => {
    if (!user) return;

    const subscription = subscribeToTasks(
      user.id,
      (task) => addTask(task),
      (task) => updateLocalTask(task.id, task),
      (id) => removeTask(id),
    );

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, addTask, updateLocalTask, removeTask]);

  const create = useCallback(
    async (data: TaskInsert) => {
      const pendingId = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      const optimistic: Task = {
        id: pendingId,
        user_id: data.user_id,
        title: data.title,
        description: data.description ?? null,
        start_time: data.start_time,
        end_time: data.end_time ?? null,
        status: data.status ?? "todo",
        priority: data.priority ?? "medium",
        created_at: new Date().toISOString(),
      };
      addTask(optimistic);

      try {
        const task = await apiCreateTask(data);
        removeTask(pendingId);
        addTask(task);
        return task;
      } catch (err) {
        removeTask(pendingId);
        throw err;
      }
    },
    [addTask, removeTask],
  );

  const update = useCallback(
    async (id: string, updates: TaskUpdate) => {
      const task = useTaskStore.getState().tasks.find((t) => t.id === id);
      if (task) updateLocalTask(id, { ...updates });

      try {
        return await apiUpdateTask(id, updates);
      } catch (err) {
        if (task) updateLocalTask(id, task);
        throw err;
      }
    },
    [updateLocalTask],
  );

  const remove = useCallback(
    async (id: string) => {
      const task = useTaskStore.getState().tasks.find((t) => t.id === id);
      removeTask(id);

      try {
        await apiDeleteTask(id);
      } catch (err) {
        if (task) addTask(task);
        throw err;
      }
    },
    [removeTask, addTask],
  );

  return { create, update, remove };
}
