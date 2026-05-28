/**
 * JumpyDumpty - Накладывает Пиро и наносит 1 урон 2 разным врагам в вашей зоне.
 * Вы можете вернуть эту карту наверх колоды.
 * Тип: Skill. Стоимость: 1
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

async function setupTwoEnemies(player: any, admin: any) {
  const existingEnemy = player.enemies[0];
  await admin.addEnemy(player.playerId, EEnemy.HilichurlGuard);
  await admin.addEnemy(player.playerId, EEnemy.HilichurlGuard);
  const syncMsg = await player.waitFor(
    (m: any) => m.action === "admin.stateSync" && m.you.enemies.filter((e: any) => !e.faceDown).length >= 3,
  );
  const addedEnemies = syncMsg.you.enemies.filter((e: any) => !e.faceDown && e.id !== existingEnemy.id);
  const enemy1Id: string = addedEnemies[0].id;
  const enemy2Id: string = addedEnemies[1].id;
  await admin.updateEnemy(enemy1Id, { hp: 10, shield: 0, elements: [] });
  await admin.updateEnemy(enemy2Id, { hp: 10, shield: 0, elements: [] });
  return { enemy1Id, enemy2Id };
}

describe("JumpyDumpty — наносит 1 Пиро урон 2 разным врагам в зоне, можно вернуть наверх колоды", () => {
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

  it("наносит 1 Пиро урон двум врагам, накладывает Пиро на обоих", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const { enemy1Id, enemy2Id } = await setupTwoEnemies(player, admin);
    const cardId = await ensureCardInHand(player, admin, ECard.JumpyDumpty);

    player.send({ action: "game.useCard", cardId, enemies: [enemy1Id, enemy2Id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemy1Id,
        damage: 1,
        isPiercing: false,
        element: EElement.Pyro,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyGetElement,
        enemyId: enemy1Id,
        element: EElement.Pyro,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemy2Id,
        damage: 1,
        isPiercing: false,
        element: EElement.Pyro,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyGetElement,
        enemyId: enemy2Id,
        element: EElement.Pyro,
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
        card: expect.objectContaining({ name: ECard.JumpyDumpty }),
      }),
    );
    const visibleEnemies = response.player.enemies.filter((e: any) => !e.faceDown);
    expect(visibleEnemies.find((e: any) => e.id === enemy1Id).hp).toBe(9);
    expect(visibleEnemies.find((e: any) => e.id === enemy2Id).hp).toBe(9);
  });

  it("щит блокирует урон (isPiercing: false) — EnemyTakeDamage и EnemyBlockDamage, HP не изменяется", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.addEnemy(player.playerId, EEnemy.HilichurlGuard);
    const syncMsg = await player.waitFor(
      (m: any) => m.action === "admin.stateSync" && m.you.enemies.filter((e: any) => !e.faceDown).length >= 2,
    );
    const visibleEnemies = syncMsg.you.enemies.filter((e: any) => !e.faceDown);
    const enemy1Id: string = visibleEnemies[0].id;
    const enemy2Id: string = visibleEnemies[1].id;
    await admin.updateEnemy(enemy1Id, { hp: 10, shield: 3, elements: [] });
    await admin.updateEnemy(enemy2Id, { hp: 10, shield: 0, elements: [] });

    const cardId = await ensureCardInHand(player, admin, ECard.JumpyDumpty);

    player.send({ action: "game.useCard", cardId, enemies: [enemy1Id, enemy2Id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemy1Id,
        damage: 1,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyBlockDamage,
        enemyId: enemy1Id,
      }),
    );
    const visibleAfter = response.player.enemies.filter((e: any) => !e.faceDown);
    expect(visibleAfter.find((e: any) => e.id === enemy1Id).hp).toBe(10);
    expect(visibleAfter.find((e: any) => e.id === enemy2Id).hp).toBe(9);
  });

  it("isUseAlternative → карта возвращается наверх колоды, не в сброс", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const { enemy1Id, enemy2Id } = await setupTwoEnemies(player, admin);
    const cardId = await ensureCardInHand(player, admin, ECard.JumpyDumpty);

    player.send({ action: "game.useCard", cardId, enemies: [enemy1Id, enemy2Id], isUseAlternative: true });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "deck",
        playerId: player.playerId,
        card: expect.objectContaining({ name: ECard.JumpyDumpty, deckPosition: 1 }),
      }),
    );
    expect(response.steps).not.toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "discard",
        card: expect.objectContaining({ name: ECard.JumpyDumpty }),
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemy1Id,
        damage: 1,
      }),
    );
  });

  it("только 1 враг → ошибка", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updateEnemy(player.enemies[0].id, { hp: 10, shield: 0, elements: [] });
    const cardId = await ensureCardInHand(player, admin, ECard.JumpyDumpty);

    player.send({ action: "game.useCard", cardId, enemies: [player.enemies[0].id] });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
  });

  it("один и тот же враг дважды → ошибка (после removeDuplicates — 1 уникальный)", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updateEnemy(player.enemies[0].id, { hp: 10, shield: 0, elements: [] });
    const cardId = await ensureCardInHand(player, admin, ECard.JumpyDumpty);

    player.send({ action: "game.useCard", cardId, enemies: [player.enemies[0].id, player.enemies[0].id] });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
  });

  it("недостаточно AP → ошибка", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const { enemy1Id, enemy2Id } = await setupTwoEnemies(player, admin);
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 0, extra: 0 } });
    const cardId = await ensureCardInHand(player, admin, ECard.JumpyDumpty);

    player.send({ action: "game.useCard", cardId, enemies: [enemy1Id, enemy2Id] });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
    expect(response.message).toMatch(/action points/i);
  });

  it("второй игрок получает событие game.useCard с данными первого", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    await admin.updatePlayer(player1.playerId, { actionPoints: { normal: 3, extra: 0 } });
    const { enemy1Id, enemy2Id } = await setupTwoEnemies(player1, admin);
    const cardId = await ensureCardInHand(player1, admin, ECard.JumpyDumpty);

    player1.send({ action: "game.useCard", cardId, enemies: [enemy1Id, enemy2Id] });

    const [resp1, resp2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(resp1.player.playerId).toBe(player1.playerId);
    expect(resp2.player.playerId).toBe(player1.playerId);
    expect(resp2.card).toBe(ECard.JumpyDumpty);
  });
});
