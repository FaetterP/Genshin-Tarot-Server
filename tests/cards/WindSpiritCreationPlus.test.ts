/**
 * WindSpiritCreationPlus - Накладывает Анемо и наносит 2 пронзающих урона 2 разным врагам где угодно.
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

describe("WindSpiritCreationPlus — 2 пронзающих урона + Анемо на 2 разных врагов", () => {
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

  it("наносит 2 пронзающих урона и накладывает Анемо на 2 врагов (основной сценарий)", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const e1 = player.enemies[0];
    await admin.updateEnemy(e1.id, { hp: 10, shield: 0, elements: [] });

    await admin.addEnemy(player.playerId, EEnemy.HilichurlGuard);
    const syncMsg = await player.waitFor(
      (m: any) => m.action === "admin.stateSync" && m.you.enemies.filter((e: any) => !e.faceDown).length >= 2,
    );
    const e2 = syncMsg.you.enemies.filter((e: any) => !e.faceDown).find((e: any) => e.id !== e1.id);
    await admin.updateEnemy(e2.id, { hp: 8, shield: 0, elements: [] });

    const cardId = await ensureCardInHand(player, admin, ECard.WindSpiritCreationPlus);

    player.send({ action: "game.useCard", cardId, enemies: [e1.id, e2.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: e1.id,
        damage: 2,
        isPiercing: true,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyGetElement,
        enemyId: e1.id,
        element: EElement.Anemo,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: e2.id,
        damage: 2,
        isPiercing: true,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyGetElement,
        enemyId: e2.id,
        element: EElement.Anemo,
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
        card: expect.objectContaining({ name: ECard.WindSpiritCreationPlus }),
      }),
    );

    const updated1 = response.player.enemies.find((e: any) => e.id === e1.id);
    const updated2 = response.player.enemies.find((e: any) => e.id === e2.id);
    expect(updated1.hp).toBe(8);
    expect(updated2.hp).toBe(6);
  });

  it("пронзает щиты обоих врагов — урон проходит при shield > 0", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const e1 = player.enemies[0];
    await admin.updateEnemy(e1.id, { hp: 10, shield: 3, elements: [] });

    await admin.addEnemy(player.playerId, EEnemy.HilichurlGuard);
    const syncMsg = await player.waitFor(
      (m: any) => m.action === "admin.stateSync" && m.you.enemies.filter((e: any) => !e.faceDown).length >= 2,
    );
    const e2 = syncMsg.you.enemies.filter((e: any) => !e.faceDown).find((e: any) => e.id !== e1.id);
    await admin.updateEnemy(e2.id, { hp: 8, shield: 2, elements: [] });

    const cardId = await ensureCardInHand(player, admin, ECard.WindSpiritCreationPlus);

    player.send({ action: "game.useCard", cardId, enemies: [e1.id, e2.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).not.toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyBlockDamage }),
    );

    const updated1 = response.player.enemies.find((e: any) => e.id === e1.id);
    const updated2 = response.player.enemies.find((e: any) => e.id === e2.id);
    expect(updated1.hp).toBe(8);
    expect(updated2.hp).toBe(6);
    expect(updated1.shield).toBe(3);
    expect(updated2.shield).toBe(2);
  });

  it("реакция Анемо на одном враге — EnemyReaction + Рывок в сброс", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const e1 = player.enemies[0];
    await admin.updateEnemy(e1.id, { hp: 10, shield: 0, elements: [EElement.Pyro] });

    await admin.addEnemy(player.playerId, EEnemy.HilichurlGuard);
    const syncMsg = await player.waitFor(
      (m: any) => m.action === "admin.stateSync" && m.you.enemies.filter((e: any) => !e.faceDown).length >= 2,
    );
    const e2 = syncMsg.you.enemies.filter((e: any) => !e.faceDown).find((e: any) => e.id !== e1.id);
    await admin.updateEnemy(e2.id, { hp: 8, shield: 0, elements: [] });

    const cardId = await ensureCardInHand(player, admin, ECard.WindSpiritCreationPlus);

    player.send({ action: "game.useCard", cardId, enemies: [e1.id, e2.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyReaction,
        enemyId: e1.id,
      }),
    );
    expect(response.steps).not.toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyReaction, enemyId: e2.id }),
    );
    expect(response.player.discard.some((c: any) => c.name === ECard.Dash)).toBe(true);
    expect(response.player.discard.filter((c: any) => c.name === ECard.Dash).length).toBe(1);
  });

  it("реакции у обоих врагов — два EnemyReaction + два Рывка в сброс", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const e1 = player.enemies[0];
    await admin.updateEnemy(e1.id, { hp: 10, shield: 0, elements: [EElement.Pyro] });

    await admin.addEnemy(player.playerId, EEnemy.HilichurlGuard);
    const syncMsg = await player.waitFor(
      (m: any) => m.action === "admin.stateSync" && m.you.enemies.filter((e: any) => !e.faceDown).length >= 2,
    );
    const e2 = syncMsg.you.enemies.filter((e: any) => !e.faceDown).find((e: any) => e.id !== e1.id);
    await admin.updateEnemy(e2.id, { hp: 8, shield: 0, elements: [EElement.Geo] });

    const cardId = await ensureCardInHand(player, admin, ECard.WindSpiritCreationPlus);

    player.send({ action: "game.useCard", cardId, enemies: [e1.id, e2.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyReaction, enemyId: e1.id }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyReaction, enemyId: e2.id }),
    );
    const dashCount = response.player.discard.filter((c: any) => c.name === ECard.Dash).length;
    expect(dashCount).toBe(2);
  });

  it("один из врагов умирает — EnemyDeath, враг исчезает из списка", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const e1 = player.enemies[0];
    await admin.updateEnemy(e1.id, { hp: 1, shield: 0, elements: [] });

    await admin.addEnemy(player.playerId, EEnemy.HilichurlGuard);
    const syncMsg = await player.waitFor(
      (m: any) => m.action === "admin.stateSync" && m.you.enemies.filter((e: any) => !e.faceDown).length >= 2,
    );
    const e2 = syncMsg.you.enemies.filter((e: any) => !e.faceDown).find((e: any) => e.id !== e1.id);
    await admin.updateEnemy(e2.id, { hp: 10, shield: 0, elements: [] });

    const cardId = await ensureCardInHand(player, admin, ECard.WindSpiritCreationPlus);

    player.send({ action: "game.useCard", cardId, enemies: [e1.id, e2.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyDeath, enemyId: e1.id }),
    );

    const damageIdx = response.steps.findIndex((s: any) => s.type === EDetailedStep.EnemyTakeDamage && s.enemyId === e1.id);
    const deathIdx = response.steps.findIndex((s: any) => s.type === EDetailedStep.EnemyDeath && s.enemyId === e1.id);
    expect(damageIdx).toBeLessThan(deathIdx);

    expect(response.player.enemies.some((e: any) => !e.faceDown && e.id === e1.id)).toBe(false);
    expect(response.player.enemies.some((e: any) => !e.faceDown && e.id === e2.id)).toBe(true);
  });

  it("isRange — оба врага могут быть из разных зон (2 игрока)", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    const e1 = player1.enemies[0];
    const e2 = player2.enemies[0];
    await admin.updateEnemy(e1.id, { hp: 10, shield: 0, elements: [] });
    await admin.updateEnemy(e2.id, { hp: 8, shield: 0, elements: [] });

    const cardId = await ensureCardInHand(player1, admin, ECard.WindSpiritCreationPlus);

    player1.send({ action: "game.useCard", cardId, enemies: [e1.id, e2.id] });
    const response = await player1.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyTakeDamage, enemyId: e1.id, damage: 2 }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyTakeDamage, enemyId: e2.id, damage: 2 }),
    );
  });

  it("возвращает ошибку при отсутствии врагов", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const cardId = await ensureCardInHand(player, admin, ECard.WindSpiritCreationPlus);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
    expect(response.message).toBe("no enemies");
  });

  it("возвращает ошибку при передаче одного врага дважды", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });

    const cardId = await ensureCardInHand(player, admin, ECard.WindSpiritCreationPlus);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id, enemy.id] });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
    expect(response.message).toBe("need 2 different enemies");
  });

  it("возвращает ошибку при передаче только одного врага", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });

    const cardId = await ensureCardInHand(player, admin, ECard.WindSpiritCreationPlus);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
    expect(response.message).toBe("need 2 different enemies");
  });

  it("возвращает ошибку при передаче более двух врагов", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    const e1 = player1.enemies[0];
    const e2 = player2.enemies[0];
    await admin.updateEnemy(e1.id, { hp: 10, shield: 0, elements: [] });
    await admin.updateEnemy(e2.id, { hp: 8, shield: 0, elements: [] });

    await admin.addEnemy(player1.playerId, EEnemy.HilichurlGuard);
    const syncMsg = await player1.waitFor(
      (m: any) => m.action === "admin.stateSync" && m.you.enemies.filter((e: any) => !e.faceDown).length >= 2,
    );
    const e3 = syncMsg.you.enemies.filter((e: any) => !e.faceDown).find((e: any) => e.id !== e1.id);

    const cardId = await ensureCardInHand(player1, admin, ECard.WindSpiritCreationPlus);

    player1.send({ action: "game.useCard", cardId, enemies: [e1.id, e2.id, e3.id] });
    const response = await player1.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
    expect(response.message).toBe("too many enemies");
  });

  it("возвращает ошибку при недостаточном количестве AP", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const e1 = player.enemies[0];
    await admin.updateEnemy(e1.id, { hp: 10, shield: 0, elements: [] });

    await admin.addEnemy(player.playerId, EEnemy.HilichurlGuard);
    const syncMsg = await player.waitFor(
      (m: any) => m.action === "admin.stateSync" && m.you.enemies.filter((e: any) => !e.faceDown).length >= 2,
    );
    const e2 = syncMsg.you.enemies.filter((e: any) => !e.faceDown).find((e: any) => e.id !== e1.id);
    await admin.updateEnemy(e2.id, { hp: 8, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 0, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.WindSpiritCreationPlus);

    player.send({ action: "game.useCard", cardId, enemies: [e1.id, e2.id] });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
    expect(response.message).toContain("not enough action points");
  });

  it("второй игрок тоже получает событие game.useCard", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    const e1 = player1.enemies[0];
    const e2 = player2.enemies[0];
    await admin.updateEnemy(e1.id, { hp: 10, shield: 0, elements: [] });
    await admin.updateEnemy(e2.id, { hp: 8, shield: 0, elements: [] });

    const cardId = await ensureCardInHand(player1, admin, ECard.WindSpiritCreationPlus);

    player1.send({ action: "game.useCard", cardId, enemies: [e1.id, e2.id] });

    const [response1, response2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(response1.card).toBe(ECard.WindSpiritCreationPlus);
    expect(response2.card).toBe(ECard.WindSpiritCreationPlus);
    expect(response2.player.playerId).toBe(player1.playerId);
  });
});
