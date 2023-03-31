import { ExtWebSocket } from "../../../types/wsTypes";
import { TaskAwaiter } from "../../utils/TaskAwaiter";

async function completeTask(ws: ExtWebSocket, payload: any) {
  const { taskId } = payload as { taskId: string };
  TaskAwaiter.completeTask(taskId);
}

export default { handlers: { completeTask } };
