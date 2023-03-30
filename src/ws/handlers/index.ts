import { ExtWebSocket } from "../../../types/wsTypes";
import characters from "./characters";
import game from "./game";

interface Handlers {
  [key: string]: (ws: ExtWebSocket, payload: any) => void;
}

export function buildHandlers() {
  const handlers: Handlers = {};
  Object.entries(characters.handlers).forEach(([key, fun]) => (handlers[`characters.${key}`] = fun));
  Object.entries(game.handlers).forEach(([key, fun]) => (handlers[`game.${key}`] = fun));
  return handlers;
}
