import config from "config";
import WebSocket from "ws";
import { ExtWebSocket } from "../../types/wsTypes";
import { CycleController } from "../game/CycleController";
import { Player } from "../game/Player";
import { buildHandlers } from "./handlers";

const HEARTBEAT_TIMEOUT = 30000;
const SERVER_PORT = config.get<number>("server.port");

const handlers = buildHandlers();
let wss: WebSocket.Server;
const cycleController = new CycleController();

export function getAllClients() {
  return wss.clients;
}

export function getAllPlayers() {
  const players: Player[] = [];
  wss.clients.forEach((ws) => players.push((ws as ExtWebSocket).player));

  return players;
}

async function onMessage(
  this: WebSocket,
  data: WebSocket.RawData,
  isBinary: boolean
) {
  try {
    const ws = this as ExtWebSocket;
    const req = JSON.parse(data.toString());

    const { action } = req;
    const handler = handlers[action];
    if (!handler) throw new Error(`Unsupported action ${action}`);

    const res = await handler(ws, req);
    ws.send(JSON.stringify({ status: "ok", data: res }));
  } catch (e) {
    this.send(
      JSON.stringify({
        status: "error",
        message: e instanceof Error ? e.message : `${e}`,
      })
    );
  }
}

function onDisconnect(this: WebSocket, code: number, reason: Buffer) {}

function heartbeat(this: WebSocket, data: Buffer) {
  const ws = this as ExtWebSocket;
  ws.isAlive = true;
}

async function onConnect(ws: ExtWebSocket, req: any) {
  try {
    ws.on("message", onMessage);
    ws.on("close", onDisconnect);
    ws.on("pong", heartbeat);

    const player = new Player();
    cycleController.connectPlayer(player);
    ws.player = player;
    ws.cycleController = cycleController;

    ws.send(JSON.stringify({ action: "ws.connect", youPlayerId: player.ID }));
  } catch (e) {
    ws.terminate();
  }
}

export async function startWebsocketServer() {
  await new Promise<void>((resolve, reject) => {
    //@ts-ignore
    wss = new WebSocket.Server({ port: SERVER_PORT }, (err: any) =>
      err ? reject(err) : resolve()
    );
    wss.on("connection", onConnect);
    wss.on("error", (e: any) => {
      process.exit();
    });
  });

  console.log(`WebSocket server started at ${SERVER_PORT}`);

  setInterval(function ping() {
    //@ts-ignore
    wss.clients.forEach((ws: ExtWebSocket) => {
      if (ws.isAlive === false) return ws.terminate();
      ws.isAlive = false;
      ws.ping(() => {});
    });
  }, HEARTBEAT_TIMEOUT);
}

export async function stop() {
  wss.close();
}
