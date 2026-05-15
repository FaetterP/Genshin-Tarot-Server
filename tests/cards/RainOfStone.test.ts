/**
 * RainOfStone - Наносит 1 пронзающий урон 1 врагу в вашей зоне.
 * Вы можете потратить 1 энергию, чтобы нанести 1 пронзающий урон 1 другому врагу где угодно.
 * Тип: Attack. Стоимость: 0
 */

import { expect, describe, beforeAll, afterAll, jest, beforeEach, afterEach, it } from '@jest/globals';
import { ECard, EDetailedStep, EEnemy } from "../../src/types/enums";
import {
  startTestServers,
  stopTestServers,
  resetGame,
  createTestGame,
  ensureCardInHand,
  TestGame,
} from "../helpers/setup";

jest.setTimeout(15000);

describe("RainOfStone - наносит 1 пронзающий урон, опционально второй врагу где угодно за 1 энергию", () => {
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

  it("наносит 1 пронзающий урон, не тратит AP (стоимость 0), карта в сброс", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.RainOfStone);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemy.id,
        damage: 1,
        isPiercing: true,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "discard",
        card: expect.objectContaining({ name: ECard.RainOfStone }),
      }),
    );

    const updatedEnemy = response.player.enemies.find((e: any) => e.id === enemy.id);
    expect(updatedEnemy.hp).toBe(9);
    expect(response.player.actionPoints.total).toBe(3);
  });

  it("isPiercing — пронзает щит врага, HP уменьшается, EnemyBlockDamage отсутствует", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 2, elements: [] });

    const cardId = await ensureCardInHand(player, admin, ECard.RainOfStone);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemy.id,
        damage: 1,
        isPiercing: true,
      }),
    );
    expect(response.steps).not.toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyBlockDamage }),
    );

    const updatedEnemy = response.player.enemies.find((e: any) => e.id === enemy.id);
    expect(updatedEnemy.hp).toBe(9);
  });

  it("убивает врага с 1 HP — EnemyDeath и следующая волна появляется", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 1, shield: 0, elements: [] });

    const cardId = await ensureCardInHand(player, admin, ECard.RainOfStone);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyTakeDamage, enemyId: enemy.id }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyDeath, enemyId: enemy.id }),
    );
    expect(response.player.enemies.some((e: any) => e.id === enemy.id)).toBe(false);

    const appearanceSteps = response.steps.filter((s: any) => s.type === EDetailedStep.EnemyAppearance);
    expect(appearanceSteps.length).toBeGreaterThan(0);
  });

  it("isUseAlternative с энергией — атакует двух врагов, второй isRange", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    const enemy1 = player1.enemies[0];
    const enemy2 = player2.enemies[0];
    await admin.updateEnemy(enemy1.id, { hp: 10, shield: 0, elements: [] });
    await admin.updateEnemy(enemy2.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player1.playerId, { energy: 1, actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player1, admin, ECard.RainOfStone);

    player1.send({
      action: "game.useCard",
      cardId,
      enemies: [enemy1.id, enemy2.id],
      isUseAlternative: true,
    });
    const response = await player1.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemy1.id,
        damage: 1,
        isPiercing: true,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemy2.id,
        damage: 1,
        isPiercing: true,
      }),
    );
  });

  it("isUseAlternative без энергии — атакует только первого врага", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { energy: 0, actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.RainOfStone);

    player.send({
      action: "game.useCard",
      cardId,
      enemies: [enemy.id],
      isUseAlternative: true,
    });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    const damageCounts = response.steps.filter((s: any) => s.type === EDetailedStep.EnemyTakeDamage);
    expect(damageCounts.length).toBe(1);
    expect(damageCounts[0]).toMatchObject({ enemyId: enemy.id, damage: 1 });
  });

  it("isUseAlternative с энергией но только 1 враг — возвращает ошибку (баг: энергия уже потрачена)", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { energy: 1, actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.RainOfStone);

    player.send({
      action: "game.useCard",
      cardId,
      enemies: [enemy.id],
      isUseAlternative: true,
    });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
  });

  it("возвращает ошибку если enemies не переданы", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const cardId = await ensureCardInHand(player, admin, ECard.RainOfStone);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
  });

  it("второй игрок тоже получает событие game.useCard", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    const enemy = player1.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });

    const cardId = await ensureCardInHand(player1, admin, ECard.RainOfStone);

    player1.send({ action: "game.useCard", cardId, enemies: [enemy.id] });

    const [response1, response2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(response1.card).toBe(ECard.RainOfStone);
    expect(response2.card).toBe(ECard.RainOfStone);
    expect(response2.player.playerId).toBe(player1.playerId);
  });
});
