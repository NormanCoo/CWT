export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

export type TaskInsert = Omit<Task, "id" | "created_at">;
export type TaskUpdate = Partial<TaskInsert>;

export interface AuthUser {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
}
