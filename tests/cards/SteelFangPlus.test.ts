/**
 * SteelFangPlus - Уничтожает 1 щит врагу в зоне и наносит 2 урона этому врагу.
 * Тип: Attack. Стоимость: 1
 */

import { expect, describe, beforeAll, afterAll, jest, beforeEach, afterEach, it } from "@jest/globals";
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

describe("SteelFangPlus — уничтожает 1 щит и наносит 2 урона", () => {
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

  it("щит=0: нет EnemyChangeShield, наносит 2 урона", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });

    const cardId = await ensureCardInHand(player, admin, ECard.SteelFangPlus);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).not.toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyChangeShield, enemyId: enemy.id }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyTakeDamage, enemyId: enemy.id, damage: 2, isPiercing: false }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.PlayerStatChange, stat: "actionPoints", delta: -1 }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.MoveCard, to: "discard", card: expect.objectContaining({ name: ECard.SteelFangPlus }) }),
    );

    const updatedEnemy = response.player.enemies.find((e: any) => e.id === enemy.id);
    expect(updatedEnemy.hp).toBe(8);
  });

  it("щит=1: уничтожает щит (→0), 2 урона проходят без блока", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 1, elements: [] });

    const cardId = await ensureCardInHand(player, admin, ECard.SteelFangPlus);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyChangeShield, enemyId: enemy.id, delta: -1 }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyTakeDamage, enemyId: enemy.id, damage: 2, isPiercing: false }),
    );
    expect(response.steps).not.toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyBlockDamage, enemyId: enemy.id }),
    );

    const updatedEnemy = response.player.enemies.find((e: any) => e.id === enemy.id);
    expect(updatedEnemy.hp).toBe(8);
    expect(updatedEnemy.shield).toBe(0);
  });

  it("щит=2: уничтожает 1 щит (→1), атака блокируется оставшимся щитом", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 2, elements: [] });

    const cardId = await ensureCardInHand(player, admin, ECard.SteelFangPlus);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyChangeShield, enemyId: enemy.id, delta: -1 }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyTakeDamage, enemyId: enemy.id, damage: 2, isPiercing: false }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyBlockDamage, enemyId: enemy.id }),
    );

    const updatedEnemy = response.player.enemies.find((e: any) => e.id === enemy.id);
    expect(updatedEnemy.hp).toBe(10);
    expect(updatedEnemy.shield).toBe(1);
  });

  it("враг погибает от 2 урона: шаг EnemyDeath после EnemyTakeDamage", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 2, shield: 0, elements: [] });

    const cardId = await ensureCardInHand(player, admin, ECard.SteelFangPlus);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    const damageIdx = response.steps.findIndex((s: any) => s.type === EDetailedStep.EnemyTakeDamage && s.enemyId === enemy.id);
    const deathIdx = response.steps.findIndex((s: any) => s.type === EDetailedStep.EnemyDeath && s.enemyId === enemy.id);
    expect(damageIdx).toBeGreaterThanOrEqual(0);
    expect(deathIdx).toBeGreaterThan(damageIdx);

    const deadEnemy = response.player.enemies.find((e: any) => !e.faceDown && e.id === enemy.id);
    expect(deadEnemy).toBeUndefined();
  });

  it("isUseAlternative + 1 энергия: добавляет 1 razorPoint, тратит 1 энергию", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { energy: 3 });
    await admin.request({ action: "admin.updatePlayer", playerId: player.playerId, razorPoints: 0 });

    const cardId = await ensureCardInHand(player, admin, ECard.SteelFangPlus);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id], isUseAlternative: true });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.PlayerStatChange, stat: "energy", delta: -1 }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.PlayerStatChange, stat: "razorPoints", playerId: player.playerId, delta: 1 }),
    );
    expect(response.player.razorPoints).toBe(1);
  });

  it("isUseAlternative + razorPoints=3: шаг razorPoints не генерируется", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { energy: 3 });
    await admin.request({ action: "admin.updatePlayer", playerId: player.playerId, razorPoints: 3 });

    const cardId = await ensureCardInHand(player, admin, ECard.SteelFangPlus);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id], isUseAlternative: true });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).not.toContainEqual(
      expect.objectContaining({ type: EDetailedStep.PlayerStatChange, stat: "razorPoints" }),
    );
    expect(response.player.razorPoints).toBe(3);
  });

  it("isUseAlternative + энергии нет: ошибка", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { energy: 0 });

    const cardId = await ensureCardInHand(player, admin, ECard.SteelFangPlus);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id], isUseAlternative: true });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
    expect(response.message).toContain("not enough energy");
  });

  it("ошибка: враг не передан", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const cardId = await ensureCardInHand(player, admin, ECard.SteelFangPlus);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
  });

  it("ошибка: недостаточно AP", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 0, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.SteelFangPlus);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
    expect(response.message).toContain("not enough action points");
  });

  it("второй игрок получает событие game.useCard с правильным player.playerId", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    const enemy = player1.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });

    const cardId = await ensureCardInHand(player1, admin, ECard.SteelFangPlus);

    player1.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const [res1, res2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(res1.card).toBe(ECard.SteelFangPlus);
    expect(res2.card).toBe(ECard.SteelFangPlus);
    expect(res2.player.playerId).toBe(player1.playerId);
  });
});
