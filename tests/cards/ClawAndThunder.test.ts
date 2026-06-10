/**
 * ClawAndThunder - Накладывает Электро на всех врагов в зоне. Размещает 1 razorPoint (макс. 3).
 * Тип: Skill. Стоимость: 1
 */

import { expect, describe, beforeAll, afterAll, jest, beforeEach, afterEach, it } from "@jest/globals";
import { ECard, EDetailedStep, EElement, EEnemy } from "../../src/types/enums";
import {
  startTestServers,
  stopTestServers,
  resetGame,
  createTestGame,
  ensureCardInHand,
  spawnTestBoss,
  TestGame,
} from "../helpers/setup";

jest.setTimeout(15000);

describe("ClawAndThunder — накладывает Электро на всех врагов в зоне и добавляет razorPoint", () => {
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

  it("один враг: получает Электро, добавляется 1 razorPoint", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.request({ action: "admin.updatePlayer", playerId: player.playerId, razorPoints: 0 });

    const cardId = await ensureCardInHand(player, admin, ECard.ClawAndThunder);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyGetElement, enemyId: enemy.id, element: EElement.Electro }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.PlayerStatChange, stat: "razorPoints", playerId: player.playerId, delta: 1 }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.PlayerStatChange, stat: "actionPoints", delta: -1 }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.MoveCard, to: "discard", card: expect.objectContaining({ name: ECard.ClawAndThunder }) }),
    );
    expect(response.player.razorPoints).toBe(1);
  });

  it("несколько врагов: каждый получает Электро", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy1 = player.enemies[0];
    await admin.updateEnemy(enemy1.id, { hp: 10, shield: 0, elements: [] });

    await admin.addEnemy(player.playerId, EEnemy.HilichurlGuard);
    const syncMsg = await player.waitFor(
      (m: any) => m.action === "admin.stateSync" && m.you.enemies.filter((e: any) => !e.faceDown).length >= 2,
    );
    const visibleEnemies = syncMsg.you.enemies.filter((e: any) => !e.faceDown);
    const enemy2 = visibleEnemies[visibleEnemies.length - 1];
    await admin.updateEnemy(enemy2.id, { hp: 10, shield: 0, elements: [] });
    await admin.request({ action: "admin.updatePlayer", playerId: player.playerId, razorPoints: 0 });

    const cardId = await ensureCardInHand(player, admin, ECard.ClawAndThunder);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyGetElement, enemyId: enemy1.id, element: EElement.Electro }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyGetElement, enemyId: enemy2.id, element: EElement.Electro }),
    );
    expect(response.player.razorPoints).toBe(1);
  });

  it("razorPoints уже 3 (макс): razorPoint не добавляется", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.request({ action: "admin.updatePlayer", playerId: player.playerId, razorPoints: 3 });

    const cardId = await ensureCardInHand(player, admin, ECard.ClawAndThunder);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).not.toContainEqual(
      expect.objectContaining({ type: EDetailedStep.PlayerStatChange, stat: "razorPoints" }),
    );
    expect(response.player.razorPoints).toBe(3);
  });

  it("также накладывает Электро на босса в сессии", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const bossId = await spawnTestBoss(player, admin, EEnemy.Dvalin);
    await admin.updateBoss({ hp: 20, shield: 0, elements: [] });
    await admin.updateEnemy(player.enemies[0].id, { elements: [] });

    const cardId = await ensureCardInHand(player, admin, ECard.ClawAndThunder);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyGetElement, enemyId: bossId, element: EElement.Electro }),
    );
  });

  it("ошибка: недостаточно AP", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 0, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.ClawAndThunder);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
    expect(response.message).toContain("not enough action points");
  });

  it("второй игрок получает событие game.useCard с правильным player.playerId", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    await admin.updateEnemy(player1.enemies[0].id, { elements: [] });
    await admin.request({ action: "admin.updatePlayer", playerId: player1.playerId, razorPoints: 0 });

    const cardId = await ensureCardInHand(player1, admin, ECard.ClawAndThunder);

    player1.send({ action: "game.useCard", cardId });
    const [res1, res2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(res1.card).toBe(ECard.ClawAndThunder);
    expect(res2.card).toBe(ECard.ClawAndThunder);
    expect(res2.player.playerId).toBe(player1.playerId);
  });
});
