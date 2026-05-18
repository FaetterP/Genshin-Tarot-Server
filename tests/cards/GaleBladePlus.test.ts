/**
 * GaleBladePlus - Накладывает Анемо и наносит 1 пронзающий урон 1 врагу в вашей зоне. Можно поменять местами этого врага с любым другим.
 * Тип: Skill. Стоимость: 0
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

describe("GaleBladePlus — накладывает Анемо и наносит 1 пронзающий урон, бесплатная карта, можно поменять врагов местами", () => {
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

  it("накладывает Анемо, наносит 1 пронзающий урон и не тратит AP", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.GaleBladePlus);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyGetElement,
        enemyId: enemy.id,
        element: EElement.Anemo,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemy.id,
        damage: 1,
        isPiercing: true,
        element: EElement.Anemo,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "actionPoints",
        playerId: player.playerId,
        delta: 0,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "discard",
        card: expect.objectContaining({ name: ECard.GaleBladePlus }),
      }),
    );
    expect(response.steps).not.toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemiesSwap }),
    );

    const updatedEnemy = response.player.enemies.find((e: any) => e.id === enemy.id);
    expect(updatedEnemy.hp).toBe(9);
    // AP не изменились
    expect(response.player.actionPoints.total).toBe(3);
  });

  it("пронзает щит врага — HP уменьшается и Анемо накладывается несмотря на наличие щита", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 5, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.GaleBladePlus);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyGetElement,
        enemyId: enemy.id,
        element: EElement.Anemo,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemy.id,
        damage: 1,
        isPiercing: true,
      }),
    );
    expect(response.steps).not.toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyBlockDamage,
        enemyId: enemy.id,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "discard",
        card: expect.objectContaining({ name: ECard.GaleBladePlus }),
      }),
    );

    const updatedEnemy = response.player.enemies.find((e: any) => e.id === enemy.id);
    expect(updatedEnemy.hp).toBe(9);
  });

  it("меняет местами врага игрока 1 с врагом игрока 2 без затраты AP", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    const enemy1 = player1.enemies[0];
    const enemy2 = player2.enemies[0];
    await admin.updateEnemy(enemy1.id, { hp: 10, shield: 0, elements: [] });
    await admin.updateEnemy(enemy2.id, { hp: 8, shield: 0, elements: [] });
    await admin.updatePlayer(player1.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player1, admin, ECard.GaleBladePlus);

    player1.send({ action: "game.useCard", cardId, enemies: [enemy1.id, enemy2.id] });
    const response = await player1.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemiesSwap,
        playerId: player1.playerId,
        enemyId1: enemy1.id,
        enemyId2: enemy2.id,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyGetElement,
        enemyId: enemy1.id,
        element: EElement.Anemo,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "discard",
        card: expect.objectContaining({ name: ECard.GaleBladePlus }),
      }),
    );

    // После свопа: в зоне игрока 1 должен быть враг 2
    expect(response.player.enemies.some((e: any) => e.id === enemy2.id)).toBe(true);
    expect(response.player.enemies.some((e: any) => e.id === enemy1.id)).toBe(false);
    // AP не изменились
    expect(response.player.actionPoints.total).toBe(3);
  });

  it("убивает врага с 1 HP и спавнит следующую волну", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 1, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.GaleBladePlus);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemy.id,
        damage: 1,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyDeath,
        enemyId: enemy.id,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "discard",
        card: expect.objectContaining({ name: ECard.GaleBladePlus }),
      }),
    );

    expect(response.player.enemies.some((e: any) => e.id === enemy.id)).toBe(false);
    const appearanceSteps = response.steps.filter((s: any) => s.type === EDetailedStep.EnemyAppearance);
    expect(appearanceSteps.length).toBeGreaterThan(0);
  });

  it("возвращает ошибку когда враги не указаны", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const cardId = await ensureCardInHand(player, admin, ECard.GaleBladePlus);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
    expect(response.message).toBe("no enemies");
  });

  it("второй игрок тоже получает событие game.useCard", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    const enemy = player1.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player1.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player1, admin, ECard.GaleBladePlus);

    player1.send({ action: "game.useCard", cardId, enemies: [enemy.id] });

    const [response1, response2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(response1.card).toBe(ECard.GaleBladePlus);
    expect(response2.card).toBe(ECard.GaleBladePlus);
    expect(response2.player.playerId).toBe(player1.playerId);
  });
});
