/**
 * Kaboom - Накладывает Пиро и наносит 1 пронзающий урон 1 врагу где угодно. Даёт 1 энергию.
 * Тип: Attack. Стоимость: 1
 */

import { expect, describe, beforeAll, afterAll, jest, beforeEach, afterEach, it } from '@jest/globals';
import { ECard, EDetailedStep, EElement, EEnemy } from "../../src/types/enums";
import {
  startTestServers,
  stopTestServers,
  resetGame,
  createTestGame,
  ensureCardInHand,
  TestGame,
} from "../helpers/setup";

jest.setTimeout(15000);

describe("Kaboom — накладывает Пиро и наносит 1 пронзающий урон врагу, даёт 1 энергию", () => {
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

  it("наносит 1 пронзающий Пиро урон, накладывает Пиро, даёт 1 энергию, враг выживает", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const existingEnemy = player.enemies[0];
    await admin.addEnemy(player.playerId, EEnemy.HilichurlGuard);
    const syncMsg = await player.waitFor((m: any) => m.action === "admin.stateSync" && m.you.enemies.filter((e: any) => !e.faceDown).length >= 2);
    const enemy = syncMsg.you.enemies.filter((e: any) => !e.faceDown).find((e: any) => e.id !== existingEnemy.id);
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { energy: 0, actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.Kaboom);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemy.id,
        damage: 1,
        isPiercing: true,
        element: EElement.Pyro,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyGetElement,
        enemyId: enemy.id,
        element: EElement.Pyro,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "energy",
        playerId: player.playerId,
        delta: 1,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "actionPoints",
        delta: -1,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "discard",
        card: expect.objectContaining({ name: ECard.Kaboom }),
      }),
    );
    const updatedEnemy = response.player.enemies.find((e: any) => e.id === enemy.id);
    expect(updatedEnemy.hp).toBe(9);
    expect(response.player.energy).toBe(1);
  });

  it("пронзающий урон проходит сквозь щит — HP врага уменьшается", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const existingEnemy = player.enemies[0];
    await admin.addEnemy(player.playerId, EEnemy.HilichurlGuard);
    const syncMsg = await player.waitFor((m: any) => m.action === "admin.stateSync" && m.you.enemies.filter((e: any) => !e.faceDown).length >= 2);
    const enemy = syncMsg.you.enemies.filter((e: any) => !e.faceDown).find((e: any) => e.id !== existingEnemy.id);
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 3, elements: [] });

    const cardId = await ensureCardInHand(player, admin, ECard.Kaboom);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    const updatedEnemy = response.player.enemies.find((e: any) => e.id === enemy.id);
    expect(updatedEnemy.hp).toBe(9);
    expect(response.steps).not.toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyBlockDamage }),
    );
  });

  it("враг погибает — EnemyDeath в шагах", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updateEnemy(player.enemies[0].id, { hp: 1, shield: 0, elements: [] });

    const cardId = await ensureCardInHand(player, admin, ECard.Kaboom);

    player.send({ action: "game.useCard", cardId, enemies: [player.enemies[0].id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: player.enemies[0].id,
        damage: 1,
      }),
    );
    expect(response.steps).toContainEqual(expect.objectContaining({ type: EDetailedStep.EnemyDeath }));
    const damageIdx = response.steps.findIndex((s: any) => s.type === EDetailedStep.EnemyTakeDamage);
    const deathIdx = response.steps.findIndex((s: any) => s.type === EDetailedStep.EnemyDeath);
    expect(damageIdx).toBeLessThan(deathIdx);
  });

  it("бьёт врага в зоне другого игрока (isRange: true)", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    await admin.updateEnemy(player2.enemies[0].id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player1.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player1, admin, ECard.Kaboom);

    player1.send({ action: "game.useCard", cardId, enemies: [player2.enemies[0].id] });
    const response = await player1.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: player2.enemies[0].id,
        damage: 1,
      }),
    );
  });

  it("без врагов → ошибка", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const cardId = await ensureCardInHand(player, admin, ECard.Kaboom);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
  });

  it("недостаточно AP → ошибка", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updateEnemy(player.enemies[0].id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 0, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.Kaboom);

    player.send({ action: "game.useCard", cardId, enemies: [player.enemies[0].id] });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
    expect(response.message).toMatch(/action points/i);
  });

  it("второй игрок получает событие game.useCard с данными первого", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    await admin.updateEnemy(player1.enemies[0].id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player1.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player1, admin, ECard.Kaboom);

    player1.send({ action: "game.useCard", cardId, enemies: [player1.enemies[0].id] });

    const [resp1, resp2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(resp1.player.playerId).toBe(player1.playerId);
    expect(resp2.player.playerId).toBe(player1.playerId);
    expect(resp2.card).toBe(ECard.Kaboom);
  });
});
