/**
 * SearingOnslaught - Накладывает Пиро и наносит 2 урона 1 врагу в вашей зоне.
 * Моментально повторяет этот эффект ещё 2 раза (3 удара суммарно).
 * Тип: Skill. Стоимость: 2
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

describe("SearingOnslaught - Накладывает Пиро и наносит 2 урона 3 раза 1 врагу в зоне", () => {
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

  it("наносит 3 удара по 2 Пиро урона врагу без щита", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 20, shield: 0, elements: [] });

    const cardId = await ensureCardInHand(player, admin, ECard.SearingOnslaught);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    const damageSteps = response.steps.filter(
      (s: any) => s.type === EDetailedStep.EnemyTakeDamage && s.enemyId === enemy.id,
    );
    expect(damageSteps).toHaveLength(3);
    damageSteps.forEach((step: any) => {
      expect(step).toMatchObject({ damage: 2, isPiercing: false, element: EElement.Pyro });
    });

    const updatedEnemy = response.player.enemies.find((e: any) => e.id === enemy.id);
    expect(updatedEnemy.hp).toBe(14);
  });

  it("второй удар вызывает реакцию Пиро+Пиро", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 20, shield: 0, elements: [] });

    const cardId = await ensureCardInHand(player, admin, ECard.SearingOnslaught);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyReaction,
        enemyId: enemy.id,
        element1: EElement.Pyro,
        element2: EElement.Pyro,
      }),
    );
  });

  it("каждый удар блокируется щитом — HP не изменяется", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.addEnemy(player.playerId, EEnemy.HilichurlGuard);
    const syncMsg = await player.waitFor((m: any) => m.action === "admin.stateSync" && m.you.enemies.length >= 2);
    const allEnemies: { id: string }[] = syncMsg.you.enemies;
    const enemy = allEnemies.find((e: any) => e.id !== player.enemies[0].id)!;
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 5, elements: [] });

    const cardId = await ensureCardInHand(player, admin, ECard.SearingOnslaught);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    const damageSteps = response.steps.filter((s: any) => s.type === EDetailedStep.EnemyTakeDamage && s.enemyId === enemy.id);
    expect(damageSteps).toHaveLength(3);

    const blockSteps = response.steps.filter((s: any) => s.type === EDetailedStep.EnemyBlockDamage && s.enemyId === enemy.id);
    expect(blockSteps).toHaveLength(3);

    const updatedEnemy = response.player.enemies.find((e: any) => e.id === enemy.id);
    expect(updatedEnemy.hp).toBe(10);
  });

  it("убивает врага с 6 HP и спавнит следующую волну", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 6, shield: 0, elements: [] });

    const cardId = await ensureCardInHand(player, admin, ECard.SearingOnslaught);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyDeath,
        enemyId: enemy.id,
      }),
    );
    expect(response.player.enemies.some((e: any) => e.id === enemy.id)).toBe(false);
    expect(response.steps.filter((s: any) => s.type === EDetailedStep.EnemyAppearance).length).toBeGreaterThan(0);
  });

  it("уменьшает AP игрока на 2 и перемещает карту в сброс", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 20, shield: 0, elements: [] });

    const cardId = await ensureCardInHand(player, admin, ECard.SearingOnslaught);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "actionPoints",
        playerId: player.playerId,
        delta: -2,
      }),
    );
    expect(response.player.actionPoints.total).toBe(1);

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "discard",
        card: expect.objectContaining({ name: ECard.SearingOnslaught }),
      }),
    );
  });

  it("возвращает ошибку при недостаточном количестве AP", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0 });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 1, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.SearingOnslaught);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
    expect(response.message).toContain("not enough action points");
  });

  it("возвращает ошибку когда враги не указаны", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const cardId = await ensureCardInHand(player, admin, ECard.SearingOnslaught);

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
    await admin.updateEnemy(enemy.id, { hp: 20, shield: 0, elements: [] });

    const cardId = await ensureCardInHand(player1, admin, ECard.SearingOnslaught);

    player1.send({ action: "game.useCard", cardId, enemies: [enemy.id] });

    const [response1, response2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(response1.card).toBe(ECard.SearingOnslaught);
    expect(response2.card).toBe(ECard.SearingOnslaught);
    expect(response2.player.playerId).toBe(player1.playerId);
  });
});
