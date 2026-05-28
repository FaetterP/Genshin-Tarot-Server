/**
 * MaidsBladework - Уничтожает 1 щит 1 врагу в вашей зоне. Наносит 2 урона, если у врага нет щитов.
 * Можно потратить 1 ОД для повторения этого эффекта на том же враге.
 * Тип: Attack. Стоимость: 1
 */

import { expect, describe, beforeAll, afterAll, jest, beforeEach, afterEach, it } from "@jest/globals";
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

describe("MaidsBladework — уничтожает 1 щит или наносит 2 урона, опционально повторяет эффект", () => {
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

  it("снимает 1 щит врагу, не нанося урона", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updateEnemy(player.enemies[0].id, { hp: 10, shield: 3, elements: [] });
    const enemy = player.enemies[0];
    const cardId = await ensureCardInHand(player, admin, ECard.MaidsBladework);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyChangeShield, enemyId: enemy.id, delta: -1 }),
    );
    expect(response.steps).not.toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyTakeDamage, enemyId: enemy.id }),
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
        card: expect.objectContaining({ name: ECard.MaidsBladework }),
      }),
    );
    const enemyState = response.player.enemies.find((e: any) => e.id === enemy.id);
    expect(enemyState?.hp).toBe(10);
  });

  it("наносит 2 урона врагу без щита", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updateEnemy(player.enemies[0].id, { hp: 10, shield: 0, elements: [] });
    const enemy = player.enemies[0];
    const cardId = await ensureCardInHand(player, admin, ECard.MaidsBladework);

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
    expect(response.steps).not.toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyChangeShield }),
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
        card: expect.objectContaining({ name: ECard.MaidsBladework }),
      }),
    );
    const enemyState = response.player.enemies.find((e: any) => e.id === enemy.id);
    expect(enemyState?.hp).toBe(8);
  });

  it("убивает врага с HP=2 и без щита", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updateEnemy(player.enemies[0].id, { hp: 2, shield: 0, elements: [] });
    const enemy = player.enemies[0];
    const cardId = await ensureCardInHand(player, admin, ECard.MaidsBladework);

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
    expect(response.player.enemies.some((e: any) => e.id === enemy.id)).toBe(false);
  });

  it("isUseAlternative=true: снимает 2 щита при shield=2", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updateEnemy(player.enemies[0].id, { hp: 10, shield: 2, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });
    const enemy = player.enemies[0];
    const cardId = await ensureCardInHand(player, admin, ECard.MaidsBladework);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id], isUseAlternative: true });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    const shieldSteps = response.steps.filter(
      (s: any) => s.type === EDetailedStep.EnemyChangeShield && s.enemyId === enemy.id,
    );
    expect(shieldSteps).toHaveLength(2);
    expect(shieldSteps[0]).toMatchObject({ delta: -1 });
    expect(shieldSteps[1]).toMatchObject({ delta: -1 });
    const enemyState = response.player.enemies.find((e: any) => e.id === enemy.id);
    expect(enemyState?.hp).toBe(10);
  });

  it("isUseAlternative=true: снимает 1 щит, затем наносит 2 урона при shield=1", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updateEnemy(player.enemies[0].id, { hp: 10, shield: 1, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });
    const enemy = player.enemies[0];
    const cardId = await ensureCardInHand(player, admin, ECard.MaidsBladework);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id], isUseAlternative: true });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyChangeShield, enemyId: enemy.id, delta: -1 }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemy.id,
        damage: 2,
        isPiercing: false,
      }),
    );
    const shieldIdx = response.steps.findIndex(
      (s: any) => s.type === EDetailedStep.EnemyChangeShield && s.enemyId === enemy.id,
    );
    const damageIdx = response.steps.findIndex(
      (s: any) => s.type === EDetailedStep.EnemyTakeDamage && s.enemyId === enemy.id,
    );
    expect(shieldIdx).toBeLessThan(damageIdx);
    const enemyState = response.player.enemies.find((e: any) => e.id === enemy.id);
    expect(enemyState?.hp).toBe(8);
  });

  it("isUseAlternative=true: наносит 2+2 урона при отсутствии щита", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updateEnemy(player.enemies[0].id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });
    const enemy = player.enemies[0];
    const cardId = await ensureCardInHand(player, admin, ECard.MaidsBladework);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id], isUseAlternative: true });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    const damageSteps = response.steps.filter(
      (s: any) => s.type === EDetailedStep.EnemyTakeDamage && s.enemyId === enemy.id,
    );
    expect(damageSteps).toHaveLength(2);
    expect(damageSteps[0]).toMatchObject({ damage: 2, isPiercing: false });
    expect(damageSteps[1]).toMatchObject({ damage: 2, isPiercing: false });
    const enemyState = response.player.enemies.find((e: any) => e.id === enemy.id);
    expect(enemyState?.hp).toBe(6);
  });

  it("isUseAlternative=true: первый удар убивает врага — второй удар не выполняется", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updateEnemy(player.enemies[0].id, { hp: 2, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });
    const enemy = player.enemies[0];
    const cardId = await ensureCardInHand(player, admin, ECard.MaidsBladework);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id], isUseAlternative: true });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyDeath, enemyId: enemy.id }),
    );
    const damageSteps = response.steps.filter(
      (s: any) => s.type === EDetailedStep.EnemyTakeDamage && s.enemyId === enemy.id,
    );
    expect(damageSteps).toHaveLength(1);
    // AP не списывается за второй удар по мёртвому врагу
    expect(response.player.actionPoints.total).toBe(2);
  });

  it("возвращает ошибку при отсутствии обязательного поля enemies", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const cardId = await ensureCardInHand(player, admin, ECard.MaidsBladework);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
  });

  it("возвращает ошибку при нехватке ОД", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    await admin.updateEnemy(player.enemies[0].id, { hp: 10, shield: 0 });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 0, extra: 0 } });
    const enemy = player.enemies[0];
    const cardId = await ensureCardInHand(player, admin, ECard.MaidsBladework);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
  });

  it("второй игрок получает событие game.useCard", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    await admin.updateEnemy(player1.enemies[0].id, { hp: 10, shield: 0, elements: [] });
    const enemy = player1.enemies[0];
    const cardId = await ensureCardInHand(player1, admin, ECard.MaidsBladework);

    player1.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const [res1, res2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(res1.player.playerId).toBe(player1.playerId);
    expect(res2.player.playerId).toBe(player1.playerId);
    expect(res1.card).toBe(ECard.MaidsBladework);
    expect(res2.card).toBe(ECard.MaidsBladework);
  });
});
