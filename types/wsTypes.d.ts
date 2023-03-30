import { WebSocket } from "ws";
import { CycleController } from "../src/game/CycleController";
import { Player } from "../src/game/Player";

export declare class ExtWebSocket extends WebSocket {
  cycleController: CycleController;
  player: Player;
  isAlive: boolean;
}
