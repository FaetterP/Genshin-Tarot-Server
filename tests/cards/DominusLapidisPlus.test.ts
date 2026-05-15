/**
 * DominusLapidisPlus - Даёт 3 защиты вам и 1 другому игроку. Накладывает Гео всем врагам в вашей зоне.
 * В начале следующего хода накладывает Гео всем врагам в вашей зоне.
 * Тип: Skill. Стоимость: 2
 */

import { expect, describe, beforeAll, afterAll, jest, beforeEach, afterEach, it } from '@jest/globals';
import { ECard, EDetailedStep, EElement, EEnemy, EPlayerEffect } from "../../src/types/enums";
import {
  startTestServers,
  stopTestServers,
  resetGame,
  createTestGame,
  ensureCardInHand,
  endTurn,
  TestGame,
} from "../helpers/setup";

jest.setTimeout(15000);

describe("DominusLapidisPlus - даёт 3 брони, накладывает Гео всем врагам, повторяет в начале следующего цикла", () => {
  let game: TestGame;

  beforeAll(async () => {
    await startTestServers();
  });

  afterAll(async () => {
    await stopTestServers();
  });

  beforeEach(() => {
    resetGame();
  });

  afterEach(() => {
    game?.cleanup();
  });

  it("даёт 3 брони игроку, накладывает Гео врагу, добавляет эффект, списывает 2 AP, карта в сброс", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 20, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { shield: 0, actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.DominusLapidisPlus);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "shield",
        playerId: player.playerId,
        delta: 3,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyGetElement,
        enemyId: enemy.id,
        element: EElement.Geo,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerGetEffect,
        playerId: player.playerId,
        effect: EPlayerEffect.DominusLapidis,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "actionPoints",
        playerId: player.playerId,
        delta: -2,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "discard",
        card: expect.objectContaining({ name: ECard.DominusLapidisPlus }),
      }),
    );

    expect(response.player.shields).toBe(3);
    expect(response.player.effects).toContain(EPlayerEffect.DominusLapidis);
    expect(response.player.actionPoints.total).toBe(1);
  });

  it("с selectedPlayer — даёт 3 брони обоим игрокам", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    const enemy = player1.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 20, shield: 0, elements: [] });
    await admin.updatePlayer(player1.playerId, { shield: 0, actionPoints: { normal: 3, extra: 0 } });
    await admin.updatePlayer(player2.playerId, { shield: 0 });

    const cardId = await ensureCardInHand(player1, admin, ECard.DominusLapidisPlus);

    player1.send({ action: "game.useCard", cardId, selectedPlayer: player2.playerId });
    const response = await player1.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "shield",
        playerId: player1.playerId,
        delta: 3,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "shield",
        playerId: player2.playerId,
        delta: 3,
      }),
    );

    expect(response.player.shields).toBe(3);
  });

  it("накладывает Гео всем врагам в зоне (2 врага)", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const cardId = await ensureCardInHand(player, admin, ECard.DominusLapidisPlus);

    await admin.addEnemy(player.playerId, EEnemy.SmallDendroSlime);
    const syncMsg = await player.waitFor(
      (m: any) => m.action === "admin.stateSync" && m.you.enemies.length >= 2,
    );
    const enemies: { id: string }[] = syncMsg.you.enemies;

    for (const e of enemies) {
      await admin.updateEnemy(e.id, { hp: 20, shield: 0, elements: [] });
    }
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    for (const e of enemies) {
      expect(response.steps).toContainEqual(
        expect.objectContaining({
          type: EDetailedStep.EnemyGetElement,
          enemyId: e.id,
          element: EElement.Geo,
        }),
      );
    }
  });

  it("эффект срабатывает в начале следующего цикла — Гео+Гео реакция, эффект снимается", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 20, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.DominusLapidisPlus);

    player.send({ action: "game.useCard", cardId });
    await player.waitFor((m: any) => m.action === "game.useCard");

    const cycle2 = await endTurn(player);

    expect(cycle2.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyReaction,
        enemyId: enemy.id,
        element1: EElement.Geo,
        element2: EElement.Geo,
      }),
    );
    expect(cycle2.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerEffectTrigger,
        playerId: player.playerId,
        effect: EPlayerEffect.DominusLapidis,
        isRemove: true,
      }),
    );
    expect(cycle2.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerLoseEffect,
        playerId: player.playerId,
        effect: EPlayerEffect.DominusLapidis,
      }),
    );
    expect(cycle2.you.effects).not.toContain(EPlayerEffect.DominusLapidis);
  });

  it("возвращает ошибку при недостаточном количестве AP", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 1, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.DominusLapidisPlus);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
    expect(response.message).toContain("not enough action points");
  });

  it("второй игрок тоже получает событие game.useCard", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    const enemy = player1.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 20, shield: 0, elements: [] });
    await admin.updatePlayer(player1.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player1, admin, ECard.DominusLapidisPlus);

    player1.send({ action: "game.useCard", cardId });

    const [response1, response2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(response1.card).toBe(ECard.DominusLapidisPlus);
    expect(response2.card).toBe(ECard.DominusLapidisPlus);
    expect(response2.player.playerId).toBe(player1.playerId);
  });
});
