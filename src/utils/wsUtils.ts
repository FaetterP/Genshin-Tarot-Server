import { v4 } from "uuid";
import { WebSocket } from "ws";
import { TaskAwaiter } from "./TaskAwaiter";
import { getAllClients } from "../ws";
import { AnyResponse } from "../types/response";

export async function sendAndWait(ws: WebSocket, payload: any) {
  const taskAwaiter = new TaskAwaiter();
  const taskId = `task-${v4()}`;
  taskAwaiter.addTask(taskId);

  ws.send(JSON.stringify({ ...payload, taskId }));
  await taskAwaiter.done();
}

export async function sendToAllAndWait(payload: any) {
  const taskAwaiter = new TaskAwaiter();

  for (const ws of getAllClients()) {
    const taskId = `task-${v4()}`;
    taskAwaiter.addTask(taskId);
    ws.send(JSON.stringify({ ...payload, taskId }));
  }

  await taskAwaiter.done();
}

export function sendToAll<T = AnyResponse>(payload: T) {
  for (const ws of getAllClients()) {
    ws.send(JSON.stringify({ ...payload }));
  }
}
