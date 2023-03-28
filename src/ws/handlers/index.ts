import pledges from "./attack";

interface Handlers {
  [key: string]: (payload: any) => void;
}

export function buildHandlers() {
  const handlers: Handlers = {};
  Object.entries(pledges.handlers).forEach(
    ([key, fun]) => (handlers[`attack.${key}`] = fun)
  );
  return handlers;
}
