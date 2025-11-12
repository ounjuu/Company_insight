// src/store/taskStore.ts
import { create } from "zustand";

type TaskType = "general" | "industry";

interface TaskState {
  selectedTask: TaskType;
  setSelectedTask: (task: TaskType) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  selectedTask: "general",
  setSelectedTask: (task: TaskType) => set({ selectedTask: task }),
}));
