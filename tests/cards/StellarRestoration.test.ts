/**
 * StellarRestoration - Накладывает Электро 1 врагу где угодно.
 * Вы можете перевернуть 1 другого врага где угодно лицом вниз, удалив с него все метки,
 * и разместить его сверху первого.
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
  endTurn,
  TestGame,
} from "../helpers/setup";

jest.setTimeout(15000);

describe("StellarRestoration — накладывает Электро врагу, опционально переворачивает другого врага лицом вниз", () => {
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

  it("накладывает Электро на врага, 1 AP, карта в сброс", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });

    const cardId = await ensureCardInHand(player, admin, ECard.StellarRestoration);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

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
        card: expect.objectContaining({ name: ECard.StellarRestoration }),
      }),
    );

    const updatedEnemy = response.player.enemies.find((e: any) => e.id === enemy.id);
    expect(updatedEnemy).toBeDefined();
    expect(updatedEnemy.hp).toBe(10);
  });

  it("Электро+Электро вызывает реакцию EnemyReaction", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [EElement.Electro] });

    const cardId = await ensureCardInHand(player, admin, ECard.StellarRestoration);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyReaction,
        enemyId: enemy.id,
        element1: EElement.Electro,
        element2: EElement.Electro,
      }),
    );
  });

  it("переворачивает второго врага лицом вниз под первого: enemy1 остаётся активным, enemy2 пропадает из enemies", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy1 = player.enemies[0];
    await admin.updateEnemy(enemy1.id, { hp: 10, shield: 0, elements: [] });

    await admin.addEnemy(player.playerId, EEnemy.HilichurlGuard);
    const syncMsg = await player.waitFor((m: any) => m.action === "admin.stateSync" && m.you.enemies.filter((e: any) => !e.faceDown).length >= 2);
    const enemies: { id: string }[] = syncMsg.you.enemies.filter((e: any) => !e.faceDown);
    const enemy2 = enemies.find((e) => e.id !== enemy1.id)!;
    await admin.updateEnemy(enemy2.id, { hp: 8, shield: 1, elements: [EElement.Geo] });

    const cardId = await ensureCardInHand(player, admin, ECard.StellarRestoration);

    player.send({ action: "game.useCard", cardId, enemies: [enemy1.id, enemy2.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyGetElement,
        enemyId: enemy1.id,
        element: EElement.Electro,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyFlipFaceDown,
        enemy: expect.objectContaining({ id: enemy2.id }),
        coveredByEnemyId: enemy1.id,
      }),
    );

    expect(response.player.enemies.some((e: any) => !e.faceDown && e.id === enemy1.id)).toBe(true);
    expect(response.player.enemies.some((e: any) => !e.faceDown && e.id === enemy2.id)).toBe(false);
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.PlayerStatChange, stat: "actionPoints", delta: -1 }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.MoveCard, to: "discard", card: expect.objectContaining({ name: ECard.StellarRestoration }) }),
    );
  });

  it("enemy2 остаётся скрытым в цикле 2, пока enemy1 жив", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy1 = player.enemies[0];
    await admin.updateEnemy(enemy1.id, { hp: 10, shield: 0, elements: [] });

    await admin.addEnemy(player.playerId, EEnemy.HilichurlGuard);
    const syncMsg = await player.waitFor((m: any) => m.action === "admin.stateSync" && m.you.enemies.filter((e: any) => !e.faceDown).length >= 2);
    const enemies: { id: string }[] = syncMsg.you.enemies.filter((e: any) => !e.faceDown);
    const enemy2 = enemies.find((e) => e.id !== enemy1.id)!;
    await admin.updateEnemy(enemy2.id, { hp: 8, shield: 0, elements: [] });

    const cardId = await ensureCardInHand(player, admin, ECard.StellarRestoration);

    player.send({ action: "game.useCard", cardId, enemies: [enemy1.id, enemy2.id] });
    await player.waitFor((m: any) => m.action === "game.useCard");

    await admin.setLeylines([]);
    const cycle2 = await endTurn(player);

    expect(cycle2.you.enemies.some((e: any) => !e.faceDown && e.id === enemy1.id)).toBe(true);
    expect(cycle2.you.enemies.some((e: any) => !e.faceDown && e.id === enemy2.id)).toBe(false);
  });

  it("возвращает ошибку когда враги не указаны", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const cardId = await ensureCardInHand(player, admin, ECard.StellarRestoration);

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

    const cardId = await ensureCardInHand(player1, admin, ECard.StellarRestoration);

    player1.send({ action: "game.useCard", cardId, enemies: [enemy.id] });

    const [response1, response2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(response1.card).toBe(ECard.StellarRestoration);
    expect(response2.card).toBe(ECard.StellarRestoration);
    expect(response2.player.playerId).toBe(player1.playerId);
  });
});
