import WebSocket from "ws";
import { ExtWebSocket } from "../types/wsTypes";
import { CycleController } from "../game/CycleController";
import { Player } from "../game/Player";
import { buildHandlers } from "./handlers";
import type { AdminStateSnapshot } from "../types/admin";

const HEARTBEAT_TIMEOUT = 30000;
const GAME_PORT = 8999;

const handlers = buildHandlers();
let gameWss: WebSocket.Server;
let adminWss: WebSocket.Server | null = null;
const cycleController = new CycleController();

export function registerAdminWss(wss: WebSocket.Server) {
  adminWss = wss;
}

export function getAllClients() {
  return gameWss.clients as Set<ExtWebSocket>;
}

export function getAllPlayers(): Player[] {
  const players: Player[] = [];
  gameWss.clients.forEach((ws) => players.push((ws as ExtWebSocket).player));
  return players;
}

export function getGameStateSnapshot(): AdminStateSnapshot {
  return {
    isGameStart: cycleController.IsGameStart,
    cycle: cycleController.CycleNumber,
    players: getAllPlayers().map((p) => p.getPrimitiveStats(true)),
  };
}

export function sendStateToClients() {
  const players = getAllPlayers();
  const allPrimitive = players.map((p) => p.getPrimitiveStats());
  for (const ws of gameWss.clients) {
    const ext = ws as ExtWebSocket;
    const you = ext.player.getPrimitiveStats();
    const otherPlayers = allPrimitive.filter((p) => p.playerId !== you.playerId);
    ws.send(
      JSON.stringify({
        action: "admin.stateSync",
        you,
        otherPlayers,
        cycle: cycleController.CycleNumber,
      }),
    );
  }
}

function sendGameMessageToAdmin(playerId: string, request: unknown) {
  if (!adminWss) return;
  const payload = JSON.stringify({
    action: "admin.gameMessage",
    playerId,
    request,
    time: Date.now(),
  });
  adminWss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(payload);
  });
}

export type OutgoingKind = "sendToAll" | "sendToAllAndWait" | "send";

export function sendResponseToAdmin(
  payload: unknown,
  kind: OutgoingKind,
  targetPlayerId?: string,
) {
  if (!adminWss) return;
  const msg = JSON.stringify({
    action: "admin.gameOutgoing",
    kind,
    payload,
    targetPlayerId: targetPlayerId ?? null,
    time: Date.now(),
  });
  adminWss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(msg);
  });
}

export function sendStateToAdmin() {
  if (!adminWss) return;
  const payload = JSON.stringify({ action: "admin.state", ...getGameStateSnapshot() });
  adminWss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(payload);
  });
}

async function onMessage(this: WebSocket, data: WebSocket.RawData, _isBinary: boolean) {
  try {
    const ws = this as ExtWebSocket;
    const req = JSON.parse(data.toString());

    sendGameMessageToAdmin(ws.player.ID, req);

    const { action } = req;
    const handler = handlers[action];
    if (!handler) throw new Error(`Unsupported action ${action}`);

    await handler(ws, req);
    ws.send(JSON.stringify({ status: "ok" }));
    sendStateToAdmin();
  } catch (e) {
    this.send(
      JSON.stringify({
        status: "error",
        message: e instanceof Error ? e.message : `${e}`,
      }),
    );
  }
}

function heartbeat(this: WebSocket, _data: Buffer) {
  (this as ExtWebSocket).isAlive = true;
}

async function onGameConnect(ws: ExtWebSocket, _req: unknown) {
  try {
    ws.on("message", onMessage);
    ws.on("pong", heartbeat);

    const player = new Player(cycleController);
    cycleController.connectPlayer(player);
    ws.player = player;
    ws.cycleController = cycleController;

    ws.send(JSON.stringify({ action: "ws.connect", youPlayerId: player.ID }));
  } catch (e) {
    ws.terminate();
  }
}

export async function startGameWSS(): Promise<void> {
  await new Promise<void>((resolve) => {
    gameWss = new WebSocket.Server({ port: GAME_PORT }, () => resolve());
    gameWss.on("connection", (ws, req) => onGameConnect(ws as ExtWebSocket, req));
    gameWss.on("error", () => process.exit());
  });

  setInterval(() => {
    gameWss.clients.forEach((ws: WebSocket) => {
      const ext = ws as ExtWebSocket;
      if (ext.isAlive === false) return ws.terminate();
      ext.isAlive = false;
      ws.ping(() => {});
    });
  }, HEARTBEAT_TIMEOUT);

  console.log(`Game WebSocket: ws://localhost:${GAME_PORT}`);
}

export function stopGameWSS() {
  gameWss.close();
}

export { cycleController };
