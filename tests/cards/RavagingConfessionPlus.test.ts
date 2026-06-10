/**
 * RavagingConfessionPlus - Накладывает Крио на 1 врага в зоне любого игрока.
 * Наносит 3 урона всем врагам в этой зоне. Если это добивает врага, даёт 2 энергии.
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

describe("RavagingConfessionPlus — накладывает Крио, 3 урона всей зоне, 2 энергии за добивание", () => {
  let game: TestGame;

  beforeAll(async () => { await startTestServers(); });
  afterAll(async () => { await stopTestServers(); });
  beforeEach(() => { resetGame(); });
  afterEach(() => { game?.cleanup(); });

  it("накладывает Крио на цель, наносит 3 урона, списывает 1 AP, карта в сброс", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.RavagingConfessionPlus);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyGetElement,
        enemyId: enemy.id,
        element: EElement.Cryo,
      }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.EnemyTakeDamage,
        enemyId: enemy.id,
        damage: 3,
        isPiercing: false,
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
        card: expect.objectContaining({ name: ECard.RavagingConfessionPlus }),
      }),
    );
    expect(response.player.enemies.find((e: any) => e.id === enemy.id).hp).toBe(7);
    expect(response.player.actionPoints.total).toBe(2);
  });

  it("щит блокирует урон — EnemyBlockDamage присутствует, HP не изменился", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 2, elements: [] });

    const cardId = await ensureCardInHand(player, admin, ECard.RavagingConfessionPlus);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyTakeDamage, enemyId: enemy.id, damage: 3, isPiercing: false }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyBlockDamage, enemyId: enemy.id }),
    );
    expect(response.player.enemies.find((e: any) => e.id === enemy.id).hp).toBe(10);
  });

  it("бьёт всех врагов в зоне — оба получают 3 урона", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy1 = player.enemies[0];

    await admin.addEnemy(player.playerId, EEnemy.HilichurlGuard);
    const syncMsg = await player.waitFor(
      (m: any) => m.action === "admin.stateSync" && m.you.enemies.length >= 2,
    );
    const enemy2Id: string = syncMsg.you.enemies.find(
      (e: any) => e.id !== enemy1.id && !e.faceDown,
    )?.id;
    await admin.updateEnemy(enemy1.id, { hp: 10, shield: 0, elements: [] });
    await admin.updateEnemy(enemy2Id, { hp: 10, shield: 0, elements: [] });

    const cardId = await ensureCardInHand(player, admin, ECard.RavagingConfessionPlus);

    player.send({ action: "game.useCard", cardId, enemies: [enemy1.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyTakeDamage, enemyId: enemy1.id, damage: 3 }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyTakeDamage, enemyId: enemy2Id, damage: 3 }),
    );
    expect(response.player.enemies.find((e: any) => e.id === enemy1.id).hp).toBe(7);
    expect(response.player.enemies.find((e: any) => e.id === enemy2Id).hp).toBe(7);
  });

  it("добивание врага — даёт 2 энергии игроку, EnemyDeath присутствует", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 3, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { energy: 0 });

    const cardId = await ensureCardInHand(player, admin, ECard.RavagingConfessionPlus);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyDeath, enemyId: enemy.id }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({
        type: EDetailedStep.PlayerStatChange,
        stat: "energy",
        playerId: player.playerId,
        delta: 2,
      }),
    );
    expect(response.player.enemies.some((e: any) => e.id === enemy.id)).toBe(false);
    expect(response.player.energy).toBe(2);
  });

  it("добивание двух врагов — даёт 2 энергии за каждого (итого 4)", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy1 = player.enemies[0];

    await admin.addEnemy(player.playerId, EEnemy.HilichurlGuard);
    const syncMsg = await player.waitFor(
      (m: any) => m.action === "admin.stateSync" && m.you.enemies.length >= 2,
    );
    const enemy2Id: string = syncMsg.you.enemies.find(
      (e: any) => e.id !== enemy1.id && !e.faceDown,
    )?.id;
    await admin.updateEnemy(enemy1.id, { hp: 3, shield: 0, elements: [] });
    await admin.updateEnemy(enemy2Id, { hp: 3, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { energy: 0 });

    const cardId = await ensureCardInHand(player, admin, ECard.RavagingConfessionPlus);

    player.send({ action: "game.useCard", cardId, enemies: [enemy1.id] });
    const response = await player.waitFor((m: any) => m.action === "game.useCard");

    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyDeath, enemyId: enemy1.id }),
    );
    expect(response.steps).toContainEqual(
      expect.objectContaining({ type: EDetailedStep.EnemyDeath, enemyId: enemy2Id }),
    );
    const energySteps = response.steps.filter(
      (s: any) => s.type === EDetailedStep.PlayerStatChange && s.stat === "energy" && s.delta === 2,
    );
    expect(energySteps).toHaveLength(2);
    expect(response.player.energy).toBe(4);
  });

  it("возвращает ошибку если enemies не переданы", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const cardId = await ensureCardInHand(player, admin, ECard.RavagingConfessionPlus);

    player.send({ action: "game.useCard", cardId });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
  });

  it("возвращает ошибку при недостаточном количестве AP", async () => {
    game = await createTestGame();
    const [player] = game.players;
    const { admin } = game;

    const enemy = player.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player.playerId, { actionPoints: { normal: 0, extra: 0 } });

    const cardId = await ensureCardInHand(player, admin, ECard.RavagingConfessionPlus);

    player.send({ action: "game.useCard", cardId, enemies: [enemy.id] });
    const response = await player.waitFor((m: any) => m.status !== undefined);

    expect(response.status).toBe("error");
    expect(response.message).toContain("not enough action points");
  });

  it("второй игрок тоже получает событие game.useCard", async () => {
    game = await createTestGame(2);
    const [player1, player2] = game.players;
    const { admin } = game;

    const enemy = player1.enemies[0];
    await admin.updateEnemy(enemy.id, { hp: 10, shield: 0, elements: [] });
    await admin.updatePlayer(player1.playerId, { actionPoints: { normal: 3, extra: 0 } });

    const cardId = await ensureCardInHand(player1, admin, ECard.RavagingConfessionPlus);

    player1.send({ action: "game.useCard", cardId, enemies: [enemy.id] });

    const [response1, response2] = await Promise.all([
      player1.waitFor((m: any) => m.action === "game.useCard"),
      player2.waitFor((m: any) => m.action === "game.useCard"),
    ]);

    expect(response1.card).toBe(ECard.RavagingConfessionPlus);
    expect(response2.card).toBe(ECard.RavagingConfessionPlus);
    expect(response2.player.playerId).toBe(player1.playerId);
  });
});
