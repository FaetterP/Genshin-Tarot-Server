import { WebSocket } from "ws";
import { CycleController } from "../game/CycleController";
import { Player } from "../game/Player";

export declare class ExtWebSocket extends WebSocket {
  cycleController: CycleController;
  player: Player;
  isAlive: boolean;
}
