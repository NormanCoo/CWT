import { createClient } from "./client";
import type { Task, TaskInsert, TaskUpdate } from "@/types";

export async function fetchTasks(userId: string): Promise<Task[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("start_time", { ascending: true });

  if (error) throw error;
  return data as Task[];
}

export async function createTask(data: TaskInsert): Promise<Task> {
  const supabase = createClient();
  const { data: task, error } = await supabase
    .from("tasks")
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return task as Task;
}

export async function updateTask(
  id: string,
  updates: TaskUpdate,
): Promise<Task> {
  const supabase = createClient();
  const { data: task, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return task as Task;
}

export async function deleteTask(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;
}

export function subscribeToTasks(
  userId: string,
  onInsert: (task: Task) => void,
  onUpdate: (task: Task) => void,
  onDelete: (id: string) => void,
) {
  const supabase = createClient();
  const channelName = `tasks-${userId}-${Date.now()}`;
  return supabase
    .channel(channelName)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "tasks",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => onInsert(payload.new as Task),
    )
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "tasks",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => onUpdate(payload.new as Task),
    )
    .on(
      "postgres_changes",
      {
        event: "DELETE",
        schema: "public",
        table: "tasks",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => onDelete(payload.old.id),
    )
    .subscribe();
}
