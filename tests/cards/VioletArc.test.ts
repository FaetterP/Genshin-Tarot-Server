/**
 * VioletArc - Наносит 5 пронзающего урона всем врагам в вашей зоне, если на них есть Электро.
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
  spawnTestBoss,
  TestGame,
} from "../helpers/setup";

jest.setTimeout(15000);

describe("VioletArc — наносит 5 пронзающего урона всем врагам с Электро в зоне", () => {
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

  it("наносит 5 пронзающего урона врагу с Электро и вызывает реакцию Электро+Электро", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 20, shield: 0, elements: [EElement.Electro] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.VioletArc);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemy.id,
        damage: 5,
        isPiercing: true,
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
    const reactionDamageSteps = response.steps.filter(
      (s: any) =>
        s.type === EDetailedStep.EnemyTakeDamage &&
        s.enemyId === enemy.id &&
        s.damage === 2 &&
        s.isPiercing === true,
    );
    expect(reactionDamageSteps).toHaveLength(2);

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "actionPoints",
        playerId: player.playerId,
        delta: -2,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "discard",
        card: expect.objectContaining({ name: ECard.VioletArc }),
      }),
    );

    const updatedEnemy = response.player.enemies.find((e: any) => e.id === enemy.id);
    expect(updatedEnemy.hp).toBe(11);
  });

  it("враг без Электро не получает урона, карта используется нормально", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.VioletArc);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    const damageSteps = response.steps.filter((s: any) => s.type === EDetailedStep.EnemyTakeDamage && s.enemyId === enemy.id);
    expect(damageSteps).toHaveLength(0);

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "actionPoints",
        delta: -2,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "discard",
        card: expect.objectContaining({ name: ECard.VioletArc }),
      }),
    );

    const updatedEnemy = response.player.enemies.find((e: any) => e.id === enemy.id);
    expect(updatedEnemy.hp).toBe(10);
  });

  it("два врага: только тот, у кого есть Электро, получает урон", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy1 = player.enemies[0];
    await admin.updateEnemy(enemy1.id, { hp: 20, shield: 0, elements: [EElement.Electro] });

    await admin.addEnemy(player.playerId, EEnemy.HilichurlGuard);
    const syncMsg = await player.waitFor(
      (m: any) =>
        m.action === "admin.stateSync" &&
        m.you.enemies.filter((e: any) => !e.faceDown).length >= 2,
    );
    const visibleEnemies: { id: string }[] = syncMsg.you.enemies.filter((e: any) => !e.faceDown);
    const enemy2 = visibleEnemies.find((e) => e.id !== enemy1.id)!;
    await admin.updateEnemy(enemy2.id, { hp: 20, shield: 0, elements: [] });

    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });
    const cardId = await ensureCardInHand(player, admin, ECard.VioletArc);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemy1.id,
        damage: 5,
        isPiercing: true,
      }),
    );
    const enemy2DamageSteps = response.steps.filter((s: any) => s.type === EDetailedStep.EnemyTakeDamage && s.enemyId === enemy2.id);
    expect(enemy2DamageSteps).toHaveLength(0);

    const updatedEnemy2 = response.player.enemies.find((e: any) => e.id === enemy2.id);
    expect(updatedEnemy2.hp).toBe(20);
  });

  it("убивает врага с 5 HP и спавнит следующую волну", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 5, shield: 0, elements: [EElement.Electro] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.VioletArc);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemy.id,
        damage: 5,
        isPiercing: true,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyDeath,
        enemyId: enemy.id,
      }),
    );

    const damageIdx = response.steps.findIndex((s: any) => s.type === EDetailedStep.EnemyTakeDamage && s.enemyId === enemy.id);
    const deathIdx = response.steps.findIndex((s: any) => s.type === EDetailedStep.EnemyDeath && s.enemyId === enemy.id);
    expect(damageIdx).toBeLessThan(deathIdx);

    expect(response.player.enemies.some((e: any) => e.id === enemy.id)).toBe(false);
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "actionPoints",
        delta: -2,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "discard",
        card: expect.objectContaining({ name: ECard.VioletArc }),
      }),
    );
  });

  it("возвращает ошибку при недостаточном количестве AP", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [EElement.Electro] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 1, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.VioletArc);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
    expect(response.message).toContain("not enough action points");
  });

  it("второй игрок тоже получает событие game.useCard", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    const enemy = player1.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 20, shield: 0, elements: [EElement.Electro] });
    await admin.updatePlayer(player1.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player1, admin, ECard.VioletArc);

    player1.send({ action: "game.useCard", cardId });

    const [response1, response2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(response1.card).toBe(ECard.VioletArc);
    expect(response2.card).toBe(ECard.VioletArc);
    expect(response2.player.playerId).toBe(player1.playerId);
  });

  it("также наносит урон боссу с Электро в сессии", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const bossId = await spawnTestBoss(player, admin, EEnemy.Dvalin);
    await admin.updateBoss({ hp: 20, shield: 0, elements: [EElement.Electro] });
    await admin.updateEnemy(player.enemies[0].id, { elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.VioletArc);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: bossId,
        damage: 5,
        isPiercing: true,
      }),
    );
  });
});
