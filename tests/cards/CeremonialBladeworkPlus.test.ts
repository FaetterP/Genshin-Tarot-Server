/**
 * CeremonialBladeworkPlus — Наносит 2 + 1d6 урона 1 врагу в вашей зоне.
 * Тип: Attack. Стоимость: 1
 */

import { expect, describe, beforeAll, afterAll, jest, beforeEach, afterEach, it } from '@jest/globals';
import { ECard, EDetailedStep } from "../../src/types/enums";
import {
  startTestServers,
  stopTestServers,
  resetGame,
  createTestGame,
  ensureCardInHand,
  TestGame,
} from "../helpers/setup";

jest.setTimeout(15000);

describe("CeremonialBladeworkPlus — наносит 2 + 1d6 урона 1 врагу в вашей зоне", () => {
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

  it("наносит случайный урон в диапазоне 3–8 врагу без щита, HP уменьшается ровно на урон", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 20, shield: 0 });

    const cardId = await ensureCardInHand(player, admin, ECard.CeremonialBladeworkPlus);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    const damageStep = response.steps.find(
      (s: any) => s.type === EDetailedStep.EnemyTakeDamage && s.enemyId === enemy.id,
    );
    expect(damageStep).toBeDefined();
    expect(damageStep.damage).toBeGreaterThanOrEqual(3);
    expect(damageStep.damage).toBeLessThanOrEqual(8);
    expect(damageStep.isPiercing).toBe(false);

    const updatedEnemy = response.player.enemies.find((e: any) => e.id === enemy.id);
    expect(updatedEnemy.hp).toBe(20 - damageStep.damage);
  });

  it("уменьшает AP на 1 и перемещает карту в сброс", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 20, shield: 0 });

    const cardId = await ensureCardInHand(player, admin, ECard.CeremonialBladeworkPlus);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "actionPoints",
        playerId: player.playerId,
        delta: -1,
      }),
    );
    expect(response.player.actionPoints.total).toBe(2);

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "discard",
        card: expect.objectContaining({ name: ECard.CeremonialBladeworkPlus }),
      }),
    );
    expect(response.player.discard.some((c: any) => c.name === ECard.CeremonialBladeworkPlus)).toBe(true);
  });

  it("атака блокируется щитом врага — HP не изменяется, шаги содержат оба события", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 20, shield: 2 });

    const cardId = await ensureCardInHand(player, admin, ECard.CeremonialBladeworkPlus);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemy.id,
        isPiercing: false,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyBlockDamage,
        enemyId: enemy.id,
      }),
    );

    const updatedEnemy = response.player.enemies.find((e: any) => e.id === enemy.id);
    expect(updatedEnemy.hp).toBe(20);
  });

  it("убивает врага с 1 HP — минимальный урон 3 всегда летален", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 1, shield: 0 });

    const cardId = await ensureCardInHand(player, admin, ECard.CeremonialBladeworkPlus);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemy.id,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyDeath,
        enemyId: enemy.id,
      }),
    );

    expect(response.player.enemies.some((e: any) => e.id === enemy.id)).toBe(false);

    const appearanceSteps = response.steps.filter((s: any) => s.type === EDetailedStep.EnemyAppearance);
    expect(appearanceSteps.length).toBeGreaterThan(0);
  });

  it("возвращает ошибку при недостаточном количестве AP", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 20, shield: 0 });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 0, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.CeremonialBladeworkPlus);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
    expect(response.message).toContain("not enough action points");
  });

  it("возвращает ошибку когда враги не указаны", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const cardId = await ensureCardInHand(player, admin, ECard.CeremonialBladeworkPlus);

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
    await admin.updateEnemy(enemy.id, { hp: 20, shield: 0 });

    const cardId = await ensureCardInHand(player1, admin, ECard.CeremonialBladeworkPlus);

    player1.send({ action: "game.useCard", cardId, enemies: [enemy.id] });

    const [response1, response2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(response1.card).toBe(ECard.CeremonialBladeworkPlus);
    expect(response2.card).toBe(ECard.CeremonialBladeworkPlus);
    expect(response2.player.playerId).toBe(player1.playerId);
  });
});
