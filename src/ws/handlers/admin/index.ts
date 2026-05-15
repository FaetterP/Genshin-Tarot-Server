import WebSocket from "ws";
import type { Player } from "../../../game/Player";
import { CycleController } from "../../../game/CycleController";
import type { Enemy } from "../../../storage/enemies/Enemy";
import type {
  AdminStateSnapshot,
  AdminKillEnemyPayload,
  AdminMoveCardPayload,
  AdminUpdateEnemyPayload,
  AdminUpdatePlayerPayload,
  AdminSetStatePayload,
  AdminAddEnemyPayload,
  AdminRemoveEnemyPayload,
  AdminAddCardPayload,
} from "../../../types/admin";
import type { ECard, EElement, EEnemyEffect, EEnemy, EPlayerEffect } from "../../../types/enums";
import { createEnemyFromEnum } from "../../../storage/enemies/enemyFactory";
import { createCardFromEnum } from "../../../storage/cards/cardFactory";

export type AdminContext = {
  cycleController: CycleController;
  getGameStateSnapshot: () => AdminStateSnapshot;
  sendStateToClients: () => void;
  sendStateToAdmin: (ws: WebSocket) => void;
};

export type AdminHandler = (
  ctx: AdminContext,
  ws: WebSocket,
  payload: unknown,
) => void | Promise<void>;

function sendState(ctx: AdminContext, ws: WebSocket) {
  ctx.sendStateToAdmin(ws);
}

async function withPlayer(
  ctx: AdminContext,
  ws: WebSocket,
  playerId: string,
  apply: (player: Player) => void,
) {
  const player = ctx.cycleController.getPlayerById(playerId);
  if (!player) throw new Error("Player not found");
  apply(player);
  ctx.sendStateToClients();
  sendState(ctx, ws);
}

async function withEnemy(
  ctx: AdminContext,
  ws: WebSocket,
  enemyId: string,
  apply: (enemy: Enemy) => void,
) {
  const enemy = ctx.cycleController.getEnemyById(enemyId);
  if (!enemy) throw new Error("Enemy not found");
  apply(enemy);
  ctx.sendStateToClients();
  sendState(ctx, ws);
}

async function getState(ctx: AdminContext, ws: WebSocket) {
  sendState(ctx, ws);
}

async function updatePlayer(ctx: AdminContext, ws: WebSocket, payload: unknown) {
  const { playerId, ...stats } = payload as AdminUpdatePlayerPayload;
  if (!playerId) throw new Error("playerId is required");
  await withPlayer(ctx, ws, playerId, (p) => p.adminSetStats(stats));
}

async function updateEnemy(ctx: AdminContext, ws: WebSocket, payload: unknown) {
  const { enemyId, ...stats } = payload as AdminUpdateEnemyPayload;
  if (!enemyId) throw new Error("enemyId is required");
  await withEnemy(ctx, ws, enemyId, (e) => e.adminSetStats(stats));
}

async function killEnemy(ctx: AdminContext, ws: WebSocket, payload: unknown) {
  const { enemyId } = payload as AdminKillEnemyPayload;
  if (!enemyId) throw new Error("enemyId is required");
  const enemy = ctx.cycleController.getEnemyById(enemyId);
  if (!enemy) throw new Error("Enemy not found");
  const owner = ctx.cycleController.getPlayerByEnemyId(enemyId);
  if (!owner) throw new Error("Owner player not found");
  owner.recordEnemyDeath(enemy.ID);
  enemy.kill();
  ctx.sendStateToClients();
  sendState(ctx, ws);
}

async function addEnemy(ctx: AdminContext, ws: WebSocket, payload: unknown) {
  const { playerId, enemyName } = payload as AdminAddEnemyPayload;
  if (!playerId) throw new Error("playerId is required");
  if (!enemyName) throw new Error("enemyName is required");

  const player = ctx.cycleController.getPlayerById(playerId);
  if (!player) throw new Error("Player not found");

  const enemy = createEnemyFromEnum(enemyName as EEnemy);
  if (!enemy) throw new Error(`Unknown enemy: ${enemyName}`);

  player.adminAddNewEnemy(enemy);
  ctx.sendStateToClients();
  sendState(ctx, ws);
}

async function removeEnemy(ctx: AdminContext, ws: WebSocket, payload: unknown) {
  const { enemyId } = payload as AdminRemoveEnemyPayload;
  if (!enemyId) throw new Error("enemyId is required");

  const owner = ctx.cycleController.getPlayerByEnemyId(enemyId);
  if (!owner) throw new Error("Owner player not found");

  owner.adminRemoveEnemy(enemyId);
  ctx.sendStateToClients();
  sendState(ctx, ws);
}

async function addCard(ctx: AdminContext, ws: WebSocket, payload: unknown) {
  const { playerId, cardName, to } = payload as AdminAddCardPayload;
  if (!playerId) throw new Error("playerId is required");
  if (!cardName) throw new Error("cardName is required");
  if (!to) throw new Error("to is required");

  const player = ctx.cycleController.getPlayerById(playerId);
  if (!player) throw new Error("Player not found");

  const card = createCardFromEnum(cardName as ECard);
  if (!card) throw new Error(`Unknown or unimplemented card: ${cardName}`);

  if (to === "hand") player.addCardToHand(card, false);
  else if (to === "discard") player.addCardToDiscard(card);
  else if (to === "deck") player.addCardToDeck(card);
  else throw new Error(`Invalid pile: ${to}`);

  ctx.sendStateToClients();
  sendState(ctx, ws);
}

async function moveCard(ctx: AdminContext, ws: WebSocket, payload: unknown) {
  const { playerId, cardId, from, to } = payload as AdminMoveCardPayload;
  if (!playerId || !cardId || !from || !to)
    throw new Error("playerId, cardId, from, to are required");
  await withPlayer(ctx, ws, playerId, (p) => p.adminMoveCard(cardId, from, to));
}

async function setState(ctx: AdminContext, ws: WebSocket, payload: unknown) {
  const { isGameStart, cycle, players } = payload as AdminSetStatePayload;

  if (isGameStart !== undefined) ctx.cycleController.adminSetGameStart(isGameStart);
  if (cycle !== undefined) ctx.cycleController.adminSetCycle(cycle);

  if (players) {
    for (const playerData of players) {
      const player = ctx.cycleController.getPlayerById(playerData.playerId);
      if (!player) continue;

      const { enemies: enemyUpdates, playerId: _id, ...playerStats } = playerData;
      player.adminSetStats({
        ...playerStats,
        shield: playerStats.shields,
        effects: playerStats.effects as EPlayerEffect[] | undefined,
      });

      if (enemyUpdates) {
        for (const enemyData of enemyUpdates) {
          const enemy = ctx.cycleController.getEnemyById(enemyData.id);
          if (!enemy) continue;
          const { id: _enemyId, ...enemyStats } = enemyData;
          enemy.adminSetStats({
            ...enemyStats,
            elements: enemyStats.elements as EElement[] | undefined,
            effects: enemyStats.effects as EEnemyEffect[] | undefined,
          });
        }
      }
    }
  }

  ctx.sendStateToClients();
  sendState(ctx, ws);
}

export const handlers: Record<string, AdminHandler> = {
  "admin.getState": getState,
  "admin.updatePlayer": updatePlayer,
  "admin.updateEnemy": updateEnemy,
  "admin.killEnemy": killEnemy,
  "admin.addEnemy": addEnemy,
  "admin.removeEnemy": removeEnemy,
  "admin.addCard": addCard,
  "admin.moveCard": moveCard,
  "admin.setState": setState,
};

export function createOnAdminConnect(ctx: AdminContext): (ws: WebSocket) => void {
  return function onAdminConnect(ws: WebSocket) {
    setImmediate(() => ctx.sendStateToAdmin(ws));

    ws.on("message", async (data: WebSocket.RawData) => {
      try {
        const msg = JSON.parse(data.toString());
        const { action } = msg;
        const handler = handlers[action];
        if (!handler) throw new Error(`Unsupported action ${action}`);

        await handler(ctx, ws, msg);
        ws.send(JSON.stringify({ status: "ok" }));
      } catch (e) {
        ws.send(
          JSON.stringify({
            status: "error",
            message: e instanceof Error ? e.message : `${e}`,
          }),
        );
      }
    });
  };
}
