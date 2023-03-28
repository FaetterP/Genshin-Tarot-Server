import { WebSocket } from "ws";
import { Player } from "../src/game/Player";

export declare class ExtWebSocket extends WebSocket {
  player: Player;
  isAlive: boolean;
}
