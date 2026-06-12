import { v4 } from "uuid";
import { WebSocket } from "ws";
import { ExtWebSocket } from "../types/wsTypes";
import { TaskAwaiter } from "./TaskAwaiter";
import { getAllClients, sendResponseToAdmin } from "../ws";
import { AnyResponse } from "../types/response";

const pendingResponses = new Map<string, (data: any) => void>();

export async function sendAndWait<T = void>(ws: WebSocket, payload: any): Promise<T> {
  const targetPlayerId = (ws as ExtWebSocket).player?.ID;
  const taskId = `task-${v4()}`;
  sendResponseToAdmin({ ...payload, taskId }, "send", targetPlayerId);
  const promise = new Promise<T>((resolve) => {
    pendingResponses.set(taskId, resolve);
  });
  ws.send(JSON.stringify({ ...payload, taskId }));
  return promise;
}

export function resolveTask(taskId: string, data?: any) {
  const resolve = pendingResponses.get(taskId);
  if (resolve) {
    resolve(data);
    pendingResponses.delete(taskId);
  }
}

export async function sendToAllAndWait<T extends AnyResponse>(payload: T) {
  sendResponseToAdmin(payload, "sendToAllAndWait");

  const taskAwaiter = new TaskAwaiter();

  for (const ws of getAllClients()) {
    const taskId = `task-${v4()}`;
    taskAwaiter.addTask(taskId);
    ws.send(JSON.stringify({ ...payload, taskId }));
  }

  await taskAwaiter.done();
}

export async function sendToEachAndWait(payloadFn: (ws: ExtWebSocket) => any): Promise<void> {
  const taskAwaiter = new TaskAwaiter();
  for (const ws of getAllClients()) {
    const taskId = `task-${v4()}`;
    const payload = payloadFn(ws as ExtWebSocket);
    taskAwaiter.addTask(taskId);
    sendResponseToAdmin({ ...payload, taskId }, "send", (ws as ExtWebSocket).player?.ID);
    ws.send(JSON.stringify({ ...payload, taskId }));
  }
  await taskAwaiter.done();
}

export function sendToAll<T extends AnyResponse>(payload: T) {
  sendResponseToAdmin(payload, "sendToAll");

  for (const ws of getAllClients()) {
    ws.send(JSON.stringify({ ...payload }));
  }
}
