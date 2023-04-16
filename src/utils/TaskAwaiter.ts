import { Event } from "./Event";

export class TaskAwaiter {
  public static allTasks: string[] = [];
  public static allAwaiters: TaskAwaiter[] = [];

  private tasks: string[] = [];
  private e_onTasksCompleted = new Event();

  constructor() {
    TaskAwaiter.allAwaiters.push(this);
  }

  addTask(taskId: string) {
    if (!this.tasks.includes(taskId)) {
      this.tasks.push(taskId);
    }
    if (!TaskAwaiter.allTasks.includes(taskId)) {
      TaskAwaiter.allTasks.push(taskId);
    }
  }

  checkTasks() {
    for (const taskId of this.tasks) {
      if (TaskAwaiter.allTasks.includes(taskId)) {
        return;
      }
    }

    this.e_onTasksCompleted.Invoke(null);
  }

  async done() {
    return new Promise<void>((resolve, reject) => {
      this.e_onTasksCompleted.AddListener(() => {
        TaskAwaiter.allAwaiters = TaskAwaiter.allAwaiters.filter(
          (item) => item !== this
        );
        resolve();
      });
    });
  }

  static completeTask(taskId: string) {
    if (!TaskAwaiter.allTasks.includes(taskId)) {
      throw new Error("task not found");
    }

    TaskAwaiter.allTasks = TaskAwaiter.allTasks.filter(
      (item) => item != taskId
    );

    for (const awaiter of TaskAwaiter.allAwaiters) {
      awaiter.checkTasks();
    }
  }
}
