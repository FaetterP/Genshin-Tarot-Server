import { ExtWebSocket } from "../../types/wsTypes";
import { TaskCompleteTaskRequest } from "../../types/request";
import { TaskAwaiter } from "../../utils/TaskAwaiter";

async function completeTask(ws: ExtWebSocket, payload: any) {
  const { taskId } = payload as TaskCompleteTaskRequest;
  TaskAwaiter.completeTask(taskId);
}

export default { handlers: { completeTask } };
