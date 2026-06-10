/**
 * ClawAndThunderPlus - Накладывает Электро на всех врагов в зоне. Размещает 1 razorPoint (макс. 3).
 * Можно удалить все razorPoints, чтобы получить 2 энергии за каждый.
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

describe("ClawAndThunderPlus — накладывает Электро, добавляет razorPoint, можно снять все за энергию", () => {
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

    const cardId = await ensureCardInHand(player, admin, ECard.ClawAndThunderPlus);

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
      expect.objectContaining({ type: EDetailedStep.MoveCard, to: "discard", card: expect.objectContaining({ name: ECard.ClawAndThunderPlus }) }),
    );
    expect(response.player.razorPoints).toBe(1);
  });

  it("isUseAlternative: добавляет 1 razorPoint, затем удаляет все за 2 энергии каждый", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { energy: 0 });
    await admin.request({ action: "admin.updatePlayer", playerId: player.playerId, razorPoints: 2 });

    const cardId = await ensureCardInHand(player, admin, ECard.ClawAndThunderPlus);

    player.send({ action: "game.useCard", cardId, isUseAlternative: true });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    // Добавляет 1 очко (2 → 3)
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.PlayerStatChange, stat: "razorPoints", delta: 1 }),
    );
    // Удаляет все 3 (−3)
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.PlayerStatChange, stat: "razorPoints", delta: -3 }),
    );
    // Получает 6 энергии (3 × 2)
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.PlayerStatChange, stat: "energy", delta: 6 }),
    );
    expect(response.player.razorPoints).toBe(0);
    expect(response.player.energy).toBe(6);
  });

  it("isUseAlternative + razorPoints=0 до карты: добавляет 1, удаляет 1, получает 2 энергии", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { energy: 0 });
    await admin.request({ action: "admin.updatePlayer", playerId: player.playerId, razorPoints: 0 });

    const cardId = await ensureCardInHand(player, admin, ECard.ClawAndThunderPlus);

    player.send({ action: "game.useCard", cardId, isUseAlternative: true });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.PlayerStatChange, stat: "razorPoints", delta: 1 }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.PlayerStatChange, stat: "razorPoints", delta: -1 }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.PlayerStatChange, stat: "energy", delta: 2 }),
    );
    expect(response.player.razorPoints).toBe(0);
    expect(response.player.energy).toBe(2);
  });

  it("razorPoints уже 3 (макс): razorPoint не добавляется", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.request({ action: "admin.updatePlayer", playerId: player.playerId, razorPoints: 3 });

    const cardId = await ensureCardInHand(player, admin, ECard.ClawAndThunderPlus);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    const razorAddSteps = response.steps.filter(
      (s: any) => s.type === EDetailedStep.PlayerStatChange && s.stat === "razorPoints" && s.delta > 0,
    );
    expect(razorAddSteps).toHaveLength(0);
    expect(response.player.razorPoints).toBe(3);
  });

  it("также накладывает Электро на босса в сессии", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const bossId = await spawnTestBoss(player, admin, EEnemy.Dvalin);
    await admin.updateBoss({ hp: 20, shield: 0, elements: [] });
    await admin.updateEnemy(player.enemies[0].id, { elements: [] });

    const cardId = await ensureCardInHand(player, admin, ECard.ClawAndThunderPlus);

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

    const cardId = await ensureCardInHand(player, admin, ECard.ClawAndThunderPlus);

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

    const cardId = await ensureCardInHand(player1, admin, ECard.ClawAndThunderPlus);

    player1.send({ action: "game.useCard", cardId });
    const [res1, res2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(res1.card).toBe(ECard.ClawAndThunderPlus);
    expect(res2.card).toBe(ECard.ClawAndThunderPlus);
    expect(res2.player.playerId).toBe(player1.playerId);
  });
});
