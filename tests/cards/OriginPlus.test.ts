/**
 * OriginPlus - Наносит 2 урона 1 врагу в вашей зоне. Наносит 5 урона, если на враге наложено Электро. Даёт 2 энергии.
 * Тип: Attack. Стоимость: 1
 */

import { expect, describe, beforeAll, afterAll, jest, beforeEach, afterEach, it } from '@jest/globals';
import { ECard, EDetailedStep, EElement } from "../../src/types/enums";
import {
  startTestServers,
  stopTestServers,
  resetGame,
  createTestGame,
  ensureCardInHand,
  TestGame,
} from "../helpers/setup";

jest.setTimeout(15000);

describe("OriginPlus — 2 урона (5 при Электро), даёт 2 энергии, накладывает Электро", () => {
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

  it("наносит 2 урона без Электро, даёт 2 энергии, накладывает Электро", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 2, extra: 0 }, energy: 0 });

    const cardId = await ensureCardInHand(player, admin, ECard.OriginPlus);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemy.id,
        damage: 2,
        isPiercing: false,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "energy",
        playerId: player.playerId,
        delta: 2,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyGetElement,
        enemyId: enemy.id,
        element: EElement.Electro,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "actionPoints",
        playerId: player.playerId,
        delta: -1,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "discard",
        card: expect.objectContaining({ name: ECard.OriginPlus }),
      }),
    );

    const updatedEnemy = response.player.enemies.find((e: any) => e.id === enemy.id);
    expect(updatedEnemy.hp).toBe(8);
    expect(response.player.energy).toBe(2);
  });

  it("наносит 5 урона если на враге уже есть Электро, вызывает реакцию", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 20, shield: 0, elements: [EElement.Electro] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 2, extra: 0 }, energy: 0 });

    const cardId = await ensureCardInHand(player, admin, ECard.OriginPlus);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemy.id,
        damage: 5,
        isPiercing: false,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyGetElement,
        enemyId: enemy.id,
        element: EElement.Electro,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyReaction,
        enemyId: enemy.id,
        element1: EElement.Electro,
        element2: EElement.Electro,
      }),
    );

    const getElementIdx = response.steps.findIndex(
      (s: any) => s.type === EDetailedStep.EnemyGetElement && s.enemyId === enemy.id,
    );
    const reactionIdx = response.steps.findIndex(
      (s: any) => s.type === EDetailedStep.EnemyReaction && s.enemyId === enemy.id,
    );
    expect(getElementIdx).toBeLessThan(reactionIdx);

    // 5 (main) + 2 (1st Electro reaction) + 2 (2nd Electro reaction) = 9 total
    const updatedEnemy = response.player.enemies.find((e: any) => e.id === enemy.id);
    expect(updatedEnemy.hp).toBe(11);
  });

  it("щит блокирует урон: EnemyTakeDamage + EnemyBlockDamage, HP не меняется", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 5, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 2, extra: 0 }, energy: 0 });

    const cardId = await ensureCardInHand(player, admin, ECard.OriginPlus);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyTakeDamage, enemyId: enemy.id, damage: 2 }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyBlockDamage, enemyId: enemy.id }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.PlayerStatChange, stat: "actionPoints", delta: -1 }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.MoveCard, to: "discard", card: expect.objectContaining({ name: ECard.OriginPlus }) }),
    );

    const updatedEnemy = response.player.enemies.find((e: any) => e.id === enemy.id);
    expect(updatedEnemy.hp).toBe(10);
  });

  it("убивает врага: EnemyDeath после EnemyTakeDamage, EnemyGetElement не добавляется", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 2, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 2, extra: 0 }, energy: 0 });

    const cardId = await ensureCardInHand(player, admin, ECard.OriginPlus);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyTakeDamage, enemyId: enemy.id, damage: 2 }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyDeath, enemyId: enemy.id }),
    );

    const damageIdx = response.steps.findIndex(
      (s: any) => s.type === EDetailedStep.EnemyTakeDamage && s.enemyId === enemy.id,
    );
    const deathIdx = response.steps.findIndex(
      (s: any) => s.type === EDetailedStep.EnemyDeath && s.enemyId === enemy.id,
    );
    expect(damageIdx).toBeLessThan(deathIdx);

    const getElementSteps = response.steps.filter(
      (s: any) => s.type === EDetailedStep.EnemyGetElement && s.enemyId === enemy.id,
    );
    expect(getElementSteps).toHaveLength(0);

    expect(response.player.enemies.some((e: any) => e.id === enemy.id)).toBe(false);
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.PlayerStatChange, stat: "actionPoints", delta: -1 }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.MoveCard, to: "discard", card: expect.objectContaining({ name: ECard.OriginPlus }) }),
    );
  });

  it("возвращает ошибку когда враги не указаны", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const cardId = await ensureCardInHand(player, admin, ECard.OriginPlus);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
    expect(response.message).toBe("no enemies");
  });

  it("возвращает ошибку при недостатке AP", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 0, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.OriginPlus);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
    expect(response.message).toContain("not enough action points");
  });

  it("второй игрок получает событие game.useCard", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    const enemy = player1.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player1.playerId, { actionPoints: { normal: 2, extra: 0 }, energy: 0 });

    const cardId = await ensureCardInHand(player1, admin, ECard.OriginPlus);

    player1.send({ action: "game.useCard", cardId, enemies: [enemy.id] });

    const [response1, response2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(response1.card).toBe(ECard.OriginPlus);
    expect(response2.card).toBe(ECard.OriginPlus);
    expect(response2.player.playerId).toBe(player1.playerId);
  });
});
