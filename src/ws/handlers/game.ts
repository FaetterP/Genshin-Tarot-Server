import { ExtWebSocket } from "../../../types/wsTypes";

async function startGame(ws: ExtWebSocket, payload: any) {
  ws.cycleController.startGame();
}

export default { handlers: { startGame } };
