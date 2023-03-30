import { ExtWebSocket } from "../../../types/wsTypes";
import characters from "./characters";

interface Handlers {
  [key: string]: (ws: ExtWebSocket, payload: any) => void;
}

export function buildHandlers() {
  const handlers: Handlers = {};
  Object.entries(characters.handlers).forEach(
    ([key, fun]) => (handlers[`characters.${key}`] = fun)
  );
  return handlers;
}
