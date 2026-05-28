/**
 * StellarRestorationPlus - Накладывает Электро 3 разным врагам где угодно. Даёт 2 энергии.
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

describe("StellarRestorationPlus — накладывает Электро 3 разным врагам где угодно, даёт 2 энергии", () => {
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

  it("накладывает Электро на 3 разных врага, даёт 2 энергии, 1 AP, карта в сброс", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy1 = player.enemies[0];
    await admin.updateEnemy(enemy1.id, { hp: 10, shield: 0, elements: [] });

    await admin.addEnemy(player.playerId, EEnemy.HilichurlGuard);
    let syncMsg = await player.waitFor(
      (m: any) => m.action === "admin.stateSync" && m.you.enemies.length >= 2,
    );
    let allEnemies: { id: string }[] = syncMsg.you.enemies;
    const enemy2 = allEnemies.find((e) => e.id !== enemy1.id)!;
    await admin.updateEnemy(enemy2.id, { hp: 10, shield: 0, elements: [] });

    await admin.addEnemy(player.playerId, EEnemy.HilichurlGuard);
    syncMsg = await player.waitFor(
      (m: any) => m.action === "admin.stateSync" && m.you.enemies.length >= 3,
    );
    allEnemies = syncMsg.you.enemies;
    const enemy3 = allEnemies.find((e) => e.id !== enemy1.id && e.id !== enemy2.id)!;
    await admin.updateEnemy(enemy3.id, { hp: 10, shield: 0, elements: [] });

    await admin.updatePlayer(player.playerId, { energy: 0 });

    const cardId = await ensureCardInHand(player, admin, ECard.StellarRestorationPlus);

    player.send({ action: "game.useCard", cardId, enemies: [enemy1.id, enemy2.id, enemy3.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyGetElement, enemyId: enemy1.id, element: EElement.Electro }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyGetElement, enemyId: enemy2.id, element: EElement.Electro }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyGetElement, enemyId: enemy3.id, element: EElement.Electro }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.PlayerStatChange, stat: "energy", playerId: player.playerId, delta: 2 }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.PlayerStatChange, stat: "actionPoints", playerId: player.playerId, delta: -1 }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.MoveCard,
        to: "discard",
        card: expect.objectContaining({ name: ECard.StellarRestorationPlus }),
      }),
    );

    expect(response.player.energy).toBe(2);
  });

  it("три EnemyGetElement имеют разные enemyId", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy1 = player.enemies[0];
    await admin.updateEnemy(enemy1.id, { hp: 10, shield: 0, elements: [] });

    await admin.addEnemy(player.playerId, EEnemy.HilichurlGuard);
    let syncMsg = await player.waitFor(
      (m: any) => m.action === "admin.stateSync" && m.you.enemies.length >= 2,
    );
    let allEnemies: { id: string }[] = syncMsg.you.enemies;
    const enemy2 = allEnemies.find((e) => e.id !== enemy1.id)!;
    await admin.updateEnemy(enemy2.id, { hp: 10, shield: 0, elements: [] });

    await admin.addEnemy(player.playerId, EEnemy.HilichurlGuard);
    syncMsg = await player.waitFor(
      (m: any) => m.action === "admin.stateSync" && m.you.enemies.length >= 3,
    );
    allEnemies = syncMsg.you.enemies;
    const enemy3 = allEnemies.find((e) => e.id !== enemy1.id && e.id !== enemy2.id)!;
    await admin.updateEnemy(enemy3.id, { hp: 10, shield: 0, elements: [] });

    const cardId = await ensureCardInHand(player, admin, ECard.StellarRestorationPlus);

    player.send({ action: "game.useCard", cardId, enemies: [enemy1.id, enemy2.id, enemy3.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    const getElementSteps = response.steps.filter(
      (s: any) => s.type === EDetailedStep.EnemyGetElement && s.element === EElement.Electro,
    );
    const enemyIds = getElementSteps.map((s: any) => s.enemyId);
    const uniqueIds = new Set(enemyIds);
    expect(uniqueIds.size).toBe(3);
  });

  it("работает с 1 врагом (меньше 3): накладывает Электро на доступного, даёт 2 энергии", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { energy: 0 });

    const cardId = await ensureCardInHand(player, admin, ECard.StellarRestorationPlus);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyGetElement, enemyId: enemy.id, element: EElement.Electro }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.PlayerStatChange, stat: "energy", delta: 2 }),
    );

    const getElementSteps = response.steps.filter(
      (s: any) => s.type === EDetailedStep.EnemyGetElement && s.element === EElement.Electro,
    );
    expect(getElementSteps).toHaveLength(1);

    expect(response.player.energy).toBe(2);
  });

  it("возвращает ошибку когда враги не указаны", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const cardId = await ensureCardInHand(player, admin, ECard.StellarRestorationPlus);

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

    const cardId = await ensureCardInHand(player1, admin, ECard.StellarRestorationPlus);

    player1.send({ action: "game.useCard", cardId, enemies: [enemy.id] });

    const [response1, response2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(response1.card).toBe(ECard.StellarRestorationPlus);
    expect(response2.card).toBe(ECard.StellarRestorationPlus);
    expect(response2.player.playerId).toBe(player1.playerId);
  });
});
